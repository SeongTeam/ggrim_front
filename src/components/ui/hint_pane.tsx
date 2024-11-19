// frontend for AI generated hint

import React, { useEffect, useState, useCallback } from "react";
import * as Icons from "@/components/ui/icons";

interface HintPaneProps {
  mcqId: string;
  show: boolean;
  onClose: () => void;
  question: string;
  attemptedAnswers: string[];
  remainingAnswers: string[];
}

const HintPane: React.FC<HintPaneProps> = ({
  show,
  onClose,
  question,
  attemptedAnswers,
  remainingAnswers,
}) => {
  const [hint, setHint] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoadedHint, setHasLoadedHint] = useState(false);

  const fetchHint = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/mcq/hint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          attemptedAnswers,
          remainingAnswers,
        }),
      });
      const data = await response.json();
      if (data && data.hint) {
        setHint(data.hint);
        setHasLoadedHint(true);
      }
    } catch (error) {
      console.error("Error fetching hint:", error);
    } finally {
      setLoading(false);
    }
  }, [question, attemptedAnswers, remainingAnswers]);

  useEffect(() => {
    if (show && !hasLoadedHint) {
      setIsVisible(true);
      fetchHint();
    } else if (show) {
      setIsVisible(true);
    }
  }, [show, hasLoadedHint, fetchHint]);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!show) return null;

  return (
    <div
      className={`fixed top-16 right-3 w-1/4 h-auto max-h-[50vh] border-dashed border-secondary border-2 shadow-lg z-50 p-4 rounded-md flex flex-col transition-opacity duration-300 ease-in-out bg-base-100 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="hint-pane-title"
    >
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-bold">Smart Hint</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <Icons.X className="w-6 h-6" />
          </button>
        </div>
      </div>
      <h3 className="text-sm font-semibold text-gray-600 mb-5">{question}</h3>
      <div className="overflow-y-auto flex-grow">
        {loading ? (
          <div className="skeleton h-20 w-full mb-4"></div>
        ) : (
          <p className="text-gray-700">{hint}</p>
        )}
      </div>
    </div>
  );
};

export default HintPane;
