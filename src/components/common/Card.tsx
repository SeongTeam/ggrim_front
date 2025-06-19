import Image from 'next/image';

interface NextImageProps {
	height: number;
	width: number;
	priority?: boolean;
	src: string;
	alt: string;
}

export interface CardProps {
	title: string;
	imageProps: NextImageProps;
}

export const Card = ({ title, imageProps }: CardProps) => {
	return (
		<section className="flex flex-col overflow-hidden rounded bg-gray-900">
			<div className="max-h-[330px] overflow-hidden">
				<Image
					src={imageProps.src}
					alt={imageProps.alt}
					priority={imageProps.priority ?? false}
					width={imageProps.width}
					height={imageProps.height}
					sizes="400px"
					className="h-auto w-full object-cover"
				/>
			</div>
			<p className="p-2 text-sm text-white">{title}</p>
		</section>
	);
};
