import { ShowPainting } from "../../../generated/dto-types";
import { NoUndefined } from "../../../type/NoUndefined";
import { NewQuiz, StatePaintingKey } from "./type";

export const isDuplicatedPaintingPainting = (state: NewQuiz, painting: ShowPainting) => {
	const keys: StatePaintingKey[] = ["answer", "distractor1", "distractor2", "distractor3"];
	const paintings: ShowPainting[] = [];
	keys.forEach((key) => (state[key] ? paintings.push(state[key]) : key));

	return paintings.some((p) => painting.id === p.id);
};

export function validateQuiz(quiz: NewQuiz): quiz is NoUndefined<NewQuiz> {
	if (quiz!.title.trim().length === 0) {
		throw new Error("please write title");
	}

	if (quiz!.description.trim().length === 0) {
		throw new Error("please write description");
	}

	const { answer, distractor1, distractor2, distractor3 } = quiz;

	if (!answer || !distractor1 || !distractor2 || !distractor3) {
		throw new Error("please select all paintings");
	}

	return true;
}
