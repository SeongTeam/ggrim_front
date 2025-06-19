// components/PostMenu.tsx
"use client";

import { MoreVertical, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Quiz } from "@/server-action/backend/quiz/type";
import { useRouter } from "next/navigation";
import { deleteQuizAction } from "../../server-action/backend/quiz/api";
import { isHttpException, isServerActionError } from "../../server-action/backend/common/util";
import { HTTP_STATUS } from "../../server-action/backend/common/status";
import toast from "react-hot-toast";
import { SEARCH_LOGIC_ROUTE } from "../../route/search/route";

type QuizMenuProps = {
	quiz: Quiz;
	isOwner: boolean;
};

export const QuizMenu = ({ quiz, isOwner }: QuizMenuProps) => {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const [isShow, setIsShow] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setOpen(false);
			}
		}

		if (open) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [open]);

	const onEdit = () => {
		router.push(`/quiz/${quiz.id}/edit`);
	};

	const onDescription = () => {
		setIsShow(true);
	};

	const onDelete = async () => {
		const response = await deleteQuizAction(quiz.id);

		if (isServerActionError(response)) {
			throw new Error(response.message);
		} else if (isHttpException(response)) {
			const { statusCode } = response;
			const messages: string[] = Array.isArray(response.message)
				? response.message
				: [response.message];

			switch (statusCode) {
				case HTTP_STATUS.BAD_REQUEST:
				case HTTP_STATUS.FORBIDDEN:
				case HTTP_STATUS.UNAUTHORIZED:
					messages.forEach((m) => toast.error(m));
					break;
				default:
					throw new Error(messages.join("\n"));
			}
		} else {
			router.push("/quiz");
		}
	};

	return (
		<>
			{isShow && <ShowDescription quiz={quiz} setShow={setIsShow} isShow={isShow} />}
			<div className="relative inline-block text-left" ref={menuRef}>
				<button
					onClick={() => setOpen(!open)}
					className="flex flex-row rounded-md border border-black bg-black p-2 text-white hover:bg-gray-600"
					aria-label="Menu"
				>
					<p className="hidden md:block">MENU</p>
					<MoreVertical />
				</button>

				{open && (
					<div className="absolute right-0 z-10 mt-2 w-40 rounded-md border border-black bg-black shadow-lg">
						<button
							onClick={() => {
								onDescription();
								setOpen(false);
							}}
							className="w-full px-4 py-2 text-left text-white hover:bg-gray-600"
						>
							Description
						</button>

						{isOwner && (
							<>
								<button
									onClick={() => {
										onEdit();
										setOpen(false);
									}}
									className="w-full px-4 py-2 text-left text-white hover:bg-gray-600"
								>
									Edit
								</button>
								<button
									onClick={() => {
										onDelete();
										setOpen(false);
									}}
									className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-600"
								>
									Delete
								</button>
							</>
						)}
					</div>
				)}
			</div>
		</>
	);
};

interface ShowDescriptionProps {
	quiz: Quiz;
	isShow: boolean;
	setShow: (v: boolean) => void;
}

const ShowDescription = ({ quiz, isShow, setShow }: ShowDescriptionProps) => {
	const router = useRouter();
	const modalRef = useRef<HTMLDivElement>(null);

	const handleClickTag = (name: string) => {
		const url = SEARCH_LOGIC_ROUTE.SEARCH_PAINTING("", "", [name]);
		router.push(url);
	};

	const handleClickStyle = (name: string) => {
		const url = SEARCH_LOGIC_ROUTE.SEARCH_PAINTING("", "", [], [name]);
		router.push(url);
	};

	const handleClickArtist = (name: string) => {
		const url = SEARCH_LOGIC_ROUTE.SEARCH_PAINTING("", name);
		router.push(url);
	};

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
				setShow(false);
			}
		}

		if (isShow) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isShow, setShow]);

	return (
		<div className="relative inline-block text-left" ref={modalRef}>
			<div className="fixed inset-0 z-10 bg-black/30 backdrop-blur-sm" />
			<div className="fixed inset-0 z-10 my-20 rounded-md border border-black bg-ggrimBeige1 px-3 shadow-lg">
				<div className="mt-5 flex justify-between border-b-2 border-zinc-700 pb-3">
					<div className="flex items-end">
						<p className="text-3xl font-semibold text-black">Description </p>
						<p className="pl-5 text-xl font-semibold text-black">
							{" "}
							by {quiz.shortOwner.username}
						</p>
					</div>
					<button onClick={() => setShow(false)}>
						<X className="h-8 w-8 text-black hover:text-gray-600" />
					</button>
				</div>
				<div className="mt-5 border-b-2 border-zinc-700">
					<p className="text-xl text-black">{quiz.description}</p>
					<div className="text-md mt-5 flex text-black">
						<p className="pr-5 font-sans font-bold"> Artist: </p>
						<div className="grid grid-cols-4 text-blue-500">
							{quiz.artists.map((a) => (
								<p
									key={a.name}
									className="border-b-2 border-transparent hover:cursor-pointer hover:border-blue-600"
									onClick={() => handleClickArtist(a.name)}
								>
									#{a.name}
								</p>
							))}
						</div>
					</div>
					<div className="text-md mt-5 flex text-black">
						<p className="pr-5 font-bold"> Styles: </p>
						<div className="grid grid-cols-4 font-sans text-blue-500">
							{quiz.styles.map((s) => (
								<p
									key={s.name}
									className="border-b-2 border-transparent hover:cursor-pointer hover:border-blue-600"
									onClick={() => handleClickStyle(s.name)}
								>
									#{s.name}
								</p>
							))}
						</div>
					</div>
					<div className="text-md mt-5 flex text-black">
						<p className="pr-5 font-bold"> Tags: </p>
						<div className="flex flex-wrap gap-2 font-sans text-blue-500">
							{quiz.tags.map((t) => (
								<p
									key={t.name}
									className="border-b-2 border-transparent hover:cursor-pointer hover:border-blue-600"
									onClick={() => handleClickTag(t.name)}
								>
									#{t.name}
								</p>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
