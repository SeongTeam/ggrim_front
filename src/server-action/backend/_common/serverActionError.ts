export const SERVER_ACTION_ERROR_MSG = {
	unauthorized: "Unauthorized: You do not have permission to perform this action.",
	unauthenticated: "Unauthenticated: You need to be authenticated to perform this action.",
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
