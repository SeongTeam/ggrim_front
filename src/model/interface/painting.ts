import { Tag } from './tag';

export interface Painting {
    created_date: string;
    updated_date: string;
    deleted_date: string | null;
    version: number;
    id: string;
    title: string;
    image_url: string;
    description: string;
    ggrim_description: string;
    ggrim_description_data_source: string;
    completition_year: number;
    width: number;
    height: number;
    tags: Tag[];
    styles: Style[];
    artist: Artist;
}

export interface Style {
    created_date: string;
    updated_date: string;
    deleted_date: string | null;
    version: number | null;
    id: string;
    name: string;
    info_url: string | null;
}

export interface Artist {
    created_date: string;
    updated_date: string;
    deleted_date: string | null;
    version: number | null;
    id: string;
    name: string;
    image_url: string | null;
    birth_date: string | null;
    death_date: string | null;
    info_url: string | null;
}
