'use client'
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { SearchBar } from "./searchBar";
import { Card } from "../card";
import { Painting } from "../../model/interface/painting";

interface SearchPaintingProps  {
    paintings : Painting[];
    searchTitle : string;
}

export function SearchPainting({ paintings, searchTitle } : SearchPaintingProps ): React.JSX.Element {

    const router = useRouter();
    const [title, setTitle] = useState(searchTitle);
    // const [results, setResults] = useState<Painting[]>([]);
    const handleSearch = useCallback(async (searchTitle: string) => {     
        router.push(`/search?title=${searchTitle}`);
        setTitle(searchTitle);
        console.log(`[SearchPainting]title : ${title}`);
        return;
    }, []);

    return (
        <div>
            <SearchBar onSearch={handleSearch} defaultValue={title}/>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {paintings.map((item) => (
                    <Card key={item.id} imageSrc={item.image_url} alt={item.title} title={item.title} />
                ))}
            </div>
        </div>
    );
}
