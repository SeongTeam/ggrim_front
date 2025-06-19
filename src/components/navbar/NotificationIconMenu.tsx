"use client";
import { Bell } from "lucide-react";

export const NotifyIconMenu = () => {
	const handleClickBellIcon = () => {
		alert("not implement");
	};
	return (
		<Bell
			className="h-6 w-6 cursor-pointer text-white hover:opacity-80"
			onClick={() => handleClickBellIcon()}
		/>
	);
};
