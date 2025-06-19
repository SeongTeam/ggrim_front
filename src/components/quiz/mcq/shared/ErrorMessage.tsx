// displays error messages in mcq components

import * as Icons from '@/components/ui/icons';
import React from 'react';

interface ErrorMessageProps {
	message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
	<div role="alert" className="alert alert-error mb-4">
		<Icons.CircleX />
		<span>{message}</span>
	</div>
);

export default ErrorMessage;
