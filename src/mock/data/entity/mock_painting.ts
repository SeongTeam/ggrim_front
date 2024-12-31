export class Painting {
    id: string;
    title: string;
    url: string;
    artistUrl: string;
    artistName: string;
    artistId: string;
    completitionYear: number;
    dictionaries: string[];
    location: string;
    period: string | null;
    serie: string | null;
    genres: string[];
    styles: string[];
    media: string[];
    sizeX: number | null;
    sizeY: number | null;
    diameter: number | null;
    galleries: string[];
    tags: string[];
    description: string;
    width: number;
    height: number;
    image: string;

    constructor(data: Partial<Painting>) {
        this.id = data.id || '';
        this.title = data.title || '';
        this.url = data.url || '';
        this.artistUrl = data.artistUrl || '';
        this.artistName = data.artistName || '';
        this.artistId = data.artistId || '';
        this.completitionYear = data.completitionYear || 0;
        this.dictionaries = data.dictionaries || [];
        this.location = data.location || '';
        this.period = data.period || null;
        this.serie = data.serie || null;
        this.genres = data.genres || [];
        this.styles = data.styles || [];
        this.media = data.media || [];
        this.sizeX = data.sizeX || null;
        this.sizeY = data.sizeY || null;
        this.diameter = data.diameter || null;
        this.galleries = data.galleries || [];
        this.tags = data.tags || [];
        this.description = data.description || '';
        this.width = data.width || 0;
        this.height = data.height || 0;
        this.image = data.image || '';
    }
}
