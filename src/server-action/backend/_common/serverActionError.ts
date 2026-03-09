export const SERVER_ACTION_ERROR_MSG = {
	unauthorized: "Unauthorized: You do not have permission to perform this action.",
	unauthenticated: "Unauthenticated: You need to be authenticated to perform this action.",
	clientError:
		"Client Error: An error occurred while processing your request. Please check your input and try again.",
	backendError: "Backend Error: An unexpected error occurred on the backend server.",
	serverError: "Server Error: An unexpected error occurred while processing your request.",
} as const;

export type ServerActionErrorMessageKey = keyof typeof SERVER_ACTION_ERROR_MSG;
export type ServerActionErrorMessage =
	(typeof SERVER_ACTION_ERROR_MSG)[ServerActionErrorMessageKey];
export interface ServerActionError extends Error {
	name: "serverActionError";
	message: ServerActionErrorMessage;
	stack: string;
	status: ServerActionErrorMessageKey;
	cause?: unknown;
}

export function createServerActionError(
	messageKey: ServerActionErrorMessageKey,
	cause?: unknown,
): ServerActionError {
	const message = SERVER_ACTION_ERROR_MSG[messageKey];
	const serverActionError = {
		name: "serverActionError" as const,
		message,
		stack: "",
		status: messageKey,
		cause,
	};
	Error.captureStackTrace(serverActionError, createServerActionError);
	return serverActionError;
}
export function isServerActionError(response: unknown): response is ServerActionError {
	const uniqueKeys: (keyof ServerActionError)[] = ["message", "stack"];
	return (
		response !== null &&
		typeof response === "object" &&
		uniqueKeys.every((key) => key in response)
	);
}
