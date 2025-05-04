import { OneTimeTokenPurpose } from './type';

export interface SignInResponse {
    accessToken: string;
    refreshToken: string;
    email: string;
}

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

    // @IsInArray([OneTimeTokenPurposeValues.UPDATE_PASSWORD, OneTimeTokenPurposeValues.RECOVER_ACCOUNT])
    purpose!: OneTimeTokenPurpose;
}
