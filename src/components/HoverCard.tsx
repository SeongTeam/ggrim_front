'use client'
import { getUrlImageSize } from '@/util/imageUtiles';
import { useEffect, useState } from 'react';
import { Card, CardProps } from './card';

interface HoverCardProps {
    cardProps : CardProps
    children : React.ReactNode
}

export default function HoverCard({ cardProps, children }: HoverCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

    useEffect(() => {
        getUrlImageSize(cardProps.imageSrc).then(setImageSize);
    }, [cardProps,children]);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card { ... cardProps} />
            {isHovered && (
                <>
                {children}
                </>
            )}
        </div>
    );
}

