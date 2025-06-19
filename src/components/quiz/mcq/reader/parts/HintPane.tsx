// frontend for AI generated hint

import React, { useEffect, useState, useCallback } from 'react';
import * as Icons from '@/components/ui/icons';

interface HintPaneProps {
	mcqId: string;
	show: boolean;
	onClose: () => void;
	question: string;
	attemptedAnswers: string[];
	remainingAnswers: string[];
}

const HintPane: React.FC<HintPaneProps> = ({
	show,
	onClose,
	question,
	attemptedAnswers,
	remainingAnswers,
}) => {
	const [hint, setHint] = useState<string>('');
	const [loading, setLoading] = useState(true);
	const [isVisible, setIsVisible] = useState(false);
	const [hasLoadedHint, setHasLoadedHint] = useState(false);

	const fetchHint = useCallback(async () => {
		setLoading(true);
		try {
			const response = await fetch('/api/mcq/hint', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					question,
					attemptedAnswers,
					remainingAnswers,
				}),
			});
			const data = await response.json();
			if (data && data.hint) {
				setHint(data.hint);
				setHasLoadedHint(true);
			}
		} catch (error) {
			console.error('Error fetching hint:', error);
		} finally {
			setLoading(false);
		}
	}, [question, attemptedAnswers, remainingAnswers]);

	useEffect(() => {
		if (show && !hasLoadedHint) {
			setIsVisible(true);
			fetchHint();
		} else if (show) {
			setIsVisible(true);
		}
	}, [show, hasLoadedHint, fetchHint]);

	const handleClose = () => {
		setIsVisible(false);
		onClose();
	};

	if (!show) return null;

	return (
		<div
			className={`border-secondary bg-base-100 fixed right-3 top-16 z-50 flex h-auto max-h-[50vh] w-1/4 flex-col rounded-md border-2 border-dashed p-4 shadow-lg transition-opacity duration-300 ease-in-out ${
				isVisible ? 'opacity-100' : 'opacity-0'
			}`}
			role="dialog"
			aria-modal="true"
			aria-labelledby="hint-pane-title"
		>
			<div className="flex items-start justify-between">
				<h2 className="text-lg font-bold">Smart Hint</h2>
				<div className="flex space-x-2">
					<button onClick={handleClose} className="text-gray-600 hover:text-gray-800">
						<Icons.X className="h-6 w-6" />
					</button>
				</div>
			</div>
			<h3 className="mb-5 text-sm font-semibold text-gray-600">{question}</h3>
			<div className="flex-grow overflow-y-auto">
				{loading ? (
					<div className="skeleton mb-4 h-20 w-full"></div>
				) : (
					<p className="text-gray-700">{hint}</p>
				)}
			</div>
		</div>
	);
};

export default HintPane;
