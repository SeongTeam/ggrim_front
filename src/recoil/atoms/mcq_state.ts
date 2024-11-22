import { MCQAttributes } from "@/types/mcq_types";
import { atom } from "recoil";

const defaultMCQAttributes: MCQAttributes = {
  displayAnswers: [],
  answer: "ggrim",
  id: "initMCQ",
  isFinalized: true,
  question: "question",
  selectedAnswer: null,
  showHintButton: false,
};

export const mcqListState = atom<MCQAttributes[]>({
  key: "mcqListState",
  default: [defaultMCQAttributes], // default 값 초기에 DB에서 받아 와야함
});
