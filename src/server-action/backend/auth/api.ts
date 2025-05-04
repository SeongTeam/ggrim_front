import { getServerUrl } from '..';
import { serverLogger } from '../../../util/logger';
import {
    CreateOneTimeTokenDTO,
    requestVerificationDTO,
    SendOneTimeTokenDTO,
    VerifyDTO,
} from './dto';
import { OneTimeToken, SignInResponse } from './type';
import { setOneTimeToken, setSignInResponse } from '../cookie';

//TODO : 사용자 정보를 반환하도록 수정하기
export const signIn = async (id: string, password: string): Promise<boolean | undefined> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/auth/sign-in`;
    const credentials = btoa(`${id}:${password}`);
    const headers = {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
        method: 'POST',
        headers,
    });

    if (!response.ok) {
        const result = await response.json();
        serverLogger.error(`signIn fail. ${JSON.stringify(result, null, 2)}`);
        return undefined;
    }

    const result: SignInResponse = await response.json();

    setSignInResponse(result);

    return true;
};

export const requestVerification = async (
    dto: requestVerificationDTO,
): Promise<boolean | undefined> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/auth/request-verification`;
    const headers = {
        'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        const result = await response.json();
        serverLogger.error(`requestVerification fail. ${JSON.stringify(result, null, 2)}`);
        return undefined;
    }

    return true;
};

export const verifyEmail = async (dto: VerifyDTO): Promise<boolean | undefined> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/auth/verify`;
    const headers = {
        'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        const result = await response.json();
        serverLogger.error(`verifyEmail fail. ${JSON.stringify(result, null, 2)}`);
        return undefined;
    }

    const result: OneTimeToken = await response.json();

    setOneTimeToken(result);

    return true;
};

export const generateSecurityToken = async (
    id: string,
    password: string,
    dto: CreateOneTimeTokenDTO,
): Promise<OneTimeToken | undefined> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/auth/security-token`;
    const credentials = btoa(`${id}:${password}`);
    const headers = {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
    };
    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        const result = await response.json();
        serverLogger.error(`generateSecurityToken fail. ${JSON.stringify(result, null, 2)}`);
        return undefined;
    }

    const result: OneTimeToken = await response.json();

    setOneTimeToken(result);

    return result;
};

export const sendSecurityTokenToEmail = async (
    dto: SendOneTimeTokenDTO,
): Promise<boolean | undefined> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/auth/security-token/send`;
    const headers = {
        'Content-Type': 'application/json',
    };
    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        const result = await response.json();
        serverLogger.error(`sendSecurityTokenToEmail fail. ${JSON.stringify(result, null, 2)}`);
        return undefined;
    }

    return true;
};
