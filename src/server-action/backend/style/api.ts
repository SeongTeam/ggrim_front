import { RequestQueryBuilder } from '@dataui/crud-request';
import { Style } from 'util';
import { getServerUrl, withErrorHandler } from '../util';
import { HttpException } from '../common.dto';

const findStyles = async (queryBuilder: RequestQueryBuilder): Promise<Style[] | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/style/`;
    const response = await fetch(url + `?${queryBuilder.query()}`);

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    const result: Style[] = await response.json();
    return result;
};

export const findStylesAction = withErrorHandler(findStyles);
