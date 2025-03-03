import { Painting } from '../../model/interface/painting';
import { Quiz } from '../../model/interface/quiz';

export interface FindPaintingResult {
    data: Painting[];
    isMore: boolean;
    pagination: number;
    count: number;
}

export interface FindQuizResult {
    data: Quiz[];
    isMore: boolean;
    pagination: number;
    count: number;
}
