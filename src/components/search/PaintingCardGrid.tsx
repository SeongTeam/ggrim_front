import { Painting } from "../../model/interface/painting";
import { Card } from "../card";

interface PaintingCardGridProps  {
    paintings : Painting[];
}

export function PaintingCardGrid({ paintings } : PaintingCardGridProps ): React.JSX.Element {

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {paintings.map((item) => (
                    <Card key={item.id} imageSrc={item.image_url} alt={item.title} title={item.title} />
                ))}
        </div>
    );
}