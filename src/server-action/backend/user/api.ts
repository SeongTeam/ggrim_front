import { RequestQueryBuilder } from '@dataui/crud-request';
import { getServerUrl } from '..';
import { User } from '../../../model/interface/user';
import { serverLogger } from '../../../util/logger';
import { ENUM_ONE_TIME_TOKEN_HEADER, ENUM_SECURITY_TOKEN_HEADER } from '../auth/header';
import { CreateUserDTO, ReplacePassWordDTO, ReplaceUsernameDTO } from './dto';

export const signUp = async (
    jwt: string,
    jwtID: string,
    dto: CreateUserDTO,
): Promise<User | undefined> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/user`;

    const headers = {
        'Content-Type': 'application/json',
        [ENUM_ONE_TIME_TOKEN_HEADER.X_ONE_TIME_TOKEN]: jwt,
        [ENUM_ONE_TIME_TOKEN_HEADER.X_ONE_TIME_TOKEN_ID]: jwtID,
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

export const updateUserPW = async (
    user: User,
    securityJWT: string,
    securityJWTId: string,
    dto: ReplacePassWordDTO,
): Promise<boolean> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/user/${user.email}/password`;
    const headers = {
        'Content-Type': 'application/json',
        [ENUM_SECURITY_TOKEN_HEADER.X_SECURITY_TOKEN_ID]: securityJWT,
        [ENUM_SECURITY_TOKEN_HEADER.X_SECURITY_TOKEN]: securityJWTId,
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

export const updateUserUsername = async (
    user: User,
    jwt: string,
    dto: ReplaceUsernameDTO,
): Promise<boolean> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/user/${user.email}/username`;
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
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

export const deleteUser = async (
    user: User,
    securityJWT: string,
    securityJWTId: string,
): Promise<boolean> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/user/${user.email}`;
    const headers = {
        'Content-Type': 'application/json',
        [ENUM_SECURITY_TOKEN_HEADER.X_SECURITY_TOKEN_ID]: securityJWT,
        [ENUM_SECURITY_TOKEN_HEADER.X_SECURITY_TOKEN]: securityJWTId,
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

export const recoverUser = async (email: string, securityJWT: string, securityJWTId: string) => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/user/recover/${email}`;
    const headers = {
        'Content-Type': 'application/json',
        [ENUM_SECURITY_TOKEN_HEADER.X_SECURITY_TOKEN_ID]: securityJWT,
        [ENUM_SECURITY_TOKEN_HEADER.X_SECURITY_TOKEN]: securityJWTId,
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
