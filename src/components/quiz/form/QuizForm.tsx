"use client";
import { useCallback, useEffect, useState, type JSX } from "react";

import { Loading } from "../../common/Loading";
import { getSavedNewQuiz, saveNewQuiz } from "../../../state/browser/quiz";
import { useDebounceCallback } from "../../../hooks/useDebounceCallback";
import { ShowQuizResponse } from "../../../generated/dto-types";
import { StatePaintingKey } from "./type";
import { useQuizForm } from "./useQuizForm";
import { PaintingSelector } from "./PaintingSelector";
import toast from "react-hot-toast";

// TODO: QuizForm() 개선
// - [x] : 그림 보여주기 영역 디버깅
// - [x] : 폼 디자인 꾸미기
// - [ ] : detail Painting Modal에서 Painting ID 바로 볼수 있게 명시하기
// - [x] : 브라우저 캐시에 form context 저장하는 로직 추가
// - [x] : 브라우저 캐시에서 form context 가져오는 로직 추가
//  -> 사용자가 painting id를 검색하러 페이지를 옮길 수 있으므로, 현재 컨텍스트를 따로 보관해야함
// - [x] : title,description, input 크기 제한하기
// - [ ] <추가 작업>
// ! 주의: <경고할 사항>
// ? 질문: <의문점 또는 개선 방향>
// * 참고: <관련 정보나 링크>

interface QuizFormProps {
	quiz?: ShowQuizResponse;
}

export const QuizForm = ({ quiz }: QuizFormProps): JSX.Element => {
	const distractorKeys: StatePaintingKey[] = ["distractor1", "distractor2", "distractor3"];
	const {
		newQuiz,
		setTitle,
		setDescription,
		selectPainting,
		deletePainting,
		submitQuiz,
		setNewQuiz,
	} = useQuizForm(quiz);

	// TODO: 훅 로직 점검하기
	// - [x] debounce wrapper 훅 체크하기
	// - [ ] 기존 퀴즈 편집시 임시 저장 로직 추가하기.
	// - [ ] <추가 작업>
	// ! 주의: <경고할 사항>
	// ? 질문: <의문점 또는 개선 방향>
	// * 참고: <관련 정보나 링크>

	const loadSavedNewQuiz = useCallback(() => {
		const savedNewQuiz = getSavedNewQuiz();
		if (savedNewQuiz) {
			setNewQuiz(savedNewQuiz);
		}
	}, []);

	const saveNewQuizDebounced = useDebounceCallback(saveNewQuiz, 500);

	useEffect(() => {
		// 1.렌더링 된 후에 useEffect가 실행되므로, 저장된 값을 불러오는 동안에 깜빡이는 현상이 발생함.
		//=> 해결 방법 : newQuiz 상태의 초기값을 null로 지정. null인경우, loading 컴포넌트를 보여줌
		// 2. <InsertInput />요소의 값이 복원되지 않음.
		//=> 해결 방법 : <InsertInput /> prop에 전달될 값도 localStorage에 백업.
		if (!quiz) {
			loadSavedNewQuiz();
		}
	}, [quiz, loadSavedNewQuiz]);

	useEffect(() => {
		if (!quiz) {
			saveNewQuizDebounced(newQuiz);
		}
	}, [newQuiz, quiz, saveNewQuizDebounced]);

	if (!newQuiz) {
		return <Loading />;
	}

	return (
		<div className="flex h-full items-center justify-center">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					submitQuiz(newQuiz).catch((err) => toast.error(err.message));
				}}
				className="max-w-5xl rounded-lg text-white shadow-lg md:min-w-[600px]"
			>
				<div className="mb-4">
					<input
						type="text"
						placeholder="Title"
						value={newQuiz.title}
						onChange={(e) =>
							setTitle(e.target.value).catch((err) => toast.error(err.message))
						}
						className="w-full rounded border border-gray-700 bg-gray-800 p-3 transition focus:border-red-600 focus:outline-none"
						required
					/>
				</div>

				<div key="painting selection" className="mb-4">
					<div>
						<h1 className="mb-2 text-2xl font-bold"> Quiz Paintings </h1>
						<div className="grid min-h-56 content-center items-center gap-4 rounded-lg border-2 border-gray-200 bg-gray-500 p-2 sm:grid-cols-1 md:grid-cols-2">
							<div className={`flex w-fit rounded-lg border-2 border-green-500`}>
								<PaintingSelector
									onSelect={(paintingId) =>
										selectPainting("answer", paintingId).catch((err) =>
											toast.error(err.message),
										)
									}
									onDelete={(paintingId) =>
										deletePainting("answer").catch((err) =>
											toast.error(err.message),
										)
									}
									prevPainting={newQuiz.answer}
								/>
							</div>

							{distractorKeys.map((key) => (
								<div
									key={key}
									className={`flex w-fit rounded-lg border-2 border-red-800`}
								>
									<PaintingSelector
										onSelect={(paintingId) =>
											selectPainting(key, paintingId).catch((err) =>
												toast.error(err.message),
											)
										}
										onDelete={(paintingId) =>
											deletePainting("answer").catch((err) =>
												toast.error(err.message),
											)
										}
										prevPainting={newQuiz[key]}
									/>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="mb-4">
					<textarea
						placeholder="Description"
						value={newQuiz.description}
						onChange={(e) =>
							setDescription(e.target.value).catch((err) => toast.error(err.message))
						}
						className="w-full rounded border border-gray-700 bg-gray-800 p-3 transition focus:border-red-600 focus:outline-none"
						required
					/>
				</div>
				<div className="mb-10 flex justify-center">
					<button
						type="submit"
						className="border-b-2 border-transparent text-xl hover:border-white"
					>
						{" "}
						{quiz === undefined ? "Create" : "Edit"}{" "}
					</button>
				</div>
			</form>
		</div>
	);
};
