import CuratedArtworkSection from '@/components/generate/CuratedArtworkSection';

function CuratedArtwork() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Artwork of week</h1>
            <CuratedArtworkSection />
        </div>
    );
}

export default CuratedArtwork;
