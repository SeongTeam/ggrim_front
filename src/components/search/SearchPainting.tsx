'use client'
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { SearchBar } from "./searchBar";

interface SearchPaintingProps  {
    searchTitle : string;
}

export function SearchPainting({  searchTitle } : SearchPaintingProps ): React.JSX.Element {

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
