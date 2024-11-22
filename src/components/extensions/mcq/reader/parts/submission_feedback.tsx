// displays feedback after mcq submission in reader mode

import React from "react";
import * as Icons from "@/components/ui/icons";

interface SubmissionFeedbackProps {
  isCorrect: boolean;
  isSubmitted: boolean;
  readerSelectedAnswer: number | null;
  handleSubmit: () => void;
  handleHintButtonClick: () => void;
  handleClearSubmission: () => void;
  showHintButton: boolean;
}

const SubmissionFeedback: React.FC<SubmissionFeedbackProps> = ({
  isCorrect,
  isSubmitted,
  readerSelectedAnswer,
  handleSubmit,
  handleHintButtonClick,
  handleClearSubmission,
  showHintButton,
}) => {
  return (
    <div>
      {isSubmitted && !isCorrect ? (
        <div>
          <div className="text-lg font-semibold text-error mb-2 text-red-500">
            Incorrect... Try again!
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSubmit}
              className="btn btn-sm btn-primary  text-ggrimBrown1"
              disabled={readerSelectedAnswer === null}
            >
              Try Again
            </button>
            {showHintButton && !isCorrect && (
              <button
                onClick={handleHintButtonClick}
                className="btn btn-sm btn-outline btn-secondary flex items-center  text-ggrimBrown1"
              >
                <Icons.Lightbulb className="w-4 h-4" />
                <span className="pr-1">Smart Hint</span>
              </button>
            )}
          </div>
        </div>
      ) : isCorrect ? (
        <div>
          <div className="text-2xl font-semibold text-success mb-2 text-green-500">
            Correct!
          </div>
          <button
            onClick={handleClearSubmission}
            className="btn btn-sm btn-secondary text-base text-black border-black"
          >
            Clear
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSubmit}
            className="btn btn-sm btn-primary text-ggrimBrown1"
            disabled={readerSelectedAnswer === null}
          >
            Submit Answer
          </button>
          {showHintButton && !isCorrect && (
            <button
              onClick={handleHintButtonClick}
              className="btn btn-sm btn-outline btn-secondary flex items-center  text-ggrimBrown1"
            >
              <Icons.Lightbulb className="w-4 h-4" />
              <span className="pr-1">Smart Hint</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SubmissionFeedback;
