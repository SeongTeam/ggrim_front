import { RequestQueryBuilder } from '@dataui/crud-request';
import { getServerUrl, withErrorHandler } from '../util';
import { User } from '../../../model/interface/user';
import { ENUM_ONE_TIME_TOKEN_HEADER, ENUM_SECURITY_TOKEN_HEADER } from '../auth/header';
import { CreateUserDTO, ReplacePassWordDTO, ReplaceUsernameDTO } from './dto';
import { getOneTimeTokenOrRedirect, getSignInResponseOrRedirect } from '../cookie';
import { HttpException } from '../common.dto';

const signUp = async (dto: CreateUserDTO): Promise<User | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/user`;

    const oneTimeToken = getOneTimeTokenOrRedirect();

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
    const url = `${backendUrl}/user/`;
    const response = await fetch(url + `/${id}`);

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
    user: User,
    dto: ReplacePassWordDTO,
): Promise<boolean | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/user/${user.email}/password`;

    const oneTimeToken = getOneTimeTokenOrRedirect();

    const headers = {
        'Content-Type': 'application/json',
        [ENUM_SECURITY_TOKEN_HEADER.X_SECURITY_TOKEN_ID]: oneTimeToken.token,
        [ENUM_SECURITY_TOKEN_HEADER.X_SECURITY_TOKEN]: oneTimeToken.id,
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

    return true;
};

const updateUserUsername = async (
    user: User,
    dto: ReplaceUsernameDTO,
): Promise<boolean | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/user/${user.email}/username`;

    const signInResponse = getSignInResponseOrRedirect();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${signInResponse.accessToken}`,
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

    return true;
};

const deleteUser = async (user: User): Promise<boolean | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/user/${user.email}`;

    const oneTimeToken = getOneTimeTokenOrRedirect();

    const headers = {
        'Content-Type': 'application/json',
        [ENUM_SECURITY_TOKEN_HEADER.X_SECURITY_TOKEN_ID]: oneTimeToken.token,
        [ENUM_SECURITY_TOKEN_HEADER.X_SECURITY_TOKEN]: oneTimeToken.id,
    };
    const response = await fetch(url, {
        method: 'DELETE',
        headers,
    });

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    return true;
};

const recoverUser = async (email: string): Promise<boolean | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/user/recover/${email}`;

    const oneTimeToken = getOneTimeTokenOrRedirect();

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

export const signUpAction = withErrorHandler(signUp);

export const getUserAction = withErrorHandler(getUser);

export const findUsersAction = withErrorHandler(findUsers);

export const updateUserPWAction = withErrorHandler(updateUserPW);

export const updateUserUsernameAction = withErrorHandler(updateUserUsername);

export const deleteUserAction = withErrorHandler(deleteUser);
export const recoverUserAction = withErrorHandler(recoverUser);
