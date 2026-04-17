import { ShowPainting } from "../../../generated/dto-types";
import { NoUndefined } from "../../../type/NoUndefined";
import { NewQuiz, StatePaintingKey } from "./type";

export const isDuplicatedPainting = (state: NewQuiz, painting: ShowPainting) => {
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

export function validatePaintingId(paintingId: string) {
	if (paintingId.trim().length !== paintingId.length) {
		throw new Error(`${paintingId} has space or tab. please check start and end of string`);
	}

	const UUID_SIZE = 36;
	if (paintingId.length !== UUID_SIZE) {
		throw new Error(`${paintingId} is out of ID format`);
	}
}
