// main component for the reader's mcq interface

import React from "react";
import * as Icons from "@/components/ui/icons";
import useMCQReader from "./use_MCQ_reader";
import HintPane from "@/components/extensions/mcq/reader/parts/hint_pane";
import { ErrorMessage } from "../shared";
import SubmissionFeedback from "./parts/submission_feedback";
import { MCQReaderViewProps } from "@/types/mcq_types";

const MCQReaderView = ({ attrs }: MCQReaderViewProps) => {
  const { question, displayAnswers, selectedAnswer, id, showHintButton } =
    attrs;

  const {
    errorMessage,
    readerSelectedAnswer,
    isSubmitted,
    attemptedAnswers,
    isCorrect,
    showHint,
    handleReaderSelectAnswer,
    handleSubmit,
    handleHintButtonClick,
    handleClearSubmission,
  } = useMCQReader(attrs);

  return (
    <div className="p-4 rounded-md shadow bg-ggrimBeige2">
      <h3 className="text-xl font-bold text-gray-800 mb-6">{question}</h3>
      {errorMessage && <ErrorMessage message={errorMessage} />}

      <div className="grid md:grid-cols-2 gap-4 sm:grid-cols-1">
        {displayAnswers.map((answer, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 rounded-md bg-white shadow-md"
          >
            <div className="flex flex-col items-start gap-4">
              <div className="flex flex-row items-start gap-2">
                <input
                  type="radio"
                  name={`mcq-reader-${id}-${index}`}
                  checked={readerSelectedAnswer === index}
                  onChange={() => handleReaderSelectAnswer(index)}
                  className="h-5 w-5 radio radio-primary"
                  disabled={isSubmitted && attemptedAnswers.includes(index)}
                />
                <span className="text-base font-medium text-gray-700">
                  {answer}
                </span>
              </div>

              <img
                src="https://imagescdn.gettyimagesbank.com/500/202311/jv13117838.jpg"
                alt={`Answer ${index}`}
                className="w-50 h-auto rounded-md mb-2"
              />
            </div>

            {isSubmitted && isCorrect && index === selectedAnswer && (
              <Icons.CircleCheck
                className="w-6 h-6 text-success ml-2"
                fill="green"
              />
            )}
            {isSubmitted &&
              attemptedAnswers.includes(index) &&
              index !== selectedAnswer && (
                <Icons.CircleX className="w-6 h-6 text-error ml-2" fill="red" />
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MCQReaderView;
