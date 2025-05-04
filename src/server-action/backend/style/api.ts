import { RequestQueryBuilder } from '@dataui/crud-request';
import { Style } from 'util';
import { getServerUrl } from '..';
import { serverLogger } from '../../../util/logger';

export const findStyles = async (
    queryBuilder: RequestQueryBuilder,
): Promise<Style[] | undefined> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/style/`;
    const response = await fetch(url + `?${queryBuilder.query()}`);

    if (!response.ok) {
        const result = await response.json();
        serverLogger.error(`findStyles fail. ${JSON.stringify(result, null, 2)}`);
        return undefined;
    }

    const result: Style[] = await response.json();
    return result;
};
