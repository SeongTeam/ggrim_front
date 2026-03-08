"use server";
import { withErrorHandler } from "../_common/middleware";
import {
	deleteOneTimeToken,
	deleteSignInResponse,
	getOneTimeToken,
	setEmailVerificationToken,
	setOneTimeToken,
	setSignInResponse,
} from "../_common/cookie";
import {
	CreateOneTimeTokenDto,
	RequestVerificationDto,
	SendOneTimeTokenDto,
	VerifyDto,
} from "../../../generated/dto-types";
import { getBasicAuth } from "./util";
import { client, createServerActionError } from "../_common/util";

const signIn = async (id: string, password: string) => {
	const { data, error } = await client.POST("/auth/sign-in", {
		params: {
			header: {
				authorization: getBasicAuth(id, password),
			},
		},
	});

	if (!data) {
		throw error;
	}

	setSignInResponse(data);

	return data;
};

const sendPinCode = async (dto: RequestVerificationDto) => {
	const { data, error } = await client.POST("/auth/send-pin-code", {
		body: dto,
	});

	if (!data) {
		throw error;
	}
};

const verifyPinCode = async (dto: VerifyDto) => {
	const { data, error } = await client.POST("/auth/verify-pin-code", {
		body: dto,
	});

	if (!data) {
		throw error;
	}

	await setOneTimeToken(data);
};

const generateSecurityToken = async (id: string, password: string, dto: CreateOneTimeTokenDto) => {
	const { data, error } = await client.POST("/auth/security-token", {
		params: {
			header: {
				authorization: getBasicAuth(id, password),
			},
		},
		body: dto,
	});

	if (!data) {
		throw error;
	}

	await setOneTimeToken(data);
};

const mailSecurityToken = async (dto: SendOneTimeTokenDto) => {
	const { data, error } = await client.POST("/auth/security-token/email", {
		body: dto,
	});

	if (!data) {
		throw error;
	}
};

const generateSecurityTokenByEmailVerification = async (dto: CreateOneTimeTokenDto) => {
	const oneTimeToken = await getOneTimeToken();

	if (!oneTimeToken) {
		const serverActionError = createServerActionError("unauthorized");
		throw serverActionError;
	}
	const { data, error } = await client.POST("/auth/security-token/email-verification", {
		params: {
			header: {
				"x-one-time-token-identifier": oneTimeToken.id,
				"x-one-time-token-value": oneTimeToken.token,
			},
		},
		body: dto,
	});

	if (!data) {
		throw error;
	}

	await setEmailVerificationToken(data);
};

const signOut = async () => {
	await Promise.allSettled([deleteSignInResponse(), deleteOneTimeToken()]);
};

export const signInAction = withErrorHandler("signIn", signIn);

export const sendPinCodeAction = withErrorHandler("sendPinCode", sendPinCode);
export const verifyPinCodeAction = withErrorHandler("verifyPinCode", verifyPinCode);

export const generateSecurityTokenAction = withErrorHandler(
	"generateSecurityToken",
	generateSecurityToken,
);

export const mailSecurityTokenAction = withErrorHandler("mailSecurityToken", mailSecurityToken);

export const generateSecurityTokenByEmailVerificationAction = withErrorHandler(
	"generateSecurityTokenByEmailVerification",
	generateSecurityTokenByEmailVerification,
);

export const signOutAction = withErrorHandler("signOut", signOut);
