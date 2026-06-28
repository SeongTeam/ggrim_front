export const QUIZ_LOGIC_ROUTE = {
    
    SEARCH_QUIZ: `/quiz`,

    DETAIL_QUIZ: (quizId: string) => {
        return `/quiz/${quizId}`;
    },
    CREATE_QUIZ: `/quiz/create`,
    EDIT_QUIZ: (quizId: string) => {
        return `/quiz/${quizId}/edit`;
    },
} as const;
