import Image from "next/image";
export interface CardProps {
    imageSrc : string,
    alt : string,
    title : string,
    height? : number,
    width? : number,
  }
  
export function Card({ imageSrc,alt,title,height,width }: CardProps) {
    return (

          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <Image height={height} width={width} src={imageSrc} alt={alt} className="w-full h-40 object-cover" />
            <div className="p-2">
              <p className="text-white text-sm">{title}</p>
            </div>
          </div>
        );
  }