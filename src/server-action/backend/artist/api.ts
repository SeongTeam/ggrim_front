'use server';
import { CondOperator, RequestQueryBuilder } from '@dataui/crud-request';
import { HttpException, IPaginationResult } from '../common/dto';
import { getServerUrl, withErrorHandler } from '../common/lib';
import { Artist } from './dto';

const getArtists = async (
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

const findArtists = async (
	name: string,
	pageCount = 20,
	page = 0,
): Promise<IPaginationResult<Artist> | HttpException> => {
	const qb = RequestQueryBuilder.create();

	qb.select(['name'])
		.setFilter({
			field: 'search_name',
			operator: CondOperator.STARTS,
			value: name.toLocaleUpperCase(),
		})
		.sortBy({ field: 'search_name', order: 'ASC' })
		.setLimit(pageCount)
		.setPage(page);

	return getArtists(qb);
};

export const findArtistsAction = withErrorHandler('findArtists', findArtists);
