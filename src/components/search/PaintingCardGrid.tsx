'use client';
import { useState } from "react";
import { Painting } from "../../model/interface/painting";
import HoverCard from "../HoverCard";
import { PreviewPainting } from '../PreviewPainting';
import { Modal } from "../Modal";
import { PaintingDetailView } from "../PaintingDetailView";
import { getPainting } from "../../app/lib/apis";

interface PaintingCardGridProps  {
    paintings : Painting[];
}

export function PaintingCardGrid({ paintings } : PaintingCardGridProps ): React.JSX.Element {

    const [selectedPainting , setSelectedPainting] = useState<Painting|undefined>(undefined);

    const openModal = async (paintingId : string) =>{
        const painting = await getPainting(paintingId)
        setSelectedPainting(painting);
    }

    const closeModal = () =>{
        setSelectedPainting(undefined);
    }



    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {paintings.map((item) => (
                    <HoverCard key={`${item.id}+HoverCardItem`} 
                        cardProps ={{imageSrc : item.image_url, alt : item.title, title : item.title}}
                        onClick={()=>openModal(item.id)}
                        >
                        <PreviewPainting painting={item} />
                    </HoverCard>
                ))}
                {selectedPainting &&
                <Modal onClose={closeModal}>
                    <PaintingDetailView painting={selectedPainting}/>
                </Modal>
                }
        </div>
    );
}