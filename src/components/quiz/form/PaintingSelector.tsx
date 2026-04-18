"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { PaintingSearchModal } from "./PaintingSearchModal";
import { ShowPainting } from "../../../generated/dto-types";

interface PaintingSelectorProps {
	onSelect: (paintingId: string) => void;
	onDelete: (paintingId: string) => void;
	prevPainting?: ShowPainting;
}

export const PaintingSelector = ({ onSelect, onDelete, prevPainting }: PaintingSelectorProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [showPainting, setShowPainting] = useState<ShowPainting | undefined>(prevPainting);

	return (
		<>
			{showPainting === undefined ? (
				<button
					onClick={() => setIsModalOpen(true)}
					type="button"
					className="group relative flex h-48 w-48 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-900 transition-all hover:border-zinc-500 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-black"
					aria-label="open painting search modal"
				>
					{/* 중앙 + 아이콘 */}
					<div className="flex flex-col items-center gap-3">
						<Plus
							size={40}
							className="text-zinc-500 transition-transform duration-300 group-hover:scale-110 group-hover:text-zinc-200"
						/>
					</div>

					{/* 디자인적 디테일: 호버 시 은은한 광택 효과 */}
					<div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
				</button>
			) : (
				<div className="relative h-48 w-48 overflow-hidden rounded-lg border-2 border-zinc-700 bg-zinc-900 shadow-lg">
					{/* 이미지 출력 */}
					<img
						src={showPainting.image_url}
						alt={"show selected painting"}
						className="h-full w-full object-cover"
					/>

					{/* 상단 왼쪽 X 아이콘 버튼 */}
					<button
						onClick={(e) => {
							e.stopPropagation(); // 부모 요소로의 클릭 이벤트 전파 방지
							onDelete(showPainting.id);
							setShowPainting(undefined);
						}}
						type="button"
						className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-zinc-300 backdrop-blur-sm transition-all hover:bg-red-900/80 hover:text-white focus:outline-none"
						aria-label="파일 선택 취소"
					>
						<X size={16} strokeWidth={2.5} />
					</button>

					{/* 이미지 위 오버레이 (이미지 가독성을 위한 어두운 레이어) */}
					<div className="pointer-events-none absolute inset-0 bg-black/10 transition-opacity hover:opacity-0" />
				</div>
			)}
			{isModalOpen && (
				<PaintingSearchModal
					onClose={() => setIsModalOpen(false)}
					onClickCard={(showPainting) => {
						onSelect(showPainting.id);
						setShowPainting(showPainting);
					}}
				/>
			)}
		</>
	);
};
