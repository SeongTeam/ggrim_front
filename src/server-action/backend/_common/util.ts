import createClient from "openapi-fetch";
import { HttpException, paths, ServiceException } from "../../../generated/dto-types";
import { serverLogger } from "../../../util/serverLogger";
import {
	SERVER_ACTION_ERROR_MSG,
	ServerActionError,
	ServerActionErrorMessageKey,
} from "./serverActionError";

export function isHttpException(err: unknown): err is HttpException {
	const keys: (keyof HttpException)[] = ["statusCode", "message"];

	return err !== null && typeof err === "object" && keys.every((key) => key in (err as object));
}

export function isServerException(err: unknown): err is ServiceException {
	const keys: (keyof ServiceException)[] = [
		"errorCode",
		"path",
		"timestamp",
		"message",
		"statusCode",
	];

	return err !== null && typeof err === "object" && keys.every((key) => key in err);
}

export function isServerActionError(response: unknown): response is ServerActionError {
	const uniqueKeys: (keyof ServerActionError)[] = ["message", "stack"];
	return (
		response !== null &&
		typeof response === "object" &&
		uniqueKeys.every((key) => key in response)
	);
}
serverLogger.info(`BACKEND_URL=${process.env.BACKEND_URL} `);
export function getServerUrl(): string {
	const url = process.env.BACKEND_URL;
	if (url === undefined) {
		serverLogger.error(` 'process.env.BACKEND_URL' not read`);
		return "";
	}
	return url;
}

export const client = createClient<paths>({ baseUrl: getServerUrl() });

export function createServerActionError(
	messageKey: ServerActionErrorMessageKey,
	options?: unknown,
): ServerActionError {
	const message = SERVER_ACTION_ERROR_MSG[messageKey];
	const serverActionError = {
		name: "serverActionError" as const,
		message,
		stack: "",
		status: messageKey,
		options,
	};
	Error.captureStackTrace(serverActionError, createServerActionError);
	return serverActionError;
}
