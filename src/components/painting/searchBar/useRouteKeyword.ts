"use client";

import { useRouter } from "next/navigation";
import { getSearchParams, getURL } from "./util";
import { useSearchParams } from "next/navigation";
import { PAINTING_PARAM_KEY } from "./const";

export const useRouteKeyword = () => {
	const getKeyword = () => {
		return useSearchParams().get(PAINTING_PARAM_KEY.KEYWORD) || "";
	};
	const router = useRouter();
	const routeToKeyword = async (searchTarget: string) => {
		if (searchTarget.trim() === "") {
			return;
		}

		router.push(getURL(searchTarget));
		return;
	};

	const getPaintingSearchParams = () => {
		const keyword = getKeyword();
		const { title, artist, tags, styles } = getSearchParams(keyword);

		return { title, artist, tags, styles };
	};

	return { routeToKeyword, getKeyword, getPaintingSearchParams };
};
