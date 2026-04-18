"use client";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { HoverCard } from "../../common/HoverCard";
import { PreviewPainting } from "../PreviewPainting";
import { findPaintingAction } from "../../../server-action/backend/painting/api";
import { PaginationResponse } from "../../../server-action/backend/_common/type";
import { ShowPainting } from "../../../generated/dto-types";
import toast from "react-hot-toast";

interface PaintingCardGridProps {
	findResult: PaginationResponse<ShowPainting>;
	loadQuery: { title: string; artist: string; tags: string[]; styles: string[] };
	onClickCard: (painting: ShowPainting) => void;
}

export const PaintingCardGrid = ({
	findResult,
	loadQuery,
	onClickCard,
}: PaintingCardGridProps): React.JSX.Element => {
	const [searchPaintings, setSearchPaintings] = useState<ShowPainting[]>(findResult.data); // Q. 초기값은 언제 반영되지? 만약 다른 state가 갱신되면, 현재 state는 기존값 유지 Or 초기값?
	const isLoadingRef: RefObject<boolean> = useRef(false);
	const findResultRef = useRef<PaginationResponse<ShowPainting>>(findResult);
	const observerTarget = useRef<HTMLDivElement>(null);

	const loadMorePainting = async () => {
		if (
			findResultRef.current.page === findResultRef.current.pageCount ||
			isLoadingRef.current
		) {
			console.log("not load painting");
			console.log(findResultRef, isLoadingRef);
			return;
		}
		isLoadingRef.current = true;

		const { title, artist, tags, styles } = loadQuery;

		console.log(`load ${findResultRef.current.page + 1} page`);
		const result = await findPaintingAction(
			title,
			artist,
			tags,
			styles,
			findResultRef.current.page + 1,
		);
		isLoadingRef.current = false;
		if (result.ok) {
			const { data: pagination } = result;
			findResultRef.current = pagination;
			setSearchPaintings((prev) => [...prev, ...pagination.data]);
		} else {
			toast.error(result.message);
		}
	};

	// 스크롤 이벤트 핸들러
	useEffect(() => {
		// TODO: handleScroll 로직 성능 개선
		// - [x] throttle 구현
		//   -> innerHeight,scrollY,offsetHeight 참조는 리플로우를 발생시킬 수 있다.
		//   -> throttle을 통해서, 스크롤 핸들러가 특정 주기마다만 호출할 수 있게 하면, 리플로우 발생 횟수가 감소
		// - [x] Intersection Observer API 사용
		//    -> throttle에 의해 리플로우 발생 횟수를 줄이더라도, 스크롤 이벤트에 특정 주기마다 리플로우가 발생할 수 있다.
		//    -> 브라우저가 직접 요소의 가시성을 감지하므로, 리플로우가 발생할 때만 처리된다.
		// ! 주의: <경고할 사항>
		// ? 질문: <의문점 또는 개선 방향>
		// * 참고: - infinite Scroll 참조 문서 https://tech.kakaoenterprise.com/149
		console.log(`[handleScroll]`);
		const target = observerTarget.current;
		if (!target) {
			console.error("Observer target is not set");
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !isLoadingRef.current) {
						console.log(`[IntersectionObserver] target is intersecting`);
						loadMorePainting();
					}
				});
			},
			{
				root: null, // viewport
				rootMargin: "0px",
				threshold: 1.0, // 타겟이 완전히 보일 때 콜백 실행
			},
		);

		observer.observe(target);

		return () => observer.unobserve(target);
	}, []);

	useEffect(() => {
		setSearchPaintings(findResult.data);
		console.log("[useEffect] : for init  SearchPainting");
		findResultRef.current = findResult;
		return () => {
			setSearchPaintings((prev) => prev);
		};
	}, [findResult]);

	// useEffect(() => {
	//     console.log("searchPaintings 상태가 변경됨:", searchPaintings);
	// }, [searchPaintings]); // searchPaintings 상태가 변경될 때마다 로그 출력

	return (
		<div className="mt-4 grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-0 md:grid-cols-3 xl:grid-cols-4">
			{searchPaintings.map((item) => (
				<div key={`${item.id}+searchPaintingHoverCard`} className="h-[400px] max-w-2xl">
					<HoverCard
						cardProps={{
							imageProps: {
								src: item.image_url,
								height: item.height,
								width: item.width,
								alt: item.title,
							},
							title: item.title,
						}}
						onClick={() => onClickCard(item)}
					>
						<PreviewPainting shortPainting={item} />
					</HoverCard>
				</div>
			))}
			<div ref={observerTarget} className="flex h-20 items-center justify-center">
				{isLoadingRef.current && <p className="mt-4 text-center">Loading...</p>}
			</div>
		</div>
	);
};
