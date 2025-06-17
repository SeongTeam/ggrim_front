'server-only';

import { Mutex } from 'async-mutex';
import { serverLogger } from './serverLogger';

const QUEUE_SIZE = 30;
const HIGH_PRIORITY_SIZE = 20;
export class TaskSyncQueue {
    private queue: (() => Promise<void>)[] = [];
    private highPriorityQueue: (() => Promise<void>)[] = [];
    private mutex: Mutex = new Mutex();
    private readonly maxSize: number;
    private readonly maxHighSize: number;

    constructor(maxSize: number = QUEUE_SIZE, maxHighSize = HIGH_PRIORITY_SIZE) {
        this.maxSize = maxSize;
        this.maxHighSize = maxHighSize;
    }

    enqueue(task: () => Promise<void>): boolean {
        if (this.queue.length >= this.maxSize) {
            serverLogger.warn('Queue is full. Task rejected.');
            return false; // 큐가 가득 찼음을 알림
        }
        this.queue.push(task);
        return true;
    }

    enqueueHighPriority(task: () => Promise<void>): boolean {
        if (this.highPriorityQueue.length >= this.maxHighSize) {
            serverLogger.warn('High Priority Queue is full. Priority task rejected.');
            return false;
        }
        this.highPriorityQueue.push(task);
        return true;
    }

    /**
     * 큐의 작업을 실행
     */
    async processQueue(): Promise<void> {
        await this.mutex.acquire();
        serverLogger.info('processQueue() start');
        while (true) {
            let task: (() => Promise<void>) | undefined;

            // 🔒 Mutex를 사용하여 큐 접근
            await this.mutex.runExclusive(() => {
                if (this.highPriorityQueue.length > 0) {
                    task = this.highPriorityQueue.shift();
                } else if (this.queue.length > 0) {
                    task = this.queue.shift();
                }
            });

            if (!task) {
                break; // 모든 큐가 비어 있으면 종료
            }

            // 작업 실행
            await task().catch((e: unknown) => {
                serverLogger.error(`processQueue() failed during running`);
                throw new Error('processQueue() failed', { cause: e });
            });
        }
        return;
    }
}
