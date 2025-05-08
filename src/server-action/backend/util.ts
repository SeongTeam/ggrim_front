import { BackendHttpException, HttpException, ServerActionError } from './common.dto';

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
