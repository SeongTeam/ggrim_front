'server-only';
import { serverLogger } from '../../util/logger';
import { getRequestId } from '../../util/middlewareUtils';
import { ServerActionError } from './common.dto';
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
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>> | ServerActionError> {
    return async (...args: Parameters<T>) => {
        const start = Date.now();
        const requestId = getRequestId();
        try {
            serverLogger.info(`[req-${requestId}] call ${actionName}()`);
            const response = await action(...args);

            if (isHttpException(response)) {
                serverLogger.error(
                    `[${action.name}] response is not ok. ${JSON.stringify(response, null, 2)}`,
                );
            }
            return response;
        } catch (err: any) {
            console.error(`[${action.name}] Unknown server error:`, err);
            return {
                message: err?.message || 'Unknown server error',
                stack: err.stack || 'withErrorHandler()',
            };
        } finally {
            const delay = Date.now() - start;
            serverLogger.info(`[req-${requestId}] pop ${actionName}() , delay : ${delay}ms`);
        }
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
