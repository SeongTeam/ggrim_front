import { Tag } from './tag';

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

export interface Style {
    version: number | null;
    id: string;
    name: string;
    info_url: string | null;
}

export interface Artist {
    version: number | null;
    id: string;
    name: string;
    image_url: string | null;
    birth_date: string | null;
    death_date: string | null;
    info_url: string | null;
}

export function getEmptyPaintingObject(): Painting {
    const result: Painting = {
        version: 0,
        id: '',
        title: '',
        image_url: '',
        description: '',
        completition_year: 0,
        width: 0,
        height: 0,
        tags: [],
        styles: [],
        artist: {
            id: '',
            name: '',
            version: 0,
            image_url: '',
            birth_date: '',
            death_date: '',
            info_url: '',
        },
    };

    return result;
}

export interface IPaginationResult<T> {
    data: T[];
    count: number;
    pagination: number;
    isMore?: boolean;
}

export interface ShortPainting {
    id: string;
    title: string;
    image_url: string;
    width: number;
    height: number;
}
