export interface QuizCardProps {
	title: string;
	onClick: () => void;
}

// TODO: <QuizCard /> UI 개선
// - [ ] 사용자에게 보여줄 정보 추가
// ! 주의: <경고할 사항>
// ? 질문: <의문점 또는 개선 방향>
// * 참고: <관련 정보나 링크>

export const QuizCard = ({ title, onClick }: QuizCardProps) => {
	const size = 60;
	const uiTitle = title.length > size ? title.slice(0, size) + "..." : title;
	return (
		<div className="overflow-hidden rounded-lg bg-gray-900 hover:bg-gray-700">
			<div className="h-32 rounded-lg bg-white p-2 pt-4 md:h-40">
				<p className="font-sans-serif text-lg font-bold text-gray-700">{uiTitle}</p>
			</div>

			<div className="m-3">
				<p
					className="inline-block cursor-pointer border-b-2 border-transparent text-slate-200 transition-all hover:border-b-2 hover:border-slate-200"
					onClick={onClick}
				>
					Play
				</p>
			</div>
		</div>
	);
};
