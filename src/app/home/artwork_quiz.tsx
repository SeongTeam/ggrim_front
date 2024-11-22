"use client";

import MCQReaderView from "@/components/extensions/mcq/reader/MCQ_reader_view";
import SubmissionPane from "@/components/ui/sudmission_pane";
import { MCQSelectionProvider } from "@/context/MCQ_selection_context";
import { mcqListState } from "@/recoil/atoms/mcq_state";
import { MCQAttributes, MCQReaderViewProps } from "@/types/mcq_types";
import { Typography } from "@material-tailwind/react";
import React from "react";
import { useRecoilState } from "recoil";

export function ArtworkQuiz<C extends React.ElementType>() {
  // TODO recoil 적용
  const [mcqList, setMcqList] = useRecoilState(mcqListState);

  const attrs1: MCQAttributes = {
    displayAnswers: ["최후의 만찬", "천지창조", "아테네 학당", "피에타"],
    answer: "아테네 학당",
    id: "1234",
    isFinalized: true,
    question:
      "라파엘로의 가장 유명한 작품 중 하나로, 바티칸 궁전의 벽화를 장식하며 고전 철학자들을 묘사한 작품의 제목은 무엇인가?",
    selectedAnswer: 3,
    showHintButton: true,
  };
  const props: MCQReaderViewProps = { attrs: attrs1 };

  return (
    <section className=" sm:px-16 md:px-40 lg:60 !py-20">
      <div className="container mx-auto bg-ggrimGrey1">
        <div className="flex max-w-md flex-col items-start">
          {/* 여기서 max-w-lg로 조정 */}
          <div className="pt-5 pl-20 mb-2 ">
            <Typography className="!text-ggrimBrown1 text-3xl font-bold relative after:content-[''] after:block after:w-full after:h-1 after:bg-ggrimBrown1 after:mt-2">
              Quiz of the Week
            </Typography>
          </div>
        </div>
        <div className="w-lg bg-ggrimGrey1">
          {/* <SubmissionPane
            mcqId="123"
            onClose={() => {}}
            show={true}
            question={"Test question"}
          /> */}
          <MCQSelectionProvider>
            <div className="relative w-full mt-4 mb-12 px-16">
              <MCQReaderView attrs={attrs1} />
            </div>
          </MCQSelectionProvider>
        </div>
      </div>
    </section>
  );
}
