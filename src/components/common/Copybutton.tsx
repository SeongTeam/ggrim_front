import { Clipboard, ClipboardCheck } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface CopyButtonProps {
	textToCopy: string;
	buttonLabel?: string;
	copiedLabel?: string;
	className?: string;
	timeout?: number;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
	textToCopy,
	className = '',
	timeout = 2000,
}) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(textToCopy);
			setCopied(true);
			toast.success('copy success');
			setTimeout(() => setCopied(false), timeout);
		} catch (error) {
			toast.error('Failed to copy');
			console.error(error);
		}
	};

	return (
		<button
			onClick={handleCopy}
			className={`flex items-center justify-center rounded-md bg-gray-600 px-2 py-1 text-white transition duration-150 ease-in-out hover:bg-gray-700 active:scale-95 ${className}`}
			style={{
				minWidth: '10px',
				touchAction: 'manipulation',
			}}
		>
			{copied ? (
				<ClipboardCheck className="text-inherit" />
			) : (
				<Clipboard className="text-inherit" />
			)}
		</button>
	);
};
