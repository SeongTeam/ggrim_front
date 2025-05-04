import { RequestQueryBuilder } from '@dataui/crud-request';
import { getServerUrl } from '..';
import { User } from '../../../model/interface/user';
import { serverLogger } from '../../../util/logger';
import { ENUM_ONE_TIME_TOKEN_HEADER, ENUM_SECURITY_TOKEN_HEADER } from '../auth/header';
import { CreateUserDTO, ReplacePassWordDTO, ReplaceUsernameDTO } from './dto';
import { getOneTimeTokenOrRedirect, getSignInResponseOrRedirect } from '../cookie';

export const signUp = async (dto: CreateUserDTO): Promise<User | undefined> => {
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
        const result = await response.json();
        serverLogger.error(`signUp fail. ${JSON.stringify(result, null, 2)}`);
        return undefined;
    }

    const result: User = await response.json();
    return result;
};

export const getUser = async (id: string): Promise<User | undefined> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/user/`;
    const response = await fetch(url + `/${id}`);

    if (!response.ok) {
        const result = await response.json();
        serverLogger.error(`getUser fail. ${JSON.stringify(result, null, 2)}`);
        return undefined;
    }

    const result: User = await response.json();
    return result;
};

export const findUsers = async (queryBuilder: RequestQueryBuilder): Promise<User[] | undefined> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/user/`;
    const response = await fetch(url + `?${queryBuilder.query()}`);

    if (!response.ok) {
        const result = await response.json();
        serverLogger.error(`findUsers fail. ${JSON.stringify(result, null, 2)}`);
        return undefined;
    }

    const result: User[] = await response.json();
    return result;
};

export const updateUserPW = async (user: User, dto: ReplacePassWordDTO): Promise<boolean> => {
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
        const result = await response.json();
        serverLogger.error(`updateUserPW fail. ${JSON.stringify(result, null, 2)}`);
        return false;
    }

    return true;
};

export const updateUserUsername = async (user: User, dto: ReplaceUsernameDTO): Promise<boolean> => {
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
        const result = await response.json();
        serverLogger.error(`updateUserUsername fail. ${JSON.stringify(result, null, 2)}`);
        return false;
    }

    return true;
};

export const deleteUser = async (user: User): Promise<boolean> => {
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
        const result = await response.json();
        serverLogger.error(`deleteUser fail. ${JSON.stringify(result, null, 2)}`);
        return false;
    }

    return true;
};

export const recoverUser = async (email: string) => {
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
        const result = await response.json();
        serverLogger.error(`updateUserPW fail. ${JSON.stringify(result, null, 2)}`);
        return false;
    }

    return true;
};
