'use server';
import { RequestQueryBuilder } from '@dataui/crud-request';
import { Tag } from '../../../model/interface/tag';
import { getServerUrl, withErrorHandler } from '../lib';
import { HttpException, IPaginationResult } from '../common.dto';

export const findTags = async (
    queryBuilder: RequestQueryBuilder,
): Promise<IPaginationResult<Tag> | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/tag`;
    const response = await fetch(url + `?${queryBuilder.query()}`);

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    const result: IPaginationResult<Tag> = await response.json();
    return result;
};

export const findTagsAction = withErrorHandler(findTags);
