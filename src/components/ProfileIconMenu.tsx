"use client"

import { User } from "lucide-react";

export function ProfileIconMenu() {

    const handleClickUserIcon = () =>{
        alert('not implement');
      }
    return(
    <User className="text-white w-7 h-7 cursor-pointer hover:opacity-80" 
    onClick={()=>handleClickUserIcon()}
  />);
}