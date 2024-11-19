"use client";

import MCQReaderView from "@/components/extensions/mcq/reader/MCQ_reader_view";
import SubmissionPane from "@/components/ui/sudmission_pane";
import { MCQSelectionProvider } from "@/context/MCQ_selection_context";
import { MCQAttributes, MCQReaderViewProps } from "@/types/mcq_types";
import { Typography } from "@material-tailwind/react";
import React from "react";

export function ArtworkQuiz<C extends React.ElementType>() {
  const attrs1: MCQAttributes = {
    answers: [
      "000",
      "111",
      "222",
      "333",
      "444",
      "555",
      "666",
      "777",
      "888",
      "999",
    ],
    id: "1234",
    isFinalized: true,
    question: "test question",
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
            <div className="relative w-full mt-4 mb-12"></div>
          </MCQSelectionProvider>
          {/* <MCQReaderView attrs={attrs1} /> */}
        </div>
      </div>
    </section>
  );
}
