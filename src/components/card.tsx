import Image from "next/image";

export interface CardProps {
    imageSrc : string,
    alt : string,
    title : string,
  }
  
export function Card({ imageSrc,alt,title }: CardProps) {
    return (
        <section className="bg-gray-900 rounded overflow-hidden">
          <div className="relative h-40 ">
            <Image
              src={imageSrc} 
              alt={alt} 
              fill={true}
              sizes="400px"
              priority={true}
              className="object-cover" 
              />

          </div>
          <p className="p-2 text-white text-sm">{title}</p>
        </section>
        );
  }