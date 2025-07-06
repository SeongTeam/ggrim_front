"use server";
import { CondOperator, RequestQueryBuilder } from "@dataui/crud-request";
import { Tag } from "./type";
import { getServerUrl, withErrorHandler } from "../_common/lib";
import { HttpException, IPaginationResult } from "../_common/dto";

const getTags = async (
	queryBuilder: RequestQueryBuilder,
): Promise<IPaginationResult<Tag> | HttpException> => {
	const backendUrl = getServerUrl();
	const url = `${backendUrl}/painting/tag`;
	const response = await fetch(url + `?${queryBuilder.query()}`);

	if (!response.ok) {
		const error: HttpException = await response.json();
		return error;
	}

	const result: IPaginationResult<Tag> = await response.json();
	return result;
};

const findTags = async (
	name: string,
	pageCount = 20,
	page = 0,
): Promise<IPaginationResult<Tag> | HttpException> => {
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
