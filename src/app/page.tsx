// import { Navbar } from '@/components';
import { ArtworkCarousel } from "@/components/home/ArtworkCarousel";
import { ScrollTriggerNavigator } from "../components/quiz/ScrollTriggerNavigator";
import { ScrollExpander } from "../components/home/ScrollExpander";
import { getWeekArtWorkDataAction } from "../server-action/backend/painting/api";
import { getQuizListAction, scheduleQuizAction } from "../server-action/backend/quiz/api";

// TODO: Main Page 리팩토링하기
// - [ ] 컴포넌트 함수 이름 변경하여 기능 명확성 향상시키기
// - [ ] 프로젝트 구조 리팩토링하기
// ! 주의: <경고할 사항>
// ? 질문: UX를 향상시키는 더 좋은 점이 있는가?
// * 참고: <관련 정보나 링크>

export default async function Campaign() {
	const domID = `main`;

	const { artworkOfWeekData, quizzes, responseQuizDTO } = await fetchCampaignData();

	return (
		<div>
			{/* <Navbar /> */}
			<ArtworkCarousel curatedWorkAttributes={artworkOfWeekData} quizzes={quizzes.data} />
			{/* <MackRecoilUI></MackRecoilUI> */}
			{/* <Footer /> */}
			<div
				id={domID}
				className="flex justify-center overflow-hidden bg-yellow-400 transition-all duration-300"
				style={{ height: "50px" }}
			>
				<p className="text-3xl text-black">Scroll and Enjoy Quiz</p>
				<ScrollExpander domId={domID} maxHeight={400} incrementAmount={20} />
				<ScrollTriggerNavigator
					section={{ id: domID, path: `/quiz/${responseQuizDTO.shortQuiz.id}` }}
					criticalRatio={0.1}
				/>
			</div>
		</div>
	);
}

const fetchCampaignData = async () => {
	try {
		const [artworkOfWeekData, quizzes, responseQuizDTO] = await Promise.all([
			getWeekArtWorkDataAction(),
			getQuizListAction(),
			scheduleQuizAction(),
		]);

		return { artworkOfWeekData, quizzes, responseQuizDTO };
	} catch (error) {
		throw error;
	}
};
