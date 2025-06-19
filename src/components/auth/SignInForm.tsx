'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HTTP_STATUS } from '../../server-action/backend/common/status';
import { HttpException, ServerActionError } from '../../server-action/backend/common/dto';
import { isHttpException, isServerActionError } from '../../server-action/backend/common/util';
import toast from 'react-hot-toast';

export interface SignInFormProps {
	formAction: (
		email: string,
		password: string,
	) => Promise<boolean | HttpException | ServerActionError>;
	NextRoute: string;
}

export const SignInForm = ({ formAction, NextRoute }: SignInFormProps) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();

		const response = await formAction(email, password);

		if (isServerActionError(response)) {
			throw new Error(response.message);
		} else if (isHttpException(response)) {
			const { statusCode } = response;
			const errorMessage = Array.isArray(response.message)
				? response.message.join('\n')
				: response.message;

			switch (statusCode) {
				case HTTP_STATUS.FORBIDDEN:
				case HTTP_STATUS.UNAUTHORIZED:
				case HTTP_STATUS.BAD_REQUEST:
					toast.error(errorMessage);
					break;
				default:
					throw new Error(`${response.statusCode}\n` + errorMessage);
			}
		} else if (response === true) {
			toast.success('success');
			router.push(NextRoute);
		} else {
			toast.error('invalid access');
		}
	};

	return (
		<div>
			<form onSubmit={handleSignIn} className="flex flex-col gap-4">
				<input
					type="email"
					placeholder="Email"
					className="p-3 rounded bg-gray-800 text-white placeholder-gray-400"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<input
					type="password"
					placeholder="Password"
					className="p-3 rounded bg-gray-800 text-white placeholder-gray-400"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<button
					type="submit"
					className="bg-red-600 hover:bg-red-700 transition p-3 rounded font-semibold"
				>
					Sign In
				</button>
			</form>
		</div>
	);
};
