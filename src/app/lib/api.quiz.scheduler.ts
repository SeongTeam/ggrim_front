'use server';

import { assertOrLog } from '../../util/debug';
import { serverLogger } from '../../util/logger';
import { Mutex, withTimeout } from 'async-mutex';
import { throttle } from '../../util/optimization';
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

interface ContextHashMap {
    [key: QuizContextID]: ContextHashNode | undefined;
}

let _schedulerIdx: number = 0;
const _scheduler: QuizContextID[] = ['undefined'];
// const _queue: QuizContext[] = [];

const _contextHashMap: ContextHashMap = {};

const SCHEDULER_SIZE = 10;
const SCHEDULER_EMPTY = 'SCHEDULER_EMPTY';
// const QUEUE_SIZE = SCHEDULER_SIZE * 5;

const MUTEX_TIMEOUT_MS = 10000;
const mutex = withTimeout(
    new Mutex(),
    MUTEX_TIMEOUT_MS,
    new Error(`Timeout Mutex  Release ${MUTEX_TIMEOUT_MS}`),
);

let optimizerTimer: NodeJS.Timeout;
const OPTIMIZE_INTERVAL_MS = 5000;

(async () => {
    const weeklyArtworks = await getWeekArtWorkData();
    const contexts: QuizContext[] = weeklyArtworks.map((artwork) => {
        return {
            artist: artwork.painting.artist.name,
            page: 0,
        };
    });
    await init(contexts);
    serverLogger.info(`init quiz scheduler`);
})();

/*TODO
- 앱 실행시 즉시 실행
*/

export async function init(fixedContext: QuizContext[]) {
    if (fixedContext.length > SCHEDULER_SIZE) {
        throw new Error(
            `fixedContext length is over max _scheduler size` +
                `SCHEDULER_SIZE : ${SCHEDULER_SIZE} ` +
                `${JSON.stringify(fixedContext, null, 2)}`,
        );
    }

    await addContext(fixedContext, true);

    assertOrLog(_scheduler.length !== 0);

    while (_scheduler.length < SCHEDULER_SIZE) {
        _scheduler.push(SCHEDULER_EMPTY);
    }

    optimizerTimer = setInterval(
        () => throttle(optimize, OPTIMIZE_INTERVAL_MS)(),
        OPTIMIZE_INTERVAL_MS,
    );
}

export function scheduleContext(): QuizContext {
    /*TODO
    - 일정 확률로, 이미 전달받은 context를 전달받을 수 있으므로, 중복 context 제공 예방필요.
        - 단, 사용자가 충분히 존재하거나 데이터가 충분히 많으면 고려 할것.
    */
    let idx = _schedulerIdx;
    let loop = 0;
    const size = _scheduler.length;
    do {
        idx = Math.floor((idx + 1) / size);
        loop++;
    } while (loop < size && _scheduler[idx] === SCHEDULER_EMPTY);

    if (loop == size && _scheduler[idx] === SCHEDULER_EMPTY) {
        serverLogger.error(
            `_schedulerIdx : ${_schedulerIdx}` +
                `${JSON.stringify(_contextHashMap, null, 2)}` +
                `${JSON.stringify(_scheduler, null, 2)}` +
                `${JSON.stringify(_scheduler)}`,
        );
        throw new Error(
            `No Context exist` +
                `current Scheduler Idx : ${_schedulerIdx}` +
                `${JSON.stringify(_scheduler)}`,
        );
    }

    const id: QuizContextID = _scheduler[idx];
    assertOrLog(_contextHashMap[id] !== undefined, `schedule context must exist`);

    if (!_contextHashMap[id]) {
        serverLogger.error(
            `_schedulerIdx : ${_schedulerIdx}` +
                `${JSON.stringify(_contextHashMap, null, 2)}` +
                `${JSON.stringify(_scheduler, null, 2)}` +
                `${JSON.stringify(_scheduler)}`,
        );
        throw new Error(`${id} is in hashMap`);
    }

    _schedulerIdx = idx;

    const node: ContextHashNode = _contextHashMap[id];
    node.scheduleCount++;
    assertOrLog(
        _schedulerIdx === node.schedulerIndex,
        `Should synchronize idx and node's index` +
            `_schedulerIdx : ${_schedulerIdx}` +
            `${JSON.stringify(node, null, 2)}`,
    );

    return node.context;
}

export async function requestAddContext(contexts: QuizContext[]): Promise<void> {
    const targets: QuizContext[] = [];

    if (contexts.length === SCHEDULER_SIZE) {
        //throttling 사용하여 schedule() 호출 고려
        return;
    }

    targets.push(...contexts.slice(0, getEmptyIndex().length));

    /*TODO
    - race condition 예방이 필요한가?
    - addContext() 함수도 비동기여야 하는가?
    */
    addContext(targets, false).then(() =>
        serverLogger.debug(`requestAddContext() completes request`),
    );
}

/*TODO
- 코드 점검하기
- 리팩토링하여 클래스화 하기
*/

export async function requestUpdateFixedContexts(newContexts: QuizContext[]) {
    if (newContexts.length === 0) {
        serverLogger.error(`can't update empty array`);
        return;
    }
    if (newContexts.length > SCHEDULER_SIZE) {
        serverLogger.error(
            `${JSON.stringify(newContexts)} ` +
                `_schedulerIdx : ${_schedulerIdx}` +
                `${JSON.stringify(_contextHashMap, null, 2)}` +
                `${JSON.stringify(_scheduler, null, 2)}` +
                `${JSON.stringify(_scheduler)}`,
        );
        serverLogger.error(
            `updateFixedContexts() failed. Not Enough Size.` +
                `${JSON.stringify(newContexts, null, 2)}`,
        );
        // throw new Error(`updateFixedContexts() failed. Not Enough Size`);
        return;
    }
    const ids = newContexts.map((ctx) => transformHashKey(ctx));

    const newIDs = ids.filter((id) => !_contextHashMap[id]);
    const existIDs = ids.filter((id) => _contextHashMap[id]);

    let loop = 0;
    const max_loop = 20;

    //resize with backup

    _scheduler.forEach((id) => {
        if (_contextHashMap[id]) {
            _contextHashMap[id].isFixed = false;
        } else {
            serverLogger.error(
                `Scheduled ID should save Hash Node. please check add & delete logic. \n` +
                    `id : ${id}` +
                    `_schedulerIdx : ${_schedulerIdx}}`,
            );
        }
    });

    existIDs.forEach((id) => {
        if (_contextHashMap[id]) {
            _contextHashMap[id].isFixed = true;
        }
    });

    while (getEmptyIndex().length < newIDs.length) {
        await deleteMostViewQuiz();
        loop++;

        if (loop > max_loop) {
            serverLogger.error(
                `${JSON.stringify(newContexts)} ` +
                    `_schedulerIdx : ${_schedulerIdx}` +
                    `${JSON.stringify(_contextHashMap, null, 2)}` +
                    `${JSON.stringify(_scheduler, null, 2)}` +
                    `${JSON.stringify(_scheduler)}`,
            );
            throw new Error(`updateFixedContexts() failed. Can't resize. please restart app`);
        }
    }
    //re-arrange

    const targets: QuizContext[] = newContexts.filter(
        (ctx) => !_contextHashMap[transformHashKey(ctx)],
    );

    await addContext(targets, true);
}

async function addContext(contexts: QuizContext[], isFixed: boolean): Promise<void> {
    const contextIds: QuizContextID[] = contexts.map((ctx) => transformHashKey(ctx));
    assertOrLog(getScheduleCount() + contexts.length <= SCHEDULER_SIZE);
    const emptyIndexes: number[] = getEmptyIndex();

    assertOrLog(emptyIndexes.length >= contexts.length);

    await mutex.acquire();
    contexts.forEach((ctx, idx) => {
        const schedulerIndex = emptyIndexes[idx];
        const id = contextIds[idx];

        if (_contextHashMap[id]) {
            //중복 삽입 예방.
            serverLogger.info(`Already Exist ID.` + `ID : ${id}`);
            return;
        }

        _scheduler[schedulerIndex] = id;
        _contextHashMap[id] = {
            context: ctx,
            schedulerIndex: schedulerIndex,
            scheduleCount: 0,
            isFixed,
        };
    });

    await mutex.release();
}

function getEmptyIndex() {
    const emptyIndexes: number[] = [];
    _scheduler.forEach((value, index) => {
        if (value === SCHEDULER_EMPTY) {
            emptyIndexes.push(index);
        }
    });

    return emptyIndexes;
}

function getScheduleCount(): number {
    let count = 0;
    _scheduler.forEach((value) => {
        if (value !== SCHEDULER_EMPTY) {
            count++;
        }
    });

    return count;
}

async function deleteContext(contextID: QuizContextID): Promise<void> {
    if (!_contextHashMap[contextID]) {
        assertOrLog(false, `can't delete not-existed ID. ${contextID}`);
        return;
    }

    mutex.acquire();
    const deletedNode: ContextHashNode = _contextHashMap[contextID];

    _contextHashMap[contextID] = undefined;
    _scheduler[deletedNode.schedulerIndex] = SCHEDULER_EMPTY;

    mutex.release();
}

async function optimizeHashKey(): Promise<void> {
    /*TODO
    - Reflect.deleteProperty 사용하는 방법과, 객체 불변성을 사용하여 재할당 하는 방법 중에서 선택 필요.
    - mutex 중첩 사용 예방 고민하기
        - add or delete 에서 mutex를 사용하는데, 해당 함수들을 호출자에서도 mutex를 사용하면 mutex timeout이 발생..
    */
    await mutex.acquire();
    const MAX_SIZE = 1000;
    if (Object.keys(_contextHashMap).length > MAX_SIZE) {
        // 방법 1. Reflect.deleteProperty
        for (const key in _contextHashMap) {
            if (_contextHashMap[key] === undefined) {
                Reflect.deleteProperty(_contextHashMap, key);
            }
        }
        // 방법 2. 객체 불변성을 사용
        const newHContextHashMap: ContextHashMap = {};
        for (const key in _contextHashMap) {
            if (_contextHashMap[key] !== undefined) {
                newHContextHashMap[key] = _contextHashMap[key];
            }
        }
        _contextHashMap = newHContextHashMap;
    }

    await mutex.release();
}

function transformHashKey(context: QuizContext): QuizContextID {
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
async function optimize(): Promise<void> {
    const count = getScheduleCount();
    if (count === SCHEDULER_SIZE) {
        await deleteMostViewQuiz();
    }

    await optimizeHashKey();

    /*TODO
        - 추후 스케줄링 로직 추가 가능.
        
    */

    return;
}

async function deleteMostViewQuiz(): Promise<void> {
    /*TODO
        - delete 선별 도중에, 비동기적으로 일어나는 작업을 막아야하지 않는가?
        - race condition 혹은 멀티스레딩에서 일어날 문제가 있는가?
    */
    const count = getScheduleCount();

    if (count < SCHEDULER_SIZE) {
        return;
    }

    function calculateDistance(index: number) {
        return (index - _schedulerIdx + SCHEDULER_SIZE) % SCHEDULER_SIZE;
    }

    const hashNodes: ContextHashNode[] = Object.values(_contextHashMap)
        .filter((value) => value !== undefined)
        .filter((value) => !value.isFixed);

    hashNodes.sort((a, b) => {
        if (b.scheduleCount === a.scheduleCount) {
            //나중에 선택될 Context 제거
            return calculateDistance(b.schedulerIndex) - calculateDistance(a.schedulerIndex);
        }
        // 가장 많이 선택된 Context 제거
        return b.scheduleCount - a.scheduleCount;
    });

    const target: QuizContextID = hashNodes.map((ctx) => transformHashKey(ctx.context))[0];

    await deleteContext(target);
}

function getFixedContextCounts(): number {
    let count = 0;

    _scheduler.forEach((id) => {
        if (_contextHashMap[id]?.isFixed) {
            count++;
        }
    });

    return count;
}
