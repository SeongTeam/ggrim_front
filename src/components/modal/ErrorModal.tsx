'use client';

import { useRouter } from 'next/navigation';

interface ErrorModalProps {
	message: string;
	onClose?: () => void;
}

export const ErrorModal = ({ message, onClose }: ErrorModalProps) => {
	const router = useRouter();

	if (!onClose) {
		onClose = () => router.push('/');
	}

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white text-black p-6 rounded shadow-xl max-w-sm w-full">
				<p className="mb-4">{message}</p>
				<button onClick={onClose} className="px-4 py-2 bg-red-600 text-white rounded">
					Close
				</button>
			</div>
		</div>
	);
};
