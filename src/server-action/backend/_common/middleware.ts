"server-only";
import { serverLogger } from "../../../util/serverLogger";
import { SERVER_ACTION_ERROR_MSG, ServerActionError } from "./serverActionError";
import { isServerActionError } from "./serverActionError";
import { HttpException, ServiceException } from "../../../generated/dto-types";
import { ServerActionFailure, ServerActionResult } from "../../client/type";

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

type Action = (...args: any[]) => Promise<any>;

type ActionResult<T extends Action> = Awaited<ReturnType<T>>;

type ServerAction<T extends Action> = (
	...args: Parameters<T>
) => Promise<ServerActionResult<ActionResult<T>>>;

export function withErrorHandler<T extends Action>(actionName: string, action: T): ServerAction<T> {
	return async (...args: Parameters<T>) => {
		try {
			const data = await action(...args);

			return { data, ok: true };
		} catch (err: unknown) {
			if (isServerActionError(err)) {
				return handleServerActionError(actionName, err);
			} else if (isServerException(err)) {
				return handleBackendServerException(actionName, err);
			} else if (isHttpException(err)) {
				return handleHttpException(actionName, err);
			}

			return handleUnexpectedError(actionName, err);
		}
	};
}

function handleServerActionError(actionName: string, err: ServerActionError): ServerActionFailure {
	serverLogger.error(`${actionName}() fail. ServerActionError: ${JSON.stringify(err, null, 2)}`);
	return { ok: false, message: err.message };
}

function handleUnexpectedError(actionName: string, err: unknown): ServerActionFailure {
	let message = "Unknown server error";
	let stack = "handleUnexpectedError() stack trace not available";

	if (err instanceof Error) {
		message = err.message;
		stack = err.stack ?? stack;
	}
	serverLogger.error(`${actionName}() fail. UnexpectedError: ${message}
		Stack: ${stack}`);

	return { ok: false, message: SERVER_ACTION_ERROR_MSG.backendError };
}

function handleHttpException(actionName: string, err: HttpException): ServerActionFailure {
	serverLogger.error(`${actionName}() fail. HttpException: ${err.message}`);

	return { ok: false, message: err.message };
}

function handleBackendServerException(actionName: string, err: HttpException): ServerActionFailure {
	serverLogger.error(` ${actionName}() fail. ServerException: ${JSON.stringify(err, null, 2)}`);
	return { ok: false, message: err.message };
}

function isHttpException(err: unknown): err is HttpException {
	const keys: (keyof HttpException)[] = ["statusCode", "message"];

	return err !== null && typeof err === "object" && keys.every((key) => key in (err as object));
}

function isServerException(err: unknown): err is ServiceException {
	const keys: (keyof ServiceException)[] = [
		"errorCode",
		"path",
		"timestamp",
		"message",
		"statusCode",
	];

	return err !== null && typeof err === "object" && keys.every((key) => key in err);
}
