import { RequestQueryBuilder } from '@dataui/crud-request';
import { Tag } from '../../../model/interface/tag';
import { getServerUrl } from '..';
import { serverLogger } from '../../../util/logger';

export const findTags = async (queryBuilder: RequestQueryBuilder): Promise<Tag[] | undefined> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/tag`;
    const response = await fetch(url + `?${queryBuilder.query()}`);

    if (!response.ok) {
        const result = await response.json();
        serverLogger.error(`findTags fail. ${JSON.stringify(result, null, 2)}`);
        return undefined;
    }

    const result: Tag[] = await response.json();
    return result;
};
