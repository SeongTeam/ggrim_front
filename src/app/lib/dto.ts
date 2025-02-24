import { Painting } from '../../model/interface/painting';

export interface FindPaintingResult {
    data: Painting[];
    isMore: boolean;
    pagination: number;
    count: number;
}
