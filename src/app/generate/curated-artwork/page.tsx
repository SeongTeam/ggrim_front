import { CuratedArtworkSection } from '@/components/curated-artwork/CuratedArtworkSection';
import { ErrorModal } from '../../../components/modal/ErrorModal';

function CuratedArtwork() {
	return <ErrorModal message="invalid access" />;

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<h1 className="mb-8 text-center text-3xl font-bold text-gray-800">Artwork of week</h1>
			<CuratedArtworkSection />
		</div>
	);
}

export default CuratedArtwork;
