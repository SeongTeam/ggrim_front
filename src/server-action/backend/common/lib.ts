'server-only';
import { serverLogger } from '../../../util/serverLogger';
import { getRequestId } from '../../../util/request';
import { ServerActionError } from './dto';
import { isHttpException } from './util';

serverLogger.info(`BACKEND_URL=${process.env.BACKEND_URL} `);
export function getServerUrl(): string {
    const url = process.env.BACKEND_URL;
    if (url == undefined) {
        serverLogger.error(` 'process.env.BACKEND_URL' not read`);
        return '';
    }
    return url;
}
// TODO: HTTP API 에러 핸들링 로직 추가
// - [ ] : fetch()가 반환한 응답 상태 확인 및 에러 핸들링 로직 추가
// - [ ] : fetch() 동작 도중 발생하는 에러 핸들링 로직 추가
// - [ ] : fetch() 오류 발생시, front-end의 요청을 추적하기 위해서 request-id 추가하기
//  -> 또는 backend에서 반환한 응답에 백엔드의 request ID 삽입하기.
// - [ ] : fetch() 타임 아웃 로직 추가하기.
//  -> 백엔드 서버의 응답이 없는 경우, 타임아웃 및 에러 핸들러 로직 필요
//  -> <할 일 > 설명 ( 생략가능 )
// - [ ] <추가 작업>
// ! 주의: <경고할 사항>
// ? 질문: <의문점 또는 개선 방향>
// * 참고: <관련 정보나 링크>

export function withErrorHandler<T extends (...args: any[]) => Promise<any>>(
    actionName: string,
    action: T,
): (...args: Parameters<T>) => Promise<ReturnType<T> | ServerActionError> {
    return async (...args: Parameters<T>) => {
        const start = Date.now();
        let status = 'success';
        const requestId = getRequestId();
        try {
            logMessage(requestId || 'undefined', `call ${actionName}()`);
            const response = await action(...args);

            if (isHttpException(response)) {
                serverLogger.error(
                    `[${actionName}] response is not ok. ${JSON.stringify(response, null, 2)}`,
                );
            }
            return response;
        } catch (err: unknown) {
            serverLogger.error(`${actionName}() fail. Unknown server error:`, err);
            status = 'server-error';
            return handleError(err);
        } finally {
            const delay = Date.now() - start;
            const info = {
                requestId,
                status,
                action: actionName,
                delay: delay + 'ms',
            };
            logMessage(requestId || 'undefined', `End ${actionName}()`, info);
        }
    };
}

function handleError(err: unknown): ServerActionError {
    let message = 'Unknown server error';
    let stack = 'withErrorHandler()';

    if (err instanceof Error) {
        message = err.message;
        stack = err.stack ?? stack;
    }

    return {
        message,
        stack,
    };
}

type TailParameters<T> = T extends (cookie: any, ...args: infer R) => any ? R : never;

export function cookieWithErrorHandler<C, T extends (cookie: C, ...args: any[]) => Promise<any>>(
    getCookie: () => Promise<C>,
    actionName: string,
    action: T,
): (...args: TailParameters<T>) => Promise<Awaited<ReturnType<T>> | ServerActionError> {
    return async (...args: TailParameters<T>) => {
        const cookie = await getCookie();
        return withErrorHandler(actionName, () => action(cookie, ...args))();
    };
}

function logMessage(requestId: string, message: string, info?: Record<string, any>) {
    const context = `🚀server-action`;
    const result = {
        context,
        requestId,
        ...info,
    };

    serverLogger.info(message + '\n' + JSON.stringify(result, null, 2));
}
