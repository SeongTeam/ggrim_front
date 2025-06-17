export const ENUM_SECURITY_TOKEN_HEADER = {
    X_SECURITY_TOKEN_ID: `x-security-token-identifier`,
    X_SECURITY_TOKEN: 'x-security-token-value',
} as const;

export const ENUM_ONE_TIME_TOKEN_HEADER = {
    X_ONE_TIME_TOKEN_ID: `x-one-time-token-identifier`,
    X_ONE_TIME_TOKEN: 'x-one-time-token-value',
} as const;
