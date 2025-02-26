export interface Tag {
    created_date: string;
    updated_date: string;
    deleted_date: string | null;
    version: number | null;
    id: string;
    name: string;
    info_url: string | null;
    //paintings : Painting[];
}
