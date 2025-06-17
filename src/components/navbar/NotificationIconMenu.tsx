"use client"
import { Bell } from "lucide-react";

export const NotifyIconMenu = () => {
    const handleClickBellIcon = ()=>{
        alert('not implement');
      }
    return (
        <Bell className="text-white w-6 h-6 cursor-pointer hover:opacity-80" 
        onClick={()=>handleClickBellIcon()}
      />
    );
}