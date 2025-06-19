import { BackendHttpException, HttpException, ServerActionError } from './dto';

export function isHttpException(response: unknown): response is HttpException {
	const uniqueKey: keyof HttpException = 'statusCode';

	return response != null && typeof response === 'object' && uniqueKey in response;
}

export function isBackendHttpException(response: unknown): response is BackendHttpException {
	const uniqueKeys: (keyof BackendHttpException)[] = ['errorCode', 'path', 'timeStamp'];

	return (
		response != null &&
		typeof response === 'object' &&
		uniqueKeys.every((key) => key in response)
	);
}

export function isServerActionError(response: unknown): response is ServerActionError {
	const uniqueKeys: (keyof ServerActionError)[] = ['message', 'stack'];
	return (
		response != null &&
		typeof response === 'object' &&
		uniqueKeys.every((key) => key in response)
	);
}
