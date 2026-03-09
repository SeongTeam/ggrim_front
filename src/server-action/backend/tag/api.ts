"use server";
import { CondOperator, RequestQueryBuilder } from "@dataui/crud-request";
import { withErrorHandler } from "../_common/middleware";
import { PaginationResponse } from "../_common/type";
import { ShowTag } from "../../../generated/dto-types";
import { client } from "../_common/util";

const getTags = async (queryBuilder: RequestQueryBuilder): Promise<PaginationResponse<ShowTag>> => {
	const { data, error } = await client.GET("/painting/tag", {
		params: {
			query: queryBuilder.queryObject,
		},
	});

	if (!data) {
		throw error;
	}

	return data;
};

const findTags = async (name: string, pageCount = 20, page = 0) => {
	const qb = RequestQueryBuilder.create();
	const searchName = name.toLocaleUpperCase();

	if (searchName !== "") {
		qb.select(["name"]).setFilter({
			field: "search_name",
			operator: CondOperator.STARTS,
			value: searchName,
		});
	}
	qb.sortBy({ field: "search_name", order: "ASC" }).setLimit(pageCount).setPage(page);
	return getTags(qb);
};

export const findTagsAction = withErrorHandler("findTags", findTags);
