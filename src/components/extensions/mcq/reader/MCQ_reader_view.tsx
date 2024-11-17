// main component for the reader's mcq interface

import React from "react";
import * as Icons from "@/components/ui/icons";
import useMCQReader from "./use_MCQ_reader";
import HintPane from "@/components/ui/hint_pane";
import { ErrorMessage } from "../shared";
import SubmissionFeedback from "./submission_feedback";
import { MCQReaderViewProps } from "@/types/mcq_types";

const MCQReaderView = ({ attrs }: MCQReaderViewProps) => {
  const { question, answers, selectedAnswer, id, showHintButton } = attrs;

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
    <div className="p-4 rounded-md shadow bg-base-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{question}</h2>
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <ul className="my-2">
        {answers.map((answer, index) => (
          <li key={index} className="flex items-center gap-2 mb-6">
            <input
              type="radio"
              name={`mcq-reader-${id}`}
              checked={readerSelectedAnswer === index}
              onChange={() => handleReaderSelectAnswer(index)}
              className="radio radio-primary"
              disabled={isSubmitted && attemptedAnswers.includes(index)}
            />
            <span className="text-base font-medium text-gray-700">
              {answer}
            </span>
            {isSubmitted && isCorrect && index === selectedAnswer && (
              <Icons.CircleCheck className="w-6 h-6 text-success ml-2" />
            )}
            {isSubmitted &&
              attemptedAnswers.includes(index) &&
              index !== selectedAnswer && (
                <Icons.CircleX className="w-6 h-6 text-error ml-2" />
              )}
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center">
        <SubmissionFeedback
          isCorrect={isCorrect}
          isSubmitted={isSubmitted}
          readerSelectedAnswer={readerSelectedAnswer}
          handleSubmit={handleSubmit}
          handleHintButtonClick={handleHintButtonClick}
          handleClearSubmission={handleClearSubmission}
          showHintButton={showHintButton ?? true}
        />
      </div>
      {showHint && (
        <HintPane
          mcqId={id}
          show={showHint}
          onClose={handleHintButtonClick}
          question={question}
          attemptedAnswers={attemptedAnswers.map((index) => answers[index])}
          remainingAnswers={answers.filter(
            (_, index) => !attemptedAnswers.includes(index)
          )}
        />
      )}
    </div>
  );
};

export default MCQReaderView;
