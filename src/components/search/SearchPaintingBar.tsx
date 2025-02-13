'use client'
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { SearchBar } from "../SearchBar";

interface SearchPaintingProps  {
    searchTitle : string;
}

export function SearchPaintingBar({  searchTitle } : SearchPaintingProps ): React.JSX.Element {

    const router = useRouter();
    const [title, setTitle] = useState(searchTitle);
    // const [results, setResults] = useState<Painting[]>([]);
    const handleSearch = useCallback(async (searchTitle: string) => {     
        router.push(`/search?title=${searchTitle}`);
        setTitle(searchTitle);
        return;
    }, []);

    return (
            <SearchBar onSearch={handleSearch} defaultValue={title} />

    );
}
