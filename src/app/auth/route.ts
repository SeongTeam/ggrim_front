import { OneTimeTokenPurpose } from '../../server-action/backend/auth/type';

export const AUTH_LOGIC_ROUTE = {
    SIGN_IN: '/auth/sign-in',
    SIGN_UP: `/auth/verify-email`,
    VERIFY_USER: (purpose: OneTimeTokenPurpose) => `/auth/verify-user?purpose=${purpose}`,
    VERIFY_USER_BY_EMAIL: (purpose: OneTimeTokenPurpose) =>
        `/auth/verify-user-by-email?purpose=${purpose}`,
    DELETE_ACCOUNT: `/auth/delete-account`,
    VERIFY_EMAIL: `/auth/verify-email`,
    UPDATE_PASSWORD: `/auth/update-password`,
} as const;
