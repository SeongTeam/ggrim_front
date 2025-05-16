export const INPUT_KEY = {
    TAG: 'tag',
    ARTIST: 'artist',
    STYLE: 'style',
} as const;

export const SEARCH_PARAM_KEY = {
    ARTIST: 'artist',
    TAGS: 'tags[]',
    STYLES: 'styles[]',
    TITLE: 'title',
} as const;

export type InputKeyValue = (typeof INPUT_KEY)[keyof typeof INPUT_KEY];
export type SearchParamKeyValue = (typeof SEARCH_PARAM_KEY)[keyof typeof SEARCH_PARAM_KEY];
