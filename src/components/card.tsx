
interface CardProps {
    key : string,
    imageSrc : string,
    alt : string,
    title : string,
  }
  
export function Card({ key,imageSrc,alt,title }: CardProps) {
    return (

          <div key={key} className="bg-gray-900 rounded-lg overflow-hidden">
            <img src={imageSrc} alt={alt} className="w-full h-40 object-cover" />
            <div className="p-2">
              <p className="text-white text-sm">{title}</p>
            </div>
          </div>
        );
  }