'use client'
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import {  RefObject, useRef, useState } from "react";
import { SearchBar } from "../SearchBar";
import { debounce } from "../../util/optimization";
import { INPUT_KEY, InputKeyValue, SEARCH_PARAM_KEY } from "./const";

interface ParsedInput {
    title : string;
    artist : string; 
    tags : string[];
    styles : string[];
}

function parseInput(input: string): ParsedInput {
    const extractValues = (key: InputKeyValue): string[] => {
      // 정규식을 `&&-key:` 형식으로 변경
      const regex = new RegExp(`${key}:(\\S+)`, 'g');
      const values: string[] = [];
      let match;
      while ((match = regex.exec(input)) !== null) {
        values.push(match[1]);
      }
      return values;
    };
  
    // 각 필드 추출
    const tags = extractValues(INPUT_KEY.TAG);
    const styles = extractValues(INPUT_KEY.STYLE);
    
    // 'artist'는 첫 번째 값만 추출
    const artistMatches = extractValues(INPUT_KEY.ARTIST);
    const artist = artistMatches.length > 0 ? artistMatches[0] : '';
  

    // 1단계: key:value 전체 제거
    const cleaned = input.replace(/\b\w+:\S+/g, '').trim();

    // 2단계: 남은 단어 추출
    const titleWords = cleaned.match(/\b\w+\b/g);
    const title = titleWords ? titleWords.join(' ') : '';
  
    return { title, tags, styles, artist };
  }

function getInput(searchParams : ReadonlyURLSearchParams) {
    const title : string  = searchParams.get(SEARCH_PARAM_KEY.TITLE)||"";
    const artist : string = searchParams.get(SEARCH_PARAM_KEY.ARTIST)||"";
    const tags : string[] = searchParams.getAll(SEARCH_PARAM_KEY.TAGS)||[];
    const styles : string[] = searchParams.getAll(SEARCH_PARAM_KEY.STYLES)||[];

    const inputs : string[]  = [title];
    const delimiter = ' ';


    if(artist.trim() !== ""){
        inputs.push(`${INPUT_KEY.ARTIST}:${artist}`);
    }

    if(tags.length !== 0){
        inputs.push(...tags.map(t=>`${INPUT_KEY.TAG}:${t}`));
    }

    if(styles.length !== 0){

        inputs.push(...styles.map(s=>`${INPUT_KEY.STYLE}:${s}`));
    }

    return inputs.join(delimiter);

}

function getURL(input : string ) : string{
    const parsed : ParsedInput = parseInput(input);

    let url = `/search?${SEARCH_PARAM_KEY.TITLE}=${parsed.title}`;

    if(parsed.artist.trim() !== ""){
        url += `&${SEARCH_PARAM_KEY.ARTIST}=${parsed.artist}`;
    }

    parsed.tags.forEach(tag=>
        url += `&${SEARCH_PARAM_KEY.TAGS}=${tag}` 
    );
    parsed.styles.forEach(style=>
        url += `&${SEARCH_PARAM_KEY.STYLES}=${style}` 
    );

    return url;
}

interface SearchPaintingBarProps {
    inputRef? : RefObject<HTMLInputElement>;
}

// TODO: <SearchPaintingBar /> 기능 개선
// - [ ] 여러번 검색 후, 뒤로가기 버튼 클릭시, URL searchParams은 변경되지만, 검색창의 값이 동기화되지않음.
//  -> 사용자 편의성 개선을 위해 수정되어야하는 버그
// - [ ] <추가 작업>
// ! 주의: <경고할 사항>
// ? 질문: <의문점 또는 개선 방향>
// * 참고: <관련 정보나 링크>
export function SearchPaintingBar(props : SearchPaintingBarProps): React.JSX.Element {

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
            <SearchBar inputRef={props.inputRef} onSearch={handleSearchDebounceRef.current} defaultValue={input} />

    );
}
