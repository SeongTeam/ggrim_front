"use client";
import { Search } from "lucide-react";
import { SearchPaintingBar } from "../search/SearchPaintingBar";
import { useEffect, useRef, useState } from "react";

export const SearchPaintingIconMenu = () => {
	const [isSearching, setIsSearching] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleClickSearchIcon = () => {
		setIsSearching((prev) => !prev);
	};

	useEffect(() => {
		if (isSearching && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isSearching]);

	return (
		<div
			className="flex min-h-[40px] min-w-[250px] items-center justify-end"
			onBlur={(e) => {
				if (!e.currentTarget.contains(e.relatedTarget)) {
					setIsSearching(false);
				}
			}}
		>
			{isSearching ? (
				<SearchPaintingBar inputRef={inputRef} />
			) : (
				<Search
					className="h-6 w-6 cursor-pointer text-white hover:opacity-80"
					onClick={handleClickSearchIcon}
				/>
			)}
		</div>
	);
};
