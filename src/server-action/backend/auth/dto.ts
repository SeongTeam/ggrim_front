import { OneTimeTokenPurpose } from "./type";

export interface requestVerificationDTO {
	email: string;
}

export interface VerifyDTO extends requestVerificationDTO {
	pinCode: string;
}

export interface CreateOneTimeTokenDTO {
	purpose: OneTimeTokenPurpose;
}

export class SendOneTimeTokenDTO {
	email!: string;

	// @IsInArray([ONE_TIME_TOKEN_PURPOSE.UPDATE_PASSWORD, ONE_TIME_TOKEN_PURPOSE.RECOVER_ACCOUNT])
	purpose!: OneTimeTokenPurpose;
}
