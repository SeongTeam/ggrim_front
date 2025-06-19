import { useState, useRef, useEffect } from 'react';

type DropdownMenuOption<T> = {
	label: string;
	value: T;
};

interface DropdownMenuProps<T> {
	label: string;
	options: DropdownMenuOption<T>[];
	value?: T;
	onChange: (value: T) => void;
	placeholder?: string;
	required?: boolean;
}

export const DropdownMenu = <T,>({
	label,
	options,
	value,
	onChange,
	placeholder = 'Select an option',
	required = false,
}: DropdownMenuProps<T>) => {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const toggleMenu = () => setIsOpen(!isOpen);

	const handleOptionClick = (value: T) => {
		onChange(value);
		setIsOpen(false);
	};

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleOutsideClick);
		return () => document.removeEventListener('mousedown', handleOutsideClick);
	}, []);

	return (
		<div className="relative mb-4 w-full" ref={menuRef}>
			<label className="mb-2 block text-gray-600">{label}</label>

			<input
				type="text"
				value={value ? options.find((option) => option.value === value)?.label : ''}
				onClick={toggleMenu}
				placeholder={placeholder}
				readOnly
				className="w-full cursor-pointer rounded-lg border border-gray-300 p-2 text-blue-300"
				required={required}
			/>
			{isOpen && (
				<ul className="absolute left-0 z-10 mt-2 w-full rounded-lg border border-gray-300 bg-white text-gray-700 shadow-lg">
					{options.map((option, index) => (
						<li
							key={index}
							onClick={() => handleOptionClick(option.value)}
							className="cursor-pointer px-4 py-2 hover:bg-gray-100"
						>
							{option.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
