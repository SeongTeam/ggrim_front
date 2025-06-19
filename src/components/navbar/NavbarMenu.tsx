'use client';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

const NavRoute = {
	home: '/',
	quiz: '/quiz',
	quizCreate: '/quiz/create',
};

export const NavbarMenu = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => setIsOpen((prev) => !prev);

	return (
		<div className="relative flex items-center justify-center">
			{/* 모바일 메뉴 버튼 */}
			<button className="p-2 text-white md:hidden" onClick={toggleMenu}>
				{isOpen ? <X size={24} /> : <Menu size={24} />}
			</button>

			{/* 네비게이션 메뉴 */}
			<ul
				className={`absolute left-0 top-full flex w-full min-w-48 flex-col space-y-4 bg-gray-900 p-4 text-base text-white md:relative md:w-auto md:flex-row md:space-x-6 md:space-y-0 md:bg-transparent md:p-0 ${
					isOpen ? 'block' : 'hidden md:flex'
				}`}
			>
				<li className="cursor-pointer hover:text-gray-300">
					<Link href={NavRoute.home}> Home</Link>
				</li>
				<li className="cursor-pointer hover:text-gray-300">
					<Link href={NavRoute.quiz}> Quiz</Link>
				</li>
				<li className="cursor-pointer hover:text-gray-300">
					<Link href={NavRoute.quizCreate}> Create Quiz</Link>
				</li>
			</ul>
		</div>
	);
};
