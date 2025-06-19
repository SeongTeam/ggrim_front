'use client';

import { useEffect } from 'react';

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
			<div className="text-center max-w-md">
				<h2 className="text-4xl font-bold mb-4">Something went wrong</h2>
				<p className="text-lg mb-6 text-gray-400">{error.message}</p>
				<p className="text-lg mb-6 text-gray-400">please retry.</p>
				<button
					onClick={() => reset()}
					className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded transition duration-300"
				>
					Retry
				</button>
			</div>
		</div>
	);
}
