"use client";
import { RefObject, useEffect, useRef, useState } from "react";
import { HoverCard } from "../../common/HoverCard";
import { PreviewPainting } from "../PreviewPainting";
import { useSearchParams } from "next/navigation";
import { throttle } from "../../../util/optimization";
import { findPaintingAction } from "../../../server-action/backend/painting/api";
import { PaginationResponse } from "../../../server-action/backend/_common/type";
import { ShowPainting } from "../../../generated/dto-types";
import toast from "react-hot-toast";
import { PAINTING_PARAM_KEY } from "../searchBar/const";
import { getSearchParams } from "../searchBar/util";
import { useRouter } from "next/navigation";
import { PAINTING_LOGIC_ROUTE } from "../../../route/painting/route";

interface PaintingCardGridProps {
	findResult: PaginationResponse<ShowPainting>;
}

export const PaintingCardGrid = (props: PaintingCardGridProps): React.JSX.Element => {
	const [searchPaintings, setSearchPaintings] = useState<ShowPainting[]>(props.findResult.data); // Q. 초기값은 언제 반영되지? 만약 다른 state가 갱신되면, 현재 state는 기존값 유지 Or 초기값?
	const isLoadingRef: RefObject<boolean> = useRef(false);
	const findResultRef = useRef<PaginationResponse<ShowPainting>>(props.findResult);
	const searchParam = useSearchParams();
	const router = useRouter();

	const routeDetailPainting = async (paintingId: string) => {
		const url = PAINTING_LOGIC_ROUTE.DETAIL_PAINTING(paintingId);
		router.push(url);
	};

	// 스크롤 이벤트 핸들러
	useEffect(() => {
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
			const keyword = searchParam.get(PAINTING_PARAM_KEY.KEYWORD) || "";
			const { title, artist, tags, styles } = getSearchParams(keyword);

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

		const handleScroll = () => {
			console.log(`[handleScroll]`);
			if (
				// TODO: handleScroll 로직 성능 개선
				// - [x] throttle 구현
				//   -> innerHeight,scrollY,offsetHeight 참조는 리플로우를 발생시킬 수 있다.
				//   -> throttle을 통해서, 스크롤 핸들러가 특정 주기마다만 호출할 수 있게 하면, 리플로우 발생 횟수가 감소
				// - [ ] Intersection Observer API 사용
				//    -> throttle에 의해 리플로우 발생 횟수를 줄이더라도, 스크롤 이벤트에 특정 주기마다 리플로우가 발생할 수 있다.
				//    -> 브라우저가 직접 요소의 가시성을 감지하므로, 리플로우가 발생할 때만 처리된다.
				// ! 주의: <경고할 사항>
				// ? 질문: <의문점 또는 개선 방향>
				// * 참고: - infinite Scroll 참조 문서 https://tech.kakaoenterprise.com/149

				window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
				!isLoadingRef.current
			) {
				console.log(`[loadMorePainting]`);
				loadMorePainting();
			}
		};

		const handleScrollThrottle = throttle(handleScroll, 300);

		console.log("[useEffect] : for config scroll event");
		window.addEventListener("scroll", handleScrollThrottle);
		return () => window.removeEventListener("scroll", handleScrollThrottle);
	}, [searchParam]);

	useEffect(() => {
		setSearchPaintings(props.findResult.data);
		console.log("[useEffect] : for init  SearchPainting");
		findResultRef.current = props.findResult;
		return () => {
			setSearchPaintings((prev) => prev);
		};
	}, [props.findResult]);

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
						onClick={() => routeDetailPainting(item.id)}
					>
						<PreviewPainting shortPainting={item} />
					</HoverCard>
				</div>
			))}
			{isLoadingRef.current && <p className="mt-4 text-center">Loading...</p>}
		</div>
	);
};
