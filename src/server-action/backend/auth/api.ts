"use server";
import { withErrorHandler } from "../_common/middleware";
import {
	deleteOneTimeToken,
	deleteSignInResponse,
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
import { client } from "../_common/util";

const signIn = async (email: string, password: string) => {
	const { data, error } = await client.POST("/auth/sign-in", {
		params: {
			header: {
				authorization: getBasicAuth(email, password),
			},
		},
	});

	if (!data) {
		throw error;
	}

	setSignInResponse(data);
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
	const { error, response } = await client.POST("/auth/security-token/email", {
		body: dto,
	});

	if (!response.ok) {
		throw error;
	}
};

const generateSecurityTokenByEmailVerification = async (
	dto: CreateOneTimeTokenDto,
	tokenId: string,
	tokenValue: string,
) => {
	const { data, error } = await client.POST("/auth/security-token/email-verification", {
		params: {
			header: {
				"x-one-time-token-identifier": tokenId,
				"x-one-time-token-value": tokenValue,
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
