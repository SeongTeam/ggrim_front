'use client'
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { SearchBar } from "../SearchBar";

interface SearchPaintingProps  {
    searchTitle : string;
}

export function SearchPaintingBar({  searchTitle } : SearchPaintingProps ): React.JSX.Element {

    const router = useRouter();
    const pathName = usePathname();
    const [title, setTitle] = useState(searchTitle);
    // const [results, setResults] = useState<Painting[]>([]);
    const handleSearch = useCallback(async (searchTitle: string) => {
        if(searchTitle.trim() === ""){
            if(pathName !== '/'){
                router.push('/');
            }
            return;
        }
        router.push(`/search?title=${searchTitle}`);
        setTitle(searchTitle);
        return;
    }, []);

    return (
            <SearchBar onSearch={handleSearch} defaultValue={title} />

    );
}
