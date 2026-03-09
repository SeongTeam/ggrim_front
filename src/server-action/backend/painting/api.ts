"use server";
import { withErrorHandler } from "../_common/middleware";
import { PaginationResponse } from "../_common/type";
import { ShowPainting } from "../../../generated/dto-types";
import { client } from "../_common/util";

// TODO page.tsx 최소화 예정 (데이터 처리 함수 옮길 예정)
const getWeekArtWorkData = async () => {
	const { data, error } = await client.GET("/painting/artwork-of-week", {
		params: {
			query: {
				isS3Access: true,
			},
		},
	});

	if (!data) {
		throw error;
	}

	return data;
};

const findPainting = async (
	title: string = "",
	artistName: string = "",
	tags: string[] = [],
	styles: string[] = [],
	page: number = 0,
): Promise<PaginationResponse<ShowPainting>> => {
	const { data, error } = await client.GET("/painting", {
		params: {
			query: {
				artistName: artistName,
				title: title,
				tags: tags,
				styles: styles,
				page: page,
				isS3Access: true,
			},
		},
	});

	if (!data) {
		throw error;
	}

	return data;
};

const getPainting = async (id: string) => {
	const { data, error } = await client.GET("/painting/{id}", {
		params: {
			path: {
				id,
			},
			query: {
				isS3Access: true,
			},
		},
	});

	if (!data) {
		throw error;
	}

	return data;
};

export const getWeekArtWorkDataAction = withErrorHandler("getWeekArtWorkData", getWeekArtWorkData);

export const findPaintingAction = withErrorHandler("findPainting", findPainting);

export const getPaintingAction = withErrorHandler("getPainting", getPainting);
