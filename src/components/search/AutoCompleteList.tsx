interface AutocompleteListProps {
	suggestions: string[];
	onSelect: (value: string) => void;
	query: string;
	highlightedIndex: number;
	setHighlightedIndex: (index: number) => void;
}

export const AutocompleteList = ({
	suggestions,
	onSelect,
	query,
	highlightedIndex,
	setHighlightedIndex,
}: AutocompleteListProps) => {
	if (suggestions.length === 0) return null;

	const highlightMatch = (text: string, query: string) => {
		const i = text.toLowerCase().indexOf(query.toLowerCase());
		if (i === -1) return text;
		return (
			<>
				{text.slice(0, i)}
				<span className="font-semibold text-red-400">
					{text.slice(i, i + query.length)}
				</span>
				{text.slice(i + query.length)}
			</>
		);
	};

	return (
		<ul
			className={`absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md bg-gray-700 shadow-lg`}
		>
			{suggestions.map((suggestion, index) => (
				<li
					key={index}
					onClick={() => onSelect(suggestion)}
					onMouseEnter={() => setHighlightedIndex(index)}
					className={`cursor-pointer px-4 py-2 text-white ${
						index === highlightedIndex ? "bg-gray-600" : "hover:bg-gray-600"
					}`}
				>
					{highlightMatch(suggestion, query)}
				</li>
			))}
		</ul>
	);
};
