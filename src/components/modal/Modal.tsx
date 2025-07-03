"use client";
import React from "react";

interface ModalProps {
	onClose: () => void;
	children: React.ReactNode;
}

export const Modal = ({ onClose, children }: ModalProps) => {
	const modalId = "modal-overlay";

	const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if ((event.target as HTMLDivElement).id === modalId) {
			onClose();
		}
	};

	return (
		<div
			id={modalId}
			className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-80"
			onClick={handleOutsideClick}
		>
			<div className="relative max-h-screen w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6">
				<button
					className="absolute right-4 top-4 font-bold text-gray-600 hover:text-gray-900"
					onClick={onClose}
				>
					Close
				</button>
				{children}
			</div>
		</div>
	);
};
