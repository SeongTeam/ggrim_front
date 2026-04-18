"use client";

import { useState } from "react";
import { ShowPainting } from "../../../generated/dto-types";
import { findPaintingAction } from "../../../server-action/backend/painting/api";
import { useSearchKeywordStore } from "../../../state/global/searchKeywordProvider";
import { Modal } from "../../modal/Modal";
import { PaintingCardGrid } from "../../painting/cardGrid/PaintingCardGrid";
import { PaintingSearchBar } from "../../painting/searchBar/PaintingSearchbar";
import { getSearchParams, parseWord } from "../../painting/searchBar/util";
import { PaginationResponse } from "../../../server-action/backend/_common/type";

interface PaintingSearchModalProps {
	onClose: () => void;
	onClickCard: (showPainting: ShowPainting) => void;
}

export const PaintingSearchModal = ({ onClose, onClickCard }: PaintingSearchModalProps) => {
	const { keyword, setKeyword, resetKeyword } = useSearchKeywordStore((state) => state);
	const [paginationPaintings, setPaginationPaintings] = useState<
		PaginationResponse<ShowPainting>
	>({
		data: [],
		count: 0,
		total: 0,
		page: 0,
		pageCount: 0,
	});

	const onCompleteInput = async (input: string) => {
		setKeyword(input);
		const { title, artist, tags, styles } = getSearchParams(input);
		const res = await findPaintingAction(title, artist, tags, styles);
		if (!res.ok) {
			throw new Error(res.message);
		}
		setPaginationPaintings(res.data);
	};

	return (
		<Modal onClose={onClose}>
			<div className="mt-6 h-[70vh] w-full">
				<PaintingSearchBar initInput={keyword} onCompleteInput={onCompleteInput} />
				<PaintingCardGrid
					findResult={paginationPaintings}
					onClickCard={(showPainting) => {
						onClickCard(showPainting);
						onClose();
						resetKeyword();
					}}
					loadQuery={getSearchParams(keyword)}
				/>
			</div>
		</Modal>
	);
};
