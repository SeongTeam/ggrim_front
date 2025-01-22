import React from 'react';

interface CustomInputProps {
    label: string;
    type?: 'text' | 'textarea';
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
}

export default function CustomInput({
    label,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    required = false,
}: CustomInputProps) {
    const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        onChange(e.target.value);
    };

    return (
        <div className="mb-4">
            <label className="block text-gray-600 mb-2">{label}</label>
            {type === 'textarea' ? (
                <textarea
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full border border-gray-300  text-gray-700 rounded-lg p-2 h-32"
                    required={required}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full border border-gray-300   text-gray-700 rounded-lg p-2"
                    required={required}
                />
            )}
        </div>
    );
}
