"use server";
import { CondOperator, RequestQueryBuilder } from "@dataui/crud-request";
import { PaginationResponse } from "../_common/type";
import { withErrorHandler } from "../_common/middleware";
import { ShowArtistResponse } from "../../../generated/dto-types";
import { client } from "../_common/util";

const getArtists = async (
	queryBuilder: RequestQueryBuilder,
): Promise<PaginationResponse<ShowArtistResponse>> => {
	const { data, error } = await client.GET("/artist", {
		params: {
			query: queryBuilder.queryObject,
		},
	});

	if (!data) {
		throw error;
	}

	return data;
};

const findArtists = async (name: string, pageCount = 20, page = 0) => {
	const qb = RequestQueryBuilder.create();

	qb.select(["name"])
		.setFilter({
			field: "search_name",
			operator: CondOperator.STARTS,
			value: name.toLocaleUpperCase(),
		})
		.sortBy({ field: "search_name", order: "ASC" })
		.setLimit(pageCount)
		.setPage(page);

	return getArtists(qb);
};

export const findArtistsAction = withErrorHandler("findArtists", findArtists);
