'use client';
import React from 'react';

interface ModalProps {
	onClose: () => void;
	children: React.ReactNode;
}

export const Modal = ({ onClose, children }: ModalProps) => {
	const modalId = 'modal-overlay';

	const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if ((event.target as HTMLDivElement).id === modalId) {
			onClose();
		}
	};

	return (
		<div
			id={modalId}
			className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 overflow-y-auto"
			onClick={handleOutsideClick}
		>
			<div className="relative bg-white rounded-lg p-6 max-w-3xl w-full max-h-screen overflow-y-auto">
				<button
					className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-bold"
					onClick={onClose}
				>
					Close
				</button>
				{children}
			</div>
		</div>
	);
};
