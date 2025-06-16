import { Style } from '../../../model/interface/styles';
import { Tag } from '../../../model/interface/tag';
import { Artist } from '../artist/dto';
import { IPaginationResult } from '../common.dto';

export type FindPaintingResult = IPaginationResult<ShortPainting>;
export interface ShortPainting {
    id: string;
    title: string;
    image_url: string;
    width: number;
    height: number;
}
export interface Painting {
    version: number;
    id: string;
    title: string;
    image_url: string;
    description: string;
    completition_year: number;
    width: number;
    height: number;
    tags: Tag[];
    styles: Style[];
    artist: Artist;
}
