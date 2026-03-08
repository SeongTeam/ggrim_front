import { ONE_TIME_TOKEN_PURPOSE, SignInResponse } from "../../../generated/dto-types";

export const isOnetimeTokenPurpose = (value: string): value is ONE_TIME_TOKEN_PURPOSE => {
	return Object.values(ONE_TIME_TOKEN_PURPOSE).some((v) => v === value);
};

export const getBasicAuth = (id: string, password: string) => {
	return `Basic ${btoa(`${id}:${password}`)}`;
};

export const getBearerAuth = (signInResponse: SignInResponse) => {
	return `Bearer ${signInResponse.accessToken}`;
};
