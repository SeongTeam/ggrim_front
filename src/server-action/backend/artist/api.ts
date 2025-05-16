import { RequestQueryBuilder } from '@dataui/crud-request';
import { HttpException, IPaginationResult } from '../common.dto';
import { getServerUrl, withErrorHandler } from '../lib';
import { Artist } from '../../../model/interface/painting';

export const findArtists = async (
    queryBuilder: RequestQueryBuilder,
): Promise<IPaginationResult<Artist> | HttpException> => {
    const backendUrl = getServerUrl();
    const url = `${backendUrl}/artist`;
    const response = await fetch(url + `?${queryBuilder.query()}`);

    if (!response.ok) {
        const error: HttpException = await response.json();
        return error;
    }

    const result: IPaginationResult<Artist> = await response.json();
    return result;
};

export const findArtistsAction = withErrorHandler(findArtists);
