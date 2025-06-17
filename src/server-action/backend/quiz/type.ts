import { Style } from '../style/type';
import { Tag } from '../tag/type';
import { ShortUser, User } from '../user/type';
import { Artist } from '../artist/dto';
import { Painting } from '../painting/type';
import { QuizContextDTO } from './dto';

export const QuizReactionTypeValues = {
    LIKE: 'like',
    DISLIKE: 'dislike',
} as const;

export type QuizReactionType = (typeof QuizReactionTypeValues)[keyof typeof QuizReactionTypeValues];

export interface QuizStatus {
    context: QuizContextDTO;
    currentIndex: number;
    endIndex: number;
}
export type QUIZ_TYPE = 'ONE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE';

export interface Quiz {
    version: number;
    created_date: Date;
    updated_date: Date;
    id: string;
    title: string;
    distractor_paintings: Painting[];
    answer_paintings: Painting[];
    example_paintings: Painting[];
    correct_count: number;
    incorrect_count: number;
    time_limit: number;
    description: string;
    type: QUIZ_TYPE;
    tags: Tag[];
    styles: Style[];
    artists: Artist[];
    owner_id: string;
    shortOwner: ShortUser;
}

export interface ShortQuiz {
    id: string;
    title: string;

    time_limit: number;
    created_date: Date;
    updated_date: Date;
    shortOwner: ShortQuiz;
}

export interface QuizLike {
    id: string;

    user: User;

    user_id: string;

    quiz: Quiz;

    quiz_id: string;
}

export interface QuizDislike {
    id: string;

    user: User;

    user_id: string;

    quiz: Quiz;

    quiz_id: string;
}
