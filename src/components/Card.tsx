import Image from "next/image";


interface NextImageProps {
  height : number;
  width : number;
  priority? : boolean;
  src : string;
  alt : string,

}

export interface CardProps {
    title : string,
    imageProps : NextImageProps
  }
  
export function Card({ title,imageProps }: CardProps) {
    return (
        <section className="bg-gray-900 rounded overflow-hidden">
          <div className="flex">
            <Image
              src={imageProps.src} 
              alt={imageProps.alt} 
              sizes="400px"
              priority={imageProps.priority ?? false}
              width={imageProps.width}
              height={imageProps.height}
              className="object-cover" 
              />

          </div>
          <p className="p-2 text-white text-sm">{title}</p>
        </section>
        );
  }