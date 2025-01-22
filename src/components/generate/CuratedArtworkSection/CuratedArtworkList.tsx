import CuratedArtworkCard from './CuratedArtworkCard';
import { FormState } from './states';

interface CuratedArtworkListProps {
    curatedArtworks: FormState[];
}

export default function CuratedArtworkList({ curatedArtworks }: CuratedArtworkListProps) {
    const handleDownloadJson = () => {
        const jsonData = { dataName: 'artwork of week', data: curatedArtworks };

        const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(jsonBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'memos.json';
        link.click();
        URL.revokeObjectURL(url); // URL 해제
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Curated Artwork List</h2>
            {curatedArtworks.length === 0 ? (
                <p className="text-gray-500">작성된 Artwork 없습니다.</p>
            ) : (
                <ul className="space-y-4">
                    {curatedArtworks.map((curatedArtwork, index) => (
                        <CuratedArtworkCard formState={curatedArtwork} index={index} />
                    ))}
                </ul>
            )}
            {curatedArtworks.length > 0 && (
                <button
                    onClick={handleDownloadJson}
                    className="mt-6 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                >
                    Download .json
                </button>
            )}
        </div>
    );
}
