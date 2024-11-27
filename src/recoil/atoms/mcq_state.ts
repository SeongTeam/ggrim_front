import { MCQAttribute } from "@/types/mcq_types";
import { atom } from "recoil";

const defaultMCQAttributes: MCQAttribute = {
  displayPaintings: [],
  answers: [],
  id: "initMCQ",
  isFinalized: true,
  question: "question",
  selectedAnswer: null,
  showHintButton: false,
};

export const mcqListState = atom<MCQAttribute[]>({
  key: "mcqListState",
  default: [defaultMCQAttributes], // default 값 초기에 DB에서 받아 와야함
});
