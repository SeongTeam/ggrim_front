import { Artist } from '../../server-action/backend/artist/dto';
import { Painting } from '../../server-action/backend/painting/type';
import { Style } from '../../server-action/backend/style/type';
import { Tag } from '../../server-action/backend/tag/type';

export const curatedContentType = {
    GIF: 'GIF',
    MP4: 'MP4',
    NOTHING: 'NOTHING',
};

export type _CuratedContentType = keyof typeof curatedContentType;

export interface CuratedArtWorkAttribute {
    id: string;
    type: _CuratedContentType;
    cldId: string;
    operatorDescription: string;
    painting: Painting;
    aspectRatio: [string, number, number]; // 추후 필요할 수 있음
}
export class PaintingModel implements Painting {
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

    constructor(data: Painting) {
        this.version = data.version;
        this.id = data.id;
        this.title = data.title;
        this.image_url = data.image_url;
        this.description = data.description;
        this.completition_year = data.completition_year;
        this.width = data.width;
        this.height = data.height;
        this.tags = data.tags;
        this.styles = data.styles;
        this.artist = data.artist;
    }

    static getEmptyObject(): Painting {
        return {
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
                version: 0,
                id: '',
                name: '',
                image_url: '',
                birth_date: '',
                death_date: '',
                info_url: '',
            },
        };
    }

    // Method to return a Painting object
    toPainting(): Painting {
        return {
            version: this.version,
            id: this.id,
            title: this.title,
            image_url: this.image_url,
            description: this.description,
            completition_year: this.completition_year,
            width: this.width,
            height: this.height,
            tags: this.tags,
            styles: this.styles,
            artist: this.artist,
        };
    }
}
