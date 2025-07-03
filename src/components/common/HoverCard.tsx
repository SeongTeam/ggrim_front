"use client";
import { useState } from "react";
import { Card, CardProps } from "./Card";

interface HoverCardProps {
	cardProps: CardProps;
	children: React.ReactNode;
	onClick?: () => void;
}

export const HoverCard = ({ cardProps, children, onClick }: HoverCardProps) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div
			className="relative"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={onClick}
		>
			<Card {...cardProps} />
			{isHovered && <>{children}</>}
		</div>
	);
};
