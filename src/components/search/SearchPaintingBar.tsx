'use client'
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { SearchBar } from "../SearchBar";

interface ParsedInput {
    title : string;
    artist : string; 
    tags : string[];
    styles : string[];
}

const regexPrefix='&&-'

function parseInput(input: string): ParsedInput {
    const extractValues = (key: string): string[] => {
      // 정규식을 `&&-key:` 형식으로 변경
      const regex = new RegExp(`${regexPrefix}${key}:(\\S+)`, 'g');
      const values: string[] = [];
      let match;
      while ((match = regex.exec(input)) !== null) {
        values.push(match[1]);
      }
      return values;
    };
  
    // 각 필드 추출
    const tags = extractValues('tags');
    const styles = extractValues('styles');
    
    // 'artist'는 첫 번째 값만 추출
    const artistMatches = extractValues('artist');
    const artist = artistMatches.length > 0 ? artistMatches[0] : '';
  
    // '&&-keyName:value' 형식 제거 후 남은 부분을 제목으로 처리
    const title = input.replace(/&&-\S+:\S+/g, '').trim();
  
    return { title, tags, styles, artist };
  }

function transformSearchParamsToInput() {
    const searchParams = useSearchParams();
    const title : string  = searchParams.get('title')||"";
    const artist : string = searchParams.get('artist')||"";
    const tags : string[] = searchParams.getAll('tags');
    const styles : string[] = searchParams.getAll('styles');


    let input = `${title}`;

    if(artist.trim() !== ""){
        input +=`${regexPrefix}${artist}`;
    }

    tags.forEach(tag=>input+=`${regexPrefix}${tag}`);

    styles.forEach(style=>input+=`${regexPrefix}${style}`);

    return input;

}

function transformInputToURL(input : string ) : string{
    const parsed : ParsedInput = parseInput(input);

    let url = `/search?title=${parsed.title}`;

    if(parsed.artist.trim() !== ""){
        url += `&artist=${parsed.artist}`;
    }

    parsed.tags.forEach(tag=>
        url += `&tags=${tag}` 
    );
    parsed.styles.forEach(style=>
        url += `&styles=${style}` 
    );

    return url;
}

export function SearchPaintingBar(): React.JSX.Element {

    const router = useRouter();
    const pathName = usePathname();
    const [input, setInput] = useState(transformSearchParamsToInput());
    // const [results, setResults] = useState<Painting[]>([]);
    const handleSearch = useCallback(async (searchTarget: string) => {
        if(searchTarget.trim() === ""){
            if(pathName !== '/'){
                router.push('/');
            }
            return;
        }


        router.push(transformInputToURL(searchTarget));
        setInput(searchTarget);
        return;
    }, []);

    return (
            <SearchBar onSearch={handleSearch} defaultValue={input} />

    );
}
