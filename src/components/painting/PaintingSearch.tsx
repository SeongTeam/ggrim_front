"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ShowPainting } from "../../generated/dto-types";
import { PaginationResponse } from "../../server-action/backend/_common/type";
import { PaintingCardGrid } from "./cardGrid/PaintingCardGrid";
import { PaintingSearchBar } from "./searchBar/PaintingSearchbar";
import { useRouteKeyword } from "./searchBar/useRouteKeyword";
import { PAINTING_LOGIC_ROUTE } from "../../route/painting/route";
// import { useSearchKeyword } from "./searchBar/useSearchKeyword";

interface PaintingSearchProps {
	initPaintings: PaginationResponse<ShowPainting>;
}

export const PaintingSearch = ({ initPaintings }: PaintingSearchProps) => {
	const router = useRouter();
	const { routeToKeyword, getKeyword, getPaintingSearchParams } = useRouteKeyword();
	const keyword = getKeyword();

	const routeDetailPainting = async (painting: ShowPainting) => {
		const url = PAINTING_LOGIC_ROUTE.DETAIL_PAINTING(painting.id);
		router.push(url);
	};
	const query = getPaintingSearchParams();

	return (
		<>
			<PaintingSearchBar initInput={keyword} onCompleteInput={routeToKeyword} />
			<PaintingCardGrid
				findResult={initPaintings}
				onClickCard={routeDetailPainting}
				loadQuery={query}
			/>
		</>
	);
};
