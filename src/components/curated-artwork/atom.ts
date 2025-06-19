import { atom } from "recoil";
import { FormState } from "./states";

export const formStateAtom = atom<FormState[]>({
	key: "formStateAtom", // 고유 키
	default: [], // 초기 상태
});
