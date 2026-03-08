"use server";
import { CondOperator, RequestQueryBuilder } from "@dataui/crud-request";
import { withErrorHandler } from "../_common/middleware";
import { PaginationResponse } from "../_common/type";
import { ShowStyle } from "../../../generated/dto-types";
import { client } from "../_common/util";

const getStyles = async (
	queryBuilder: RequestQueryBuilder,
): Promise<PaginationResponse<ShowStyle>> => {
	const { data, error } = await client.GET("/painting/style", {
		params: {
			query: queryBuilder.queryObject,
		},
	});

	if (!data) {
		throw error;
	}

	return data;
};

const findStyles = async (name: string, pageCount = 20, page = 0) => {
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

	return getStyles(qb);
};

export const findStylesAction = withErrorHandler("findStyles", findStyles);
