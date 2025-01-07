// TODO 참고로 사용후 제거 예정

// // extracted types from the MCQ conglomerate
// // the first two are for the API, the last 3 are from the frontend code

// import { MockPainting } from '@/mock/data/entity/mock_painting';

// export interface MCQSubmission {
//     mcq_id: string;
//     selected_answer: string;
//     is_correct: boolean;
// }

// export interface MCQHintRequest {
//     question: string;
//     attemptedAnswers: string[];
//     remainingAnswers: string[];
// }

// export interface MCQAttribute {
//     question: string;
//     displayPaintings: MockPainting[];
//     answers: MockPainting[];
//     selectedAnswer: number | null;
//     isFinalized: boolean;
//     id: string;
//     showHintButton?: boolean;
// }

// export interface MCQInstructorViewProps {
//     attribute: MCQAttribute;
//     updateAttributes: (attribute: Partial<MCQAttribute>) => void;
// }
