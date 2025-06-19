import React from 'react';

interface CustomInputProps {
	label: string;
	type?: 'text' | 'textarea';
	value: string | number;
	onChange: (value: string) => void;
	placeholder?: string;
	required?: boolean;
}

export const CustomInput = ({
	label,
	type = 'text',
	value,
	onChange,
	placeholder = '',
	required = false,
}: CustomInputProps) => {
	const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
		onChange(e.target.value);
	};

	return (
		<div className="mb-4">
			<label className="mb-2 block text-gray-600">{label}</label>
			{type === 'textarea' ? (
				<textarea
					value={value}
					onChange={handleChange}
					placeholder={placeholder}
					className="h-32 w-full rounded-lg border border-gray-300 p-2 text-gray-700"
					required={required}
				/>
			) : (
				<input
					type={type}
					value={value}
					onChange={handleChange}
					placeholder={placeholder}
					className="w-full rounded-lg border border-gray-300 p-2 text-gray-700"
					required={required}
				/>
			)}
		</div>
	);
};
