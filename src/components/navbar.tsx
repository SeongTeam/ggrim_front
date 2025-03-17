"use client";

import { Search, Bell, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SearchPaintingBar } from "./search/SearchPaintingBar";
import { useRouter } from "next/navigation";


// TODO: NavBar UI 개선
// - [ ] 검색창 생성시, NavBar 깜박이는 버그 수정
// - [ ] 검색창 생성시, menu list 옆으로 밀리는 버그 수정
// - [ ] 자식 컴포넌트 그룹지어서 분리하기
//  -> <할 일 > 설명 ( 생략가능 )
// - [ ] <추가 작업>
// ! 주의: <경고할 사항>
// ? 질문: <의문점 또는 개선 방향>
// * 참고: <관련 정보나 링크>

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  // 스크롤 시 네비바 스타일 변경
  if (typeof window !== "undefined") {
    window.onscroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
  }


  const handleClickHome = ()=>{
    router.push('/');
  }

  const handleClickQuiz = ()=>{
    router.push('/quiz');
  }

  const handleClickCreateQuiz = () =>{
    router.push('/quiz/create');
  }




  const handleClickBellIcon = ()=>{
    alert('not implement');
  }

  const handleClickUserIcon = () =>{
    alert('not implement');
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/90 shadow-md" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* 로고 */}
        <div className="text-yellow-300 text-2xl font-bold">Ggrim</div>

        {/* 네비게이션 메뉴 */}
        <ul className="hidden md:flex space-x-6 text-white text-sm">
          <li className="hover:text-gray-300 cursor-pointer"
            onClick={()=>handleClickHome()}  
          >Home</li>
          <li className="hover:text-gray-300 cursor-pointer"
            onClick={()=>handleClickQuiz()}
          >Quiz</li>
          <li className="hover:text-gray-300 cursor-pointer"
            onClick={()=>handleClickCreateQuiz()}
          >Create Quiz</li>
        </ul>

        {/* 아이콘 메뉴 */}
        <div className="flex items-center space-x-4">
          <SearchPaintingMenu />
          <Bell className="text-white w-5 h-5 cursor-pointer hover:opacity-80" 
            onClick={()=>handleClickBellIcon()}
          />
          <User className="text-white w-6 h-6 cursor-pointer hover:opacity-80" 
            onClick={()=>handleClickUserIcon()}
          />
        </div>
      </div>
    </nav>
  );
}

export function SearchPaintingMenu(){
  const [isSearching,setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClickSearchIcon = ()=>{
    setIsSearching(prev=>!prev);
  }


  useEffect(()=>{
    if(isSearching && inputRef.current){
        inputRef.current.focus();
    }
  },[isSearching]);

  if(!isSearching){

    return (
      <Search 
        className="text-white w-5 h-5 cursor-pointer hover:opacity-80" 
        onClick={()=>handleClickSearchIcon()}
     />
  
    );
  }


  return (
    <div 
    
      onBlur={(e)=>{

      if(!e.currentTarget.contains(e.relatedTarget)){
          setIsSearching(false);
      }
    }}>
      <SearchPaintingBar 
          inputRef={inputRef}
      />
    </div>
  );

}