'server-only';

import { assertOrLog } from '../../util/debug';
import { serverLogger } from '../../util/logger';
import { Mutex, MutexInterface, withTimeout } from 'async-mutex';
import { getWeekArtWorkData } from './api.backend';
import { TaskSyncQueue } from '../../util/taskSyncQueue';

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
- Q.pubic 함수는 static으로 사용해야하는가?
- 추후 스케줄링 기능 백엔드로 옮기기
    - 프론트 서버는 렌더링 때문에 메모리와 CPU 리소스가 부족할 수 있기 때문 
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

    /*TODO
    - 추가 요청이 버려지는 것을 방지하기 위해 사용 필요
        - 사용자가 많아지고 메모리가 충분하면 사용.
        - add,delete 등의 내부 공통 로직에서 race-condition이 발생할 수 있으면 적용
     */
    private syncQueue: TaskSyncQueue;

    constructor() {
        //Q. Map() 과 object는 어떤 차이가 있는가? 둘다 해시 처럼 사용가능한데.
        this._contextHashMap = new Map<string, ContextHashNode>();
        this._scheduler = new Array(this.SCHEDULER_SIZE).fill(this.SCHEDULER_EMPTY);
        this._schedulerIdx = 0;
        this.mutex = withTimeout(
            new Mutex(),
            this.MUTEX_TIMEOUT_MS,
            new Error(`Timeout Mutex  Release ${this.MUTEX_TIMEOUT_MS}`),
        );
        this.optimizerTimer = null;
        this.syncQueue = new TaskSyncQueue();
    }

    async init(fixedContext: QuizContext[]) {
        if (fixedContext.length > this.SCHEDULER_SIZE) {
            serverLogger.error(`init fail. ` + `${JSON.stringify(fixedContext, null, 2)}`);
            throw new Error(
                `fixedContext length is over max this._scheduler size` +
                    `this.SCHEDULER_SIZE : ${this.SCHEDULER_SIZE} `,
            );
        }
        await this.mutex.runExclusive(() => {
            this.addContexts(fixedContext, true);

            assertOrLog(this._scheduler.length !== 0);
        });
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
                        `${JSON.stringify(this._scheduler, null, 2)}`,
                );
                throw new Error(`No Context exist`);
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

    async requestAddContext(contexts: QuizContext[]): Promise<boolean> {
        return this.mutex.runExclusive(() => {
            const result = this.addContexts(contexts, false);
            serverLogger.info(
                `[${QuizContextScheduler.name}] requestAddContext() completes request`,
            );
            return result;
        });
    }

    async requestUpdateFixedQuiz(newContexts: QuizContext[]): Promise<boolean> {
        if (newContexts.length === 0) {
            serverLogger.warn(`[${QuizContextScheduler.name}] can't update empty array`);
            return false;
        }

        const hashMap = new Map<QuizContextID, QuizContext>();
        newContexts.forEach((ctx) => hashMap.set(this.transformHashKey(ctx), ctx));

        if (hashMap.size > this.SCHEDULER_SIZE) {
            serverLogger.warn(
                `[${QuizContextScheduler.name}] updateFixedContexts() failed. Not Enough Size.` +
                    `${JSON.stringify(hashMap, null, 2)}`,
                `${JSON.stringify(newContexts, null, 2)}`,
            );
            // throw new Error(`updateFixedContexts() failed. Not Enough Size`);
            return false;
        }
        // main
        await this.mutex.acquire();

        //백업
        const _contextHashMapBackup: ContextHashMap = structuredClone(this._contextHashMap);
        const _schedulerBackup: QuizContextID[] = structuredClone(this._scheduler);

        try {
            //resize with backup

            this._scheduler.forEach((id) => {
                if (this._contextHashMap.has(id)) {
                    this._contextHashMap.get(id)!.isFixed = false;
                } else {
                    //혹시모를 에러 방지용.
                    serverLogger.error(
                        `[${QuizContextScheduler.name}] Scheduled ID should save Hash Node. please check add & delete logic. \n` +
                            `id : ${id}` +
                            `this._schedulerIdx : ${this._schedulerIdx}}`,
                    );
                    throw new Error('System state is wrong. need to check');
                }
            });

            let existCount = 0;
            hashMap.forEach((ctx, id) => {
                if (this._contextHashMap.has(id)) {
                    this._contextHashMap.get(id)!.isFixed = true;
                    existCount++;
                }
            });

            const emptyCount = this.getEmptyIndex()!.length;
            const tryCount = emptyCount - existCount;
            const nodes: ContextHashNode[] = [...this._contextHashMap.values()];
            this.sortByLowPriority(nodes);

            for (let i = 0; i < tryCount; i++) {
                const deleteID = this.transformHashKey(nodes[0].context);
                if (this.deleteContext(deleteID)) {
                    throw new Error(
                        `Can't delete Context during updating fixed Context. ID : ${deleteID}`,
                    );
                }
            }
            //re-arrange

            const targets: QuizContext[] = [];
            hashMap.forEach((ctx, id) => {
                if (!this._contextHashMap.has(id)) {
                    targets.push(ctx);
                }
            });
            return this.addContexts(targets, true);
        } catch (e: unknown) {
            serverLogger.error(`fail requestAddContext().error : ${JSON.stringify(e)}\n`);
            this._contextHashMap = _contextHashMapBackup;
            this._scheduler = _schedulerBackup;
            return false;
        } finally {
            serverLogger.info(`requestAddContext().finish\n`);
            await this.mutex.release();
        }
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

    async requestDeleteLowPriority(): Promise<boolean> {
        return this.mutex.runExclusive(() => {
            const hashNodes: ContextHashNode[] = [...this._contextHashMap.values()].filter(
                (node) => node.isFixed,
            );

            this.sortByLowPriority(hashNodes);

            const contextID: QuizContextID = hashNodes.map((ctx) =>
                this.transformHashKey(ctx.context),
            )[0];

            return this.deleteContext(contextID);
        });
    }

    private addContexts(contexts: QuizContext[], isFixed: boolean = false): boolean {
        if (!this.mutex.isLocked()) {
            return false;
        }

        const tempMap: ContextHashMap = new Map();
        contexts.forEach((context) =>
            tempMap.set(this.transformHashKey(context), {
                context,
                scheduleCount: 0,
                schedulerIndex: -1,
                isFixed,
            }),
        );

        const emptyIndexes: number[] = this.getEmptyIndex()!;

        if (emptyIndexes.length < tempMap.size) {
            serverLogger.error(`[${QuizContextScheduler.name}] Need to optimize. `);
            return false;
        }

        const tasks = [...tempMap.values()].map((node) => ({
            node,
            status: 'FAILED' as 'ADDED' | 'EXISTED' | 'FAILED',
        }));

        const backupHashMap: ContextHashMap = new Map(this._contextHashMap);

        try {
            tasks.forEach((task, idx) => {
                const schedulerIndex = emptyIndexes[idx];
                const id: QuizContextID = this.transformHashKey(task.node.context);

                if (this._contextHashMap.has(id)) {
                    //중복 삽입 예방.
                    task.status = 'EXISTED';
                    serverLogger.info(
                        `[${QuizContextScheduler.name}] Already Exist ID. ID : ${id}`,
                    );
                    return;
                }

                this._scheduler[schedulerIndex] = id;
                task.node.schedulerIndex = schedulerIndex;
                this._contextHashMap.set(this.transformHashKey(task.node.context), {
                    ...task.node,
                });
                task.status = 'ADDED';
            });
            return true;
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
            this._contextHashMap = backupHashMap;
            return false;
        } finally {
            serverLogger.info(
                `[${QuizContextScheduler.name}] addContext finish` +
                    `${JSON.stringify(tasks, null, 2)}`,
            );
        }
    }

    private getEmptyIndex(): number[] | undefined {
        if (!this.mutex.isLocked()) {
            return undefined;
        }

        const emptyIndexes: number[] = [];
        this._scheduler.forEach((value, index) => {
            if (value === this.SCHEDULER_EMPTY) {
                emptyIndexes.push(index);
            }
        });
        return emptyIndexes;
    }

    private getScheduleCount(): number | undefined {
        if (!this.mutex.isLocked()) {
            return undefined;
        }
        let count = 0;
        this._scheduler.forEach((value) => {
            if (value !== this.SCHEDULER_EMPTY) {
                count++;
            }
        });

        return count;
    }

    //Should acquire mutex before call it
    private deleteContext(contextID: QuizContextID): boolean {
        if (!this.mutex.isLocked()) {
            serverLogger.warn(`can't execute without acquiring mutex `);
            return false;
        }

        if (!this._contextHashMap.has(contextID)) {
            assertOrLog(false, `can't delete not-existed ID. ${contextID}`);
            return false;
        }

        const deletedNode: ContextHashNode = this._contextHashMap.get(contextID)!;

        this._contextHashMap.delete(contextID);
        this._scheduler[deletedNode.schedulerIndex] = this.SCHEDULER_EMPTY;
        return true;
    }

    private async report(): Promise<void> {
        await this.mutex.acquire();
        serverLogger.info(
            `[${QuizContextScheduler.name}] report schedule status : ${
                (JSON.stringify({
                    _scheduler: this._scheduler,
                    _contextHashMap: this._contextHashMap,
                    _schedulerIdx: this._schedulerIdx,
                    fixedCtxCount: this.getFixedContextCounts()!,
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

    private async optimize(): Promise<void> {
        const count = await this.getScheduleCount();
        if (count === this.SCHEDULER_SIZE) {
            serverLogger.info(`[${QuizContextScheduler.name}] delete low priority context`);
            await this.requestDeleteLowPriority();
        }

        await this.report();

        /*TODO
        - 추후 스케줄링 로직 추가 가능.
        */
        serverLogger.info(`[${QuizContextScheduler.name}] optimize complete`);
        return;
    }

    private sortByLowPriority(hashNodes: ContextHashNode[]): ContextHashNode[] {
        const temp: ContextHashNode[] = [...hashNodes];
        return temp.sort((a, b) => {
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
    }

    private getFixedContextCounts(): number | undefined {
        if (this.mutex.isLocked()) {
            return undefined;
        }
        let count = 0;

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
new SingleTonQuizContextScheduler();
const quizContextScheduler = SingleTonQuizContextScheduler.contextScheduler;
Object.freeze(quizContextScheduler);
export default quizContextScheduler;

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

    await quizContextScheduler.init(contexts);
    quizContextScheduler.startOptimization();
    serverLogger.info(`[${QuizContextScheduler.name}] complete init quiz scheduler`);
})();
