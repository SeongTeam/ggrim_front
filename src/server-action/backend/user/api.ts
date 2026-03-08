"use server";
import { RequestQueryBuilder } from "@dataui/crud-request";
import { withErrorHandler } from "../_common/middleware";
import {
	deleteEmailVerificationToken,
	deleteOneTimeToken,
	deleteSignInResponse,
	getEmailVerificationToken,
	getOneTimeToken,
	getSignInResponse,
} from "../_common/cookie";
import {
	CreateUserDto,
	ReplacePassWordDto,
	ReplaceUsernameDto,
} from "../../../generated/dto-types";
import { getBearerAuth } from "../auth/util";
import { serverLogger } from "../../../util/serverLogger";
import { client, createServerActionError, isServerActionError } from "../_common/util";

const signUp = async (dto: CreateUserDto) => {
	const oneTimeToken = await getOneTimeToken();

	if (!oneTimeToken) {
		const serverActionError = createServerActionError("unauthorized");
		throw serverActionError;
	}

	const { data, error } = await client.POST("/user", {
		body: dto,
		params: {
			header: {
				"x-one-time-token-identifier": oneTimeToken.id,
				"x-one-time-token-value": oneTimeToken.token,
			},
		},
	});

	if (!data) {
		throw error;
	}

	return data;
};

const getUser = async (id: string) => {
	const { data, error } = await client.GET("/user/{id}", {
		params: {
			path: { id },
		},
	});

	if (!data) {
		throw error;
	}

	return data;
};

const findUsers = async (queryBuilder: RequestQueryBuilder) => {
	const { data, error } = await client.GET("/user", {
		params: {
			query: queryBuilder.queryObject,
		},
	});

	if (!data) {
		throw error;
	}

	return data;
};

const updateUserPW = async (dto: ReplacePassWordDto) => {
	const DEFAULT = "default";
	const params = {
		path: {
			id: DEFAULT,
		},
		header: {
			"x-one-time-token-identifier": DEFAULT,
			"x-one-time-token-value": DEFAULT,
		},
	};

	try {
		const [signInResponse, oneTimeToken, emailVerificationToken] = await Promise.all([
			getSignInResponse(),
			getOneTimeToken(),
			getEmailVerificationToken(),
		]);
		if (signInResponse && oneTimeToken) {
			params.path.id = signInResponse.user.id;
			params.header["x-one-time-token-identifier"] = oneTimeToken.id;
			params.header["x-one-time-token-value"] = oneTimeToken.token;
		} else if (emailVerificationToken) {
			params.path.id = emailVerificationToken.user.id;
			params.header["x-one-time-token-identifier"] = emailVerificationToken.oneTimeToken.id;
			params.header["x-one-time-token-value"] = emailVerificationToken.oneTimeToken.token;
		} else {
			throw createServerActionError("unauthenticated");
		}
	} catch (err) {
		if (!isServerActionError(err)) {
			serverLogger.error(err);
			const serverActionError = createServerActionError("serverError");
			throw serverActionError;
		}

		throw err;
	}

	const { data, error } = await client.PUT(`/user/{id}/password`, {
		body: dto,
		params,
	});

	if (!data) {
		throw error;
	}

	await deleteOneTimeToken();
	await deleteEmailVerificationToken();

	return data;
};

const updateUserUsername = async (dto: ReplaceUsernameDto) => {
	const signInResponse = await getSignInResponse();

	if (!signInResponse) {
		const serverActionError = createServerActionError("unauthenticated");
		throw serverActionError;
	}

	const { data, error } = await client.PUT(`/user/{id}/username`, {
		body: dto,
		params: {
			path: {
				id: signInResponse.user.id,
			},
			header: {
				authorization: getBearerAuth(signInResponse),
			},
		},
	});

	if (!data) {
		throw error;
	}
};

const deleteUser = async () => {
	const signInResponse = await getSignInResponse();

	if (!signInResponse) {
		const serverActionError = createServerActionError("unauthenticated");
		throw serverActionError;
	}

	const oneTimeToken = await getOneTimeToken();

	if (!oneTimeToken) {
		const serverActionError = createServerActionError("unauthorized");
		throw serverActionError;
	}

	const { data, error } = await client.DELETE("/user/{id}", {
		params: {
			path: {
				id: signInResponse.user.id,
			},
			header: {
				"x-one-time-token-identifier": oneTimeToken.id,
				"x-one-time-token-value": oneTimeToken.token,
			},
		},
	});

	if (!data) {
		throw error;
	}

	await deleteSignInResponse();
	await deleteOneTimeToken();
};

const recoverUser = async () => {
	const emailVerificationToken = await getEmailVerificationToken();

	if (!emailVerificationToken) {
		const serverActionError = createServerActionError("unauthorized");
		throw serverActionError;
	}
	const { oneTimeToken, user } = emailVerificationToken;

	const { data, error } = await client.PUT("/user/recover/{id}", {
		params: {
			path: {
				id: user.id,
			},
			header: {
				"x-one-time-token-identifier": oneTimeToken.id,
				"x-one-time-token-value": oneTimeToken.token,
			},
		},
	});

	if (!data) {
		throw error;
	}
};

export const signUpAction = withErrorHandler("signUp", signUp);

export const getUserAction = withErrorHandler("getUser", getUser);

export const findUsersAction = withErrorHandler("findUsers", findUsers);

export const updateUserPWAction = withErrorHandler("updateUserPW", updateUserPW);

export const updateUserUsernameAction = withErrorHandler("updateUserUsername", updateUserUsername);

export const deleteUserAction = withErrorHandler("deleteUser", deleteUser);
export const recoverUserAction = withErrorHandler("recoverUser", recoverUser);
