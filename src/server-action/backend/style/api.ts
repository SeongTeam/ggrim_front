'use server';
import { RequestQueryBuilder } from '@dataui/crud-request';
import { Style } from 'util';
import { getServerUrl, withErrorHandler } from '../lib';
import { HttpException, IPaginationResult } from '../common.dto';

const findStyles = async (
    queryBuilder: RequestQueryBuilder,
): Promise<IPaginationResult<Style> | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/style/`;
    const response = await fetch(url + `?${queryBuilder.query()}`);

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    const result: IPaginationResult<Style> = await response.json();
    return result;
};

export const findStylesAction = withErrorHandler(findStyles);
