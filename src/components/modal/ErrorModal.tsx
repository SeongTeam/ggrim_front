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
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="w-full max-w-sm rounded bg-white p-6 text-black shadow-xl">
				<p className="mb-4">{message}</p>
				<button onClick={onClose} className="rounded bg-red-600 px-4 py-2 text-white">
					Close
				</button>
			</div>
		</div>
	);
};
