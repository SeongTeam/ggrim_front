import { ErrorModal } from "../../../components/modal/ErrorModal";
import { PaintingDetailView } from "../../../components/painting/PaintingDetailView";
import { getPaintingAction } from "../../../server-action/backend/painting/api";

interface DetailPaintingPageProps {
	params: Promise<{ id: string }>;
}

export default async function DetailPaintingPage({ params }: DetailPaintingPageProps) {
	const { id } = await params;
	const response = await getPaintingAction(id);

	if (!response.ok) {
		return <ErrorModal message={response.message} />;
	}

	return (
		<div className="2xl:mx-120 mx-10 mt-20 md:mx-10 lg:mx-40 xl:mx-80">
			<PaintingDetailView painting={response.data} />
		</div>
	);
}
