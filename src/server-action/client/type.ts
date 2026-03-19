export type ServerActionResult<T> = ServerActionSuccess<T> | ServerActionFailure;

export type ServerActionSuccess<T> = {
	data: T;
	ok: true;
};
export type ServerActionFailure = {
	ok: false;
	message: string;
};
