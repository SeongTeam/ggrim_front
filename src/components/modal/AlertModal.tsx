interface AlertModalProps {
	message: string;
	onClose: () => Promise<void>;
}

export const AlertModal = ({ message, onClose }: AlertModalProps) => {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
			<div className="w-80 rounded-lg bg-gray-900 p-6 text-white shadow-lg">
				<h3 className="text-lg font-bold text-red-600">⚠ Error Occur</h3>
				<p className="mt-2">{message}</p>
				<button
					onClick={onClose}
					className="mt-4 w-full rounded bg-red-600 py-2 text-white transition hover:bg-red-700"
				>
					Ok
				</button>
			</div>
		</div>
	);
};
