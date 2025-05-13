"use client"

import { LogOut, Settings, User as UserIcon  } from "lucide-react";
import { User } from "../model/interface/user";
import { useEffect, useRef, useState } from "react";
import { signOutAction } from "../server-action/backend/auth/api";
import { useRouter } from "next/navigation";
import { isServerActionError } from "../server-action/backend/util";
import { syncUserToLocalStorage, getRunningUser, removeRunningUser } from "../storage/local/runningUser";

interface ProfileIconMenuProps {
  user : User
}

export function ProfileIconMenu({ user }: ProfileIconMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toggleMenu = () => {
    setOpen((prev) => !prev);
  };

  const handleSignOut = async ()=>{
    const result = await signOutAction();
    if(isServerActionError(result)){
      throw new Error(result.message);
    }

    removeRunningUser();

    router.push('/');

  }

  const handleSetting = () => {
    router.push('');
  }

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(()=> {
    if(!user){
      return;
    }

    const runningUser = getRunningUser();
    if(!runningUser || runningUser.id !== user.id){
      syncUserToLocalStorage(user);
      return;
    }

  },[user]);

  return (
    <div className="relative" ref={menuRef}>
      <UserIcon
        className="text-white w-7 h-7 cursor-pointer hover:opacity-80"
        onClick={toggleMenu}
      />
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-zinc-900 text-white rounded-lg shadow-lg z-50">
          <div className="px-4 py-3 border-b border-zinc-700">
            <p className="text-sm font-medium">{user.username}</p>
            <p className="text-xs text-zinc-400">{user.email}</p>
          </div>
          <ul className="py-1">
            <li className="px-4 py-2 hover:bg-zinc-800 cursor-pointer flex items-center gap-2"
              onClick={handleSetting}
              >
              <Settings className="w-4 h-4" 
                
              />
              Account Setting
            </li>
            <li className="px-4 py-2 hover:bg-zinc-800 cursor-pointer flex items-center gap-2 text-red-400"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" 
                
              />
              Sign Out
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}