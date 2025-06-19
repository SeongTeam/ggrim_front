'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HTTP_STATUS } from '../../server-action/backend/common/status';
import { HttpException, ServerActionError } from '../../server-action/backend/common/dto';
import { isHttpException, isServerActionError } from '../../server-action/backend/common/util';
import toast from 'react-hot-toast';

export interface PasswordUpdateFormProps {
	formAction: (password: string) => Promise<boolean | HttpException | ServerActionError>;
	NextRoute: string;
}

export const PasswordUpdateForm = ({ formAction, NextRoute }: PasswordUpdateFormProps) => {
	const [password, setPassword] = useState('');
	const [passwordRepeat, setPasswordRepeat] = useState('');
	const router = useRouter();

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();

		if (password.trim() !== passwordRepeat.trim()) {
			toast.error('password is not matched');
			return;
		}

		const response = await formAction(password);

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
		} else if (response == true) {
			toast.success('success');
			router.push(NextRoute);
		} else {
			toast.error('invalid page');
		}
	};

	return (
		<div>
			<form onSubmit={handleSignIn} className="flex flex-col gap-4">
				<input
					type="password"
					placeholder="Password"
					className="p-3 rounded bg-gray-800 text-white placeholder-gray-400"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<input
					type="password"
					placeholder="Repeat Password"
					className="p-3 rounded bg-gray-800 text-white placeholder-gray-400"
					value={passwordRepeat}
					onChange={(e) => setPasswordRepeat(e.target.value)}
					required
				/>
				<button
					type="submit"
					className="bg-red-600 hover:bg-red-700 transition p-3 rounded font-semibold"
				>
					Update password
				</button>
			</form>
		</div>
	);
};
