import { useState, useRef, useEffect } from "react";

type DropdownMenuOption<T> = {
  label: string;
  value: T;
};

interface DropdownMenuProps<T> {
  label: string;
  options: DropdownMenuOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
  required?: boolean;
}


export const  DropdownMenu = <T,>({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  required = false,
}: DropdownMenuProps<T>)  => {
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
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="relative w-full mb-4" ref={menuRef}>
      <label className="block text-gray-600 mb-2">{label}</label>

      <input
        type="text"
        value={
          value ? options.find((option) => option.value === value)?.label : ""
        }
        onClick={toggleMenu}
        placeholder={placeholder}
        readOnly
        className="w-full text-blue-300 border border-gray-300 rounded-lg p-2 cursor-pointer"
        required={required}
      />
      {isOpen && (
        <ul className="absolute left-0 mt-2 w-full text-gray-700 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(option.value)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
