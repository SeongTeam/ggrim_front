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
		<div className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
			<div className="max-w-md text-center">
				<h2 className="mb-4 text-4xl font-bold">Something went wrong</h2>
				<p className="mb-6 text-lg text-gray-400">{error.message}</p>
				<p className="mb-6 text-lg text-gray-400">please retry.</p>
				<button
					onClick={() => reset()}
					className="rounded bg-red-600 px-6 py-2 font-semibold text-white transition duration-300 hover:bg-red-700"
				>
					Retry
				</button>
			</div>
		</div>
	);
}
