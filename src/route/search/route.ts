import { SEARCH_PARAM_KEY } from '../../components/search/const';

export const SEARCH_LOGIC_ROUTE = {
	SEARCH_PAINTING: (
		title: string = '',
		artist: string = '',
		tags: string[] = [],
		styles: string[] = [],
	) => {
		let url = `/search?`;

		if (title.trim() !== '') {
			url += `${SEARCH_PARAM_KEY.TITLE}=${title}&`;
		}

		if (artist.trim() !== '') {
			url += `${SEARCH_PARAM_KEY.ARTIST}=${artist}&`;
		}

		tags.forEach((tag) => (url += `${SEARCH_PARAM_KEY.TAGS}=${tag}&`));
		styles.forEach((style) => (url += `${SEARCH_PARAM_KEY.STYLES}=${style}&`));

		return url;
	},
} as const;
