'use server';

import { assertOrLog } from '../../util/debug';
import { serverLogger } from '../../util/logger';
import { Mutex, MutexInterface, withTimeout } from 'async-mutex';
import { getWeekArtWorkData } from './api.backend';

export interface QuizContext {
    artist?: string;
    tag?: string;
    style?: string;
    page: number;
}

type QuizContextID = string;

interface ContextHashNode {
    schedulerIndex: number;
    scheduleCount: number;
    isFixed: boolean;
    context: QuizContext;
}

type ContextHashMap = Map<QuizContextID, ContextHashNode>;

/*TODO
- 앱 실행시 즉시 실행 로직구현
- 싱글톤으로 구현
- Q.pubic 함수는 static으로 사용해야하는가?
*/

class QuizContextScheduler {
    private SCHEDULER_SIZE = 10;
    private SCHEDULER_EMPTY = 'this.SCHEDULER_EMPTY';
    // const QUEUE_SIZE = this.SCHEDULER_SIZE * 5;

    private MUTEX_TIMEOUT_MS = 10000;
    private OPTIMIZE_INTERVAL_MS = 600000;

    private _schedulerIdx: number;
    private _scheduler: QuizContextID[];
    // const _queue: QuizContext[] = [];

    private _contextHashMap: ContextHashMap;

    private mutex: MutexInterface;

    private optimizerTimer: NodeJS.Timeout | null;

    constructor() {
        //Q. Map() 과 object는 어떤 차이가 있는가? 둘다 해시 처럼 사용가능한데.
        this._contextHashMap = new Map<string, ContextHashNode>();
        this._scheduler = [];
        this._schedulerIdx = 0;
        this.mutex = withTimeout(
            new Mutex(),
            this.MUTEX_TIMEOUT_MS,
            new Error(`Timeout Mutex  Release ${this.MUTEX_TIMEOUT_MS}`),
        );
        this.optimizerTimer = null;
    }

    async init(fixedContext: QuizContext[]) {
        if (fixedContext.length > this.SCHEDULER_SIZE) {
            throw new Error(
                `fixedContext length is over max this._scheduler size` +
                    `this.SCHEDULER_SIZE : ${this.SCHEDULER_SIZE} ` +
                    `${JSON.stringify(fixedContext, null, 2)}`,
            );
        }

        await this.addContext(fixedContext, true);

        assertOrLog(this._scheduler.length !== 0);

        while (this._scheduler.length < this.SCHEDULER_SIZE) {
            this._scheduler.push(this.SCHEDULER_EMPTY);
        }
    }

    async scheduleContext(): Promise<QuizContext> {
        /*TODO
        - 일정 확률로, 이미 전달받은 context를 전달받을 수 있으므로, 중복 context 제공 예방필요.
        - 단, 사용자가 충분히 존재하거나 데이터가 충분히 많으면 고려 할것.
        */
        let idx = this._schedulerIdx;
        let loop = 0;
        const size = this.SCHEDULER_SIZE;

        await this.mutex.acquire();
        try {
            do {
                idx = (idx + 1) % size;
                loop++;
            } while (loop < size && this._scheduler[idx] === this.SCHEDULER_EMPTY);

            if (loop == size && this._scheduler[idx] === this.SCHEDULER_EMPTY) {
                serverLogger.error(
                    `[${QuizContextScheduler.name}] this._schedulerIdx : ${this._schedulerIdx}` +
                        `${JSON.stringify(this._contextHashMap, null, 2)}` +
                        `${JSON.stringify(this._scheduler, null, 2)}` +
                        `${JSON.stringify(this._scheduler)}`,
                );
                throw new Error(
                    `No Context exist` +
                        `current Scheduler Idx : ${this._schedulerIdx}` +
                        `${JSON.stringify(this._scheduler)}`,
                );
            }

            const id: QuizContextID = this._scheduler[idx];
            assertOrLog(this._contextHashMap.has(id), `schedule context must exist`);

            if (!this._contextHashMap.has(id)) {
                serverLogger.error(
                    `[${QuizContextScheduler.name}] this._schedulerIdx : ${this._schedulerIdx}` +
                        `${JSON.stringify(this._contextHashMap, null, 2)}` +
                        `${JSON.stringify(this._scheduler, null, 2)}` +
                        `${JSON.stringify(this._scheduler)}`,
                );
                throw new Error(`${id} is not in hashMap`);
            }

            this._schedulerIdx = idx;

            const node: ContextHashNode = this._contextHashMap.get(id)!;
            node.scheduleCount++;
            assertOrLog(
                this._schedulerIdx === node.schedulerIndex,
                `Should synchronize idx and node's index` +
                    `this._schedulerIdx : ${this._schedulerIdx}` +
                    `${JSON.stringify(node, null, 2)}`,
            );

            return node.context;
        } finally {
            this.mutex.release();
        }
    }

    async requestAddContext(contexts: QuizContext[]): Promise<void> {
        const targets: QuizContext[] = [];

        if (contexts.length === this.SCHEDULER_SIZE) {
            //throttling 사용하여 schedule() 호출 고려
            return;
        }

        const emptyIndexes = await this.getEmptyIndex();

        targets.push(...contexts.slice(0, emptyIndexes.length));

        /*TODO
        - Q.race condition 예방이 필요한가?
        - Q.addContext() 함수도 비동기여야 하는가?
        */

        return this.addContext(targets, false).then(() => {
            serverLogger.info(
                `[${QuizContextScheduler.name}] requestAddContext() completes request`,
            );
            return new Promise((res) => res());
        });
    }

    async requestUpdateFixedContexts(newContexts: QuizContext[]) {
        /*TODO
        - 리팩토링을 통해 mutex.release() 관리
        */
        if (newContexts.length === 0) {
            serverLogger.error(`[${QuizContextScheduler.name}] can't update empty array`);
            return;
        }
        if (newContexts.length > this.SCHEDULER_SIZE) {
            serverLogger.error(
                `[${QuizContextScheduler.name}] ${JSON.stringify(newContexts)} ` +
                    `this._schedulerIdx : ${this._schedulerIdx}` +
                    `${JSON.stringify(this._contextHashMap, null, 2)}` +
                    `${JSON.stringify(this._scheduler, null, 2)}` +
                    `${JSON.stringify(this._scheduler)}`,
            );
            serverLogger.error(
                `[${QuizContextScheduler.name}] updateFixedContexts() failed. Not Enough Size.` +
                    `${JSON.stringify(newContexts, null, 2)}`,
            );
            // throw new Error(`updateFixedContexts() failed. Not Enough Size`);
            return;
        }
        const ids = newContexts.map((ctx) => this.transformHashKey(ctx));

        await this.mutex.acquire();
        const newIDs = ids.filter((id) => !this._contextHashMap.has(id));
        const existIDs = ids.filter((id) => this._contextHashMap.has(id));

        let loop = 0;
        const max_loop = 20;

        //resize with backup

        this._scheduler.forEach((id) => {
            if (this._contextHashMap.has(id)) {
                this._contextHashMap.get(id)!.isFixed = false;
            } else {
                serverLogger.error(
                    `[${QuizContextScheduler.name}] Scheduled ID should save Hash Node. please check add & delete logic. \n` +
                        `id : ${id}` +
                        `this._schedulerIdx : ${this._schedulerIdx}}`,
                );
            }
        });

        existIDs.forEach((id) => {
            if (this._contextHashMap.has(id)) {
                this._contextHashMap.get(id)!.isFixed = true;
            }
        });
        await this.mutex.release();

        const emptyIndexes: number[] = await this.getEmptyIndex();

        while (emptyIndexes.length < newIDs.length) {
            await this.deleteMostViewQuiz();
            loop++;

            if (loop > max_loop) {
                serverLogger.error(
                    `[${QuizContextScheduler.name}] ${JSON.stringify(newContexts, null, 2)} ` +
                        `this._schedulerIdx : ${this._schedulerIdx}` +
                        `${JSON.stringify(this._contextHashMap, null, 2)}` +
                        `${JSON.stringify(this._scheduler, null, 2)}` +
                        `${JSON.stringify(this._scheduler)}`,
                );
                throw new Error(`updateFixedContexts() failed. Can't resize. please restart app`);
            }
        }
        //re-arrange

        await this.mutex.acquire();
        const targets: QuizContext[] = newContexts.filter(
            (ctx) => !this._contextHashMap.has(this.transformHashKey(ctx)),
        );
        await this.mutex.release();

        await this.addContext(targets, true);
    }

    startOptimization(interval = this.OPTIMIZE_INTERVAL_MS) {
        if (this.optimizerTimer) return;
        this.optimizerTimer = setInterval(() => {
            this.optimize();
        }, interval);
    }

    stopOptimization() {
        if (this.optimizerTimer) {
            clearInterval(this.optimizerTimer);
            this.optimizerTimer = null;
        }
    }

    private async addContext(contexts: QuizContext[], isFixed: boolean = false): Promise<void> {
        const emptyIndexes: number[] = await this.getEmptyIndex();

        if (emptyIndexes.length < contexts.length) {
            serverLogger.error(`[${QuizContextScheduler.name}] Need to optimize. `);
            return;
        }

        await this.mutex.acquire();

        const tasks = contexts.map((ctx) => ({
            ctx,
            status: 'FAILED' as 'ADDED' | 'EXISTED' | 'FAILED',
        }));

        try {
            tasks.forEach((task, idx) => {
                const schedulerIndex = emptyIndexes[idx];
                const id: QuizContextID = this.transformHashKey(task.ctx);

                if (this._contextHashMap.has(id)) {
                    //중복 삽입 예방.
                    task.status = 'EXISTED';
                    serverLogger.info(
                        `[${QuizContextScheduler.name}] Already Exist ID. ID : ${id}`,
                    );
                    return;
                }

                this._scheduler[schedulerIndex] = id;
                this._contextHashMap.set(this.transformHashKey(task.ctx), {
                    context: task.ctx,
                    schedulerIndex: schedulerIndex,
                    scheduleCount: 0,
                    isFixed,
                });
                task.status = 'ADDED';
            });
        } catch {
            const statistic = tasks.reduce(
                (acc, { status }) => ({ ...acc, [status]: acc[status] + 1 }),
                {} as { ADDED: 0; EXISTED: 0; FAILED: 0 } as Record<
                    'ADDED' | 'EXISTED' | 'FAILED',
                    number
                >,
            );
            serverLogger.error(
                `[${QuizContextScheduler.name}] fail addContext.` +
                    `${JSON.stringify(statistic, null, 2)}`,
            );
        } finally {
            serverLogger.info(
                `[${QuizContextScheduler.name}] addContext finish` +
                    `${JSON.stringify(tasks, null, 2)}`,
            );
            await this.mutex.release();
        }
    }

    private async getEmptyIndex() {
        await this.mutex.acquire();
        try {
            const emptyIndexes: number[] = [];
            this._scheduler.forEach((value, index) => {
                if (value === this.SCHEDULER_EMPTY) {
                    emptyIndexes.push(index);
                }
            });
            return emptyIndexes;
        } finally {
            await this.mutex.release();
        }
    }

    private async getScheduleCount(): Promise<number> {
        let count = 0;
        await this.mutex.acquire();
        this._scheduler.forEach((value) => {
            if (value !== this.SCHEDULER_EMPTY) {
                count++;
            }
        });

        await this.mutex.release();
        return count;
    }

    private async deleteContext(contextID: QuizContextID): Promise<boolean> {
        await this.mutex.acquire();
        try {
            if (!this._contextHashMap.has(contextID)) {
                assertOrLog(false, `can't delete not-existed ID. ${contextID}`);
                return false;
            }

            const deletedNode: ContextHashNode = this._contextHashMap.get(contextID)!;

            this._contextHashMap.delete(contextID);
            this._scheduler[deletedNode.schedulerIndex] = this.SCHEDULER_EMPTY;
            return true;
        } finally {
            await this.mutex.release();
        }
    }

    private async report(): Promise<void> {
        /*TODO
    - Reflect.deleteProperty 사용하는 방법과, 객체 불변성을 사용하여 재할당 하는 방법 중에서 선택 필요.
    - this.mutex 중첩 사용 예방 고민하기
        - add or delete 에서 mutex를 사용하는데, 해당 함수들을 호출자에서도 mutex를 사용하면 this.mutex timeout이 발생..
    */
        await this.mutex.acquire();
        serverLogger.info(
            `[${QuizContextScheduler.name}] report schedule status : ${
                (JSON.stringify({
                    _scheduler: this._scheduler,
                    _contextHashMap: this._contextHashMap,
                    _schedulerIdx: this._schedulerIdx,
                }),
                null,
                2)
            }`,
        );

        await this.mutex.release();
    }

    private transformHashKey(context: QuizContext): QuizContextID {
        const temp: QuizContext = {
            tag: context.tag?.trim(),
            artist: context.artist?.trim(),
            style: context.style?.trim(),
            page: context.page,
        };

        return `${temp.artist}-${temp.tag}-${temp.style}-${temp.page}`;
    }

    /*TODO
- 주기적으로 호출하여 scheduling
*/
    private async optimize(): Promise<void> {
        const count = await this.getScheduleCount();
        if (count === this.SCHEDULER_SIZE) {
            serverLogger.info(`[${QuizContextScheduler.name}] call deleteMostViewQuiz()`);
            await this.deleteMostViewQuiz();
        }

        await this.report();

        /*TODO
        - 추후 스케줄링 로직 추가 가능.
        
    */
        serverLogger.info(`[${QuizContextScheduler.name}] complete optimize()`);
        return;
    }

    private async deleteMostViewQuiz(): Promise<void> {
        /*TODO
        - delete 선별 도중에, 비동기적으로 일어나는 작업을 막아야하지 않는가?
        - race condition 혹은 멀티스레딩에서 일어날 문제가 있는가?
    */
        const count = await this.getScheduleCount();

        if (count < this.SCHEDULER_SIZE) {
            return;
        }

        const hashNodes: ContextHashNode[] = Object.values(this._contextHashMap)
            .filter((value) => value !== undefined)
            .filter((value) => !value.isFixed);

        hashNodes.sort((a, b) => {
            if (b.scheduleCount === a.scheduleCount) {
                //나중에 선택될 Context 제거
                return (
                    this.getSchedulingOffset(b.schedulerIndex) -
                    this.getSchedulingOffset(a.schedulerIndex)
                );
            }
            // 가장 많이 선택된 Context 제거
            return b.scheduleCount - a.scheduleCount;
        });

        const target: QuizContextID = hashNodes.map((ctx) => this.transformHashKey(ctx.context))[0];

        await this.deleteContext(target);
    }

    private async getFixedContextCounts(): Promise<number> {
        let count = 0;
        await this.mutex.acquire();
        try {
            this._scheduler.forEach((id) => {
                assertOrLog(
                    this._contextHashMap.has(id),
                    'scheduled context ID should has context node',
                );
                if (this._contextHashMap.get(id)!.isFixed) {
                    count++;
                }
            });
            return count;
        } finally {
            await this.mutex.release();
        }
    }

    private getSchedulingOffset(index: number) {
        return (index - this._schedulerIdx + this.SCHEDULER_SIZE) % this.SCHEDULER_SIZE;
    }
}

class SingleTonQuizContextScheduler {
    static contextScheduler: QuizContextScheduler;
    constructor() {
        if (!SingleTonQuizContextScheduler.contextScheduler) {
            SingleTonQuizContextScheduler.contextScheduler = new QuizContextScheduler();
        }

        return SingleTonQuizContextScheduler.contextScheduler;
    }
}

const _contextScheduler = SingleTonQuizContextScheduler.contextScheduler;
Object.freeze(_contextScheduler);
export default _contextScheduler;

(async () => {
    const weeklyArtworks = await getWeekArtWorkData();
    const contexts: QuizContext[] = weeklyArtworks.map((artwork) => {
        return {
            artist: artwork.painting.artist.name,
            page: 0,
        };
    });

    serverLogger.info(
        `[${QuizContextScheduler.name}] init quiz context scheduler ${JSON.stringify(
            contexts,
            null,
            2,
        )}`,
    );

    await _contextScheduler.init(contexts);
    _contextScheduler.startOptimization();
    serverLogger.info(`[${QuizContextScheduler.name}] complete init quiz scheduler`);
})();
