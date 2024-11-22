// extracted types from the MCQ conglomerate
// the first two are for the API, the last 3 are from the frontend code

export interface MCQSubmission {
  mcq_id: string;
  selected_answer: string;
  is_correct: boolean;
}

export interface MCQHintRequest {
  question: string;
  attemptedAnswers: string[];
  remainingAnswers: string[];
}

export interface MCQAttributes {
  question: string;
  displayAnswers: string[];
  answer: string;
  selectedAnswer: number | null;
  isFinalized: boolean;
  id: string;
  showHintButton?: boolean;
}

export interface MCQInstructorViewProps {
  attrs: MCQAttributes;
  updateAttributes: (attrs: Partial<MCQAttributes>) => void;
}

export interface MCQReaderViewProps {
  attrs: MCQAttributes;
}
