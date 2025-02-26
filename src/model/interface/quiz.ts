import { Artist, Painting, Style } from './painting';
import { Tag } from './tag';

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
    tags: Tag;
    styles: Style;
    artist: Artist;
}
