import { OneTimeTokenPurpose, ONE_TIME_TOKEN_PURPOSE } from "./type";

export const isOnetimeTokenPurpose = (value: string): value is OneTimeTokenPurpose => {
	return Object.values(ONE_TIME_TOKEN_PURPOSE).some((v) => v == value);
};
