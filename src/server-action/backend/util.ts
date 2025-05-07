import { serverLogger } from '../../util/logger';
import { BackendHttpException, HttpException, ServerActionError } from './common.dto';

export function getServerUrl(): string {
    const url = process.env.BACKEND_URL;
    serverLogger.info(`BACKEND_URL=${url} `);

    if (url == undefined) {
        console.error(` 'process.env.BACKEND_URL' not read`);
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
    action: T,
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>> | ServerActionError> {
    return async (...args: Parameters<T>) => {
        try {
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
        }
    };
}

export function isHttpException(response: any): response is HttpException {
    const uniqueKey: keyof HttpException = 'statusCode';

    return typeof response === 'object' && uniqueKey in response;
}

export function isBackendHttpException(response: any): response is BackendHttpException {
    const uniqueKeys: (keyof BackendHttpException)[] = ['errorCode', 'path', 'timeStamp'];

    return typeof response === 'object' && uniqueKeys.every((key) => key in response);
}

export function isServerActionError(response: any): response is ServerActionError {
    const uniqueKeys: (keyof ServerActionError)[] = ['message', 'stack'];
    return typeof response === 'object' && uniqueKeys.every((key) => key in response);
}
