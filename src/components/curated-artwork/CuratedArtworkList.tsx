import { createPainting } from "./type";
import { CuratedArtworkCard } from "./CuratedArtworkCard";
import { FormState } from "./states";
import { CuratedArtWorkAttribute } from "./type";
import { getUrlImageSize } from "@/util/imageUtiles";

interface CuratedArtworkListProps {
	curatedArtworks: FormState[];
}

const transformCuratedArtWorkAttribute = async (
	curatedArtworks: FormState[],
): Promise<CuratedArtWorkAttribute[]> => {
	const transformed = await Promise.all(
		curatedArtworks.map(async (formState) => {
			const { width, height } = await getUrlImageSize(formState.imageUrl);

			const painting = {
				...createPainting(),
				artist: {
					...createPainting().artist,
					name: formState.artistName,
				},
				image_url: formState.imageUrl,
				title: formState.id,
				width,
				height,
			};

			return {
				id: formState.id,
				type: formState.type === "" ? "NOTHING" : formState.type,
				cldId: formState.cldId,
				operatorDescription: formState.operatorDescription,
				painting,
				aspectRatio: formState.aspectRatio,
			};
		}),
	);
	return transformed;
};

export const CuratedArtworkList = ({ curatedArtworks }: CuratedArtworkListProps) => {
	const handleDownloadJson = async () => {
		const data = await transformCuratedArtWorkAttribute(curatedArtworks);
		const jsonData = { dataName: "artwork of week", data };

		const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(jsonBlob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "yyyy_mm_dd_artwork_of_week.json";
		link.click();
		URL.revokeObjectURL(url); // URL 해제
	};

	return (
		<div className="rounded-lg bg-white p-6 shadow-md">
			<h2 className="mb-4 text-xl font-bold text-gray-700">Curated Artwork List</h2>
			{curatedArtworks.length === 0 ? (
				<p className="text-gray-500">작성된 Artwork 없습니다.</p>
			) : (
				<ul className="space-y-4">
					{curatedArtworks.map((curatedArtwork, index) => (
						<CuratedArtworkCard key={index} formState={curatedArtwork} index={index} />
					))}
				</ul>
			)}
			{curatedArtworks.length > 0 && (
				<button
					onClick={handleDownloadJson}
					className="mt-6 rounded-lg bg-green-500 px-4 py-2 text-white transition duration-300 hover:bg-green-600"
				>
					Download .json
				</button>
			)}
		</div>
	);
};
