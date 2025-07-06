"use server";
import { CondOperator, RequestQueryBuilder } from "@dataui/crud-request";
import { getServerUrl, withErrorHandler } from "../_common/lib";
import { HttpException, IPaginationResult } from "../_common/dto";
import { Style } from "./type";

const getStyles = async (
	queryBuilder: RequestQueryBuilder,
): Promise<IPaginationResult<Style> | HttpException> => {
	const backendUrl = getServerUrl();
	const url = `${backendUrl}/painting/style`;
	const response = await fetch(url + `?${queryBuilder.query()}`);

	if (!response.ok) {
		const error: HttpException = await response.json();
		return error;
	}

	const result: IPaginationResult<Style> = await response.json();
	return result;
};

const findStyles = async (
	name: string,
	pageCount = 20,
	page = 0,
): Promise<IPaginationResult<Style> | HttpException> => {
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
