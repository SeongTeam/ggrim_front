'use server';
import { RequestQueryBuilder } from '@dataui/crud-request';
import { cookieWithErrorHandler, getServerUrl, withErrorHandler } from '../lib';
import { User } from './type';
import { ENUM_ONE_TIME_TOKEN_HEADER, ENUM_SECURITY_TOKEN_HEADER } from '../auth/header';
import { CreateUserDTO, ReplacePassWordDTO, ReplaceUsernameDTO } from './dto';
import { HttpException } from '../common.dto';
import { OneTimeToken, SignInResponse } from '../auth/type';
import {
    deleteOneTimeToken,
    deleteSignInResponse,
    getOneTimeTokenOrRedirect,
    getSignInResponseOrRedirect,
} from '../cookie';

const signUp = async (
    oneTimeToken: OneTimeToken,
    dto: CreateUserDTO,
): Promise<User | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/user`;

    const headers = {
        'Content-Type': 'application/json',
        [ENUM_ONE_TIME_TOKEN_HEADER.X_ONE_TIME_TOKEN]: oneTimeToken.token,
        [ENUM_ONE_TIME_TOKEN_HEADER.X_ONE_TIME_TOKEN_ID]: oneTimeToken.id,
    };
    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    const result: User = await response.json();
    return result;
};

const getUser = async (id: string): Promise<User | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/user/${id}`;
    const response = await fetch(url);

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    const result: User = await response.json();
    return result;
};

const findUsers = async (queryBuilder: RequestQueryBuilder): Promise<User[] | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/user/`;
    const response = await fetch(url + `?${queryBuilder.query()}`);

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    const result: User[] = await response.json();
    return result;
};

const updateUserPW = async (
    oneTimeToken: OneTimeToken,
    dto: ReplacePassWordDTO,
): Promise<boolean | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/user/${oneTimeToken.email}/password`;

    const headers = {
        'Content-Type': 'application/json',
        [ENUM_SECURITY_TOKEN_HEADER.X_SECURITY_TOKEN_ID]: oneTimeToken.token,
        [ENUM_SECURITY_TOKEN_HEADER.X_SECURITY_TOKEN]: oneTimeToken.id,
    };
    const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    return true;
};

const updateUserUsername = async (
    signInResponse: SignInResponse,
    dto: ReplaceUsernameDTO,
): Promise<boolean | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/user/${signInResponse.user.email}/username`;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${signInResponse.accessToken}`,
    };
    const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    return true;
};

const deleteUser = async (oneTimeToken: OneTimeToken): Promise<boolean | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/user/${oneTimeToken.email}`;

    const headers = {
        'Content-Type': 'application/json',
        [ENUM_SECURITY_TOKEN_HEADER.X_SECURITY_TOKEN_ID]: oneTimeToken.id,
        [ENUM_SECURITY_TOKEN_HEADER.X_SECURITY_TOKEN]: oneTimeToken.token,
    };
    const response = await fetch(url, {
        method: 'DELETE',
        headers,
    });

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    await deleteSignInResponse();
    await deleteOneTimeToken();

    return true;
};

const recoverUser = async (
    oneTimeToken: OneTimeToken,
    email: string,
): Promise<boolean | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/user/recover/${email}`;
    const headers = {
        'Content-Type': 'application/json',
        [ENUM_SECURITY_TOKEN_HEADER.X_SECURITY_TOKEN_ID]: oneTimeToken.token,
        [ENUM_SECURITY_TOKEN_HEADER.X_SECURITY_TOKEN]: oneTimeToken.id,
    };
    const response = await fetch(url, {
        method: 'PATCH',
        headers,
    });

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    return true;
};

export const signUpAction = cookieWithErrorHandler(getOneTimeTokenOrRedirect, 'signUp', signUp);

export const getUserAction = withErrorHandler('getUser', getUser);

export const findUsersAction = withErrorHandler('findUsers', findUsers);

export const updateUserPWAction = cookieWithErrorHandler(
    getOneTimeTokenOrRedirect,
    'updateUserPW',
    updateUserPW,
);

export const updateUserUsernameAction = cookieWithErrorHandler(
    getSignInResponseOrRedirect,
    'updateUserUsername',
    updateUserUsername,
);

export const deleteUserAction = cookieWithErrorHandler(
    getOneTimeTokenOrRedirect,
    'deleteUser',
    deleteUser,
);
export const recoverUserAction = cookieWithErrorHandler(
    getOneTimeTokenOrRedirect,
    'recoverUser',
    recoverUser,
);
