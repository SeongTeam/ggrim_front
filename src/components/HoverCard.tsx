'use client'
import { getUrlImageSize } from '@/util/imageUtiles';
import { useEffect, useState } from 'react';
import { Card, CardProps } from './Card';

interface HoverCardProps {
    cardProps : CardProps
    children : React.ReactNode
    onClick? : ()=> void
}

export default function HoverCard({ cardProps, children, onClick }: HoverCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [,setImageSize] = useState<{ width: number; height: number } | null>(null);

    useEffect(() => {
        getUrlImageSize(cardProps.imageSrc).then(setImageSize);
    }, [cardProps,children]);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <Card { ...cardProps} />
            {isHovered && (
                <>
                {children}
                </>
            )}
        </div>
    );
}

