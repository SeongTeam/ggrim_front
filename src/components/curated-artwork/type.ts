import { Artist } from "../../server-action/backend/artist/dto";
import { Painting } from "../../server-action/backend/painting/type";
import { Style } from "../../server-action/backend/style/type";
import { Tag } from "../../server-action/backend/tag/type";

export const curatedContentType = {
	GIF: "GIF",
	MP4: "MP4",
	NOTHING: "NOTHING",
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
export interface PaintingModel extends Painting {
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

export function toPaintingModel(painting: Painting): PaintingModel {
	return {
		version: painting.version,
		id: painting.id,
		title: painting.title,
		image_url: painting.image_url,
		description: painting.description,
		completition_year: painting.completition_year,
		width: painting.width,
		height: painting.height,
		tags: painting.tags,
		styles: painting.styles,
		artist: painting.artist,
	};
}

export function createPainting(): Painting {
	return {
		version: 0,
		id: "",
		title: "",
		image_url: "",
		description: "",
		completition_year: 0,
		width: 0,
		height: 0,
		tags: [],
		styles: [],
		artist: {
			version: 0,
			id: "",
			name: "",
			image_url: "",
			birth_date: "",
			death_date: "",
			info_url: "",
		},
	};
}

export function toPainting(model: PaintingModel): Painting {
	return {
		version: model.version,
		id: model.id,
		title: model.title,
		image_url: model.image_url,
		description: model.description,
		completition_year: model.completition_year,
		width: model.width,
		height: model.height,
		tags: model.tags,
		styles: model.styles,
		artist: model.artist,
	};
}
