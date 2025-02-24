'use client'
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import {  useRef, useState } from "react";
import { SearchBar } from "../SearchBar";
import { debounce } from "../../util/optimization";

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

function getInput(searchParams : ReadonlyURLSearchParams) {
    const title : string  = searchParams.get('title')||"";
    const artist : string = searchParams.get('artist')||"";
    const tags : string[] = searchParams.getAll('tags')||[];
    const styles : string[] = searchParams.getAll('styles')||[];


    let input = `${title} `;

    if(artist.trim() !== ""){
        input +=`${regexPrefix}artist:${artist} `;
    }

    tags.forEach(tag=>input+=`${regexPrefix}tags:${tag} `);

    styles.forEach(style=>input+=`${regexPrefix}styles:${style} `);

    return input;

}

function getURL(input : string ) : string{
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
    const searchParams = useSearchParams();
    const [input, setInput] = useState(getInput(searchParams));
    // const [results, setResults] = useState<Painting[]>([]);
    const handleSearch = async (searchTarget: string) => {
        console.log('handleSearch');
        if(searchTarget.trim() === ""){
            if(pathName !== '/'){
                router.push('/');
            }
            return;
        }


        router.push(getURL(searchTarget));
        setInput(searchTarget);
        return;
    };

    const handleSearchDebounceRef = useRef(debounce(handleSearch,500));

    return (
            <SearchBar onSearch={handleSearchDebounceRef.current} defaultValue={input} />

    );
}
