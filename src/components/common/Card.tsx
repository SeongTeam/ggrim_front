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
        <section className="flex flex-col bg-gray-900 rounded overflow-hidden">
            <div className="max-h-[330px] overflow-hidden">
              <Image
                src={imageProps.src} 
                alt={imageProps.alt} 
                priority={imageProps.priority ?? false}
                width={imageProps.width}
                height={imageProps.height}
                sizes="400px"
                className="w-full h-auto object-cover" 
                />
              </div>
          <p className="p-2 text-white text-sm">{title}</p>
        </section>
        );
  }