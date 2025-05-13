import { OneTimeTokenPurpose, OneTimeTokenPurposeValues } from './type';

export const isOnetimeTokenPurpose = (value: string): value is OneTimeTokenPurpose => {
    return Object.values(OneTimeTokenPurposeValues).some((v) => v == value);
};
