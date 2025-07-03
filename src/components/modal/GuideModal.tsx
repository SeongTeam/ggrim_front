"use client";

interface GuideModalProps {
	message: string;
	onClickNext: () => void;
}

export const GuideModal = ({ message, onClickNext }: GuideModalProps) => {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="w-full max-w-sm rounded bg-white p-6 text-black shadow-xl">
				<p className="mb-4">{message}</p>
				<button onClick={onClickNext} className="rounded bg-green-600 px-4 py-2 text-white">
					Next
				</button>
			</div>
		</div>
	);
};
