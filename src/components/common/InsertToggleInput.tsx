import { Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface InsertToggleInputProps {
	handleAdd: (value: string) => Promise<boolean>;
	handleDelete: (value: string) => Promise<boolean>;
	placeholder?: string;
	defaultValue?: string;
	defaultIsInserted?: boolean;
}
export const InsertToggleInput = ({
	handleAdd,
	handleDelete,
	placeholder,
	defaultValue,
	defaultIsInserted,
}: InsertToggleInputProps): JSX.Element => {
	const [isInserted, setIsInserted] = useState(defaultIsInserted || false);
	const [value, setValue] = useState(defaultValue || '');

	const handleClickAdd = async () => {
		const isSuccess = await handleAdd(value);
		console.log(`[handleClickAdd]`, isSuccess);
		if (isSuccess) {
			setIsInserted(true);
		}
	};

	const handleClickDelete = async () => {
		const isSuccess = await handleDelete(value);
		console.log(`[handleClickDelete]`, isSuccess);
		if (isSuccess) {
			setIsInserted(false);
		}
	};

	useEffect(() => {
		setValue(defaultValue || '');
	}, [defaultValue]);

	useEffect(() => {
		setIsInserted(defaultIsInserted || false);
	}, [defaultIsInserted]);

	return (
		<div className="flex w-full items-center space-x-2 rounded-lg">
			<div className="w-full">
				<input
					type="text"
					placeholder={placeholder || 'input value'}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white transition disabled:bg-gray-400"
					disabled={isInserted}
					required
				/>
			</div>
			<button
				type="button"
				onClick={handleClickAdd}
				disabled={value.trim().length === 0 || isInserted}
				className="p-2 bg-blue-500 text-white rounded-full disabled:bg-gray-400 transition hover:bg-blue-600"
			>
				<Plus size={15} />
			</button>

			<button
				type="button"
				onClick={handleClickDelete}
				disabled={!isInserted}
				className="p-2 bg-red-500 text-white rounded-full disabled:bg-gray-400 transition hover:bg-red-600"
			>
				<Minus size={15} />
			</button>
		</div>
	);
};
