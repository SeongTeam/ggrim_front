interface AutocompleteListProps {
    suggestions: string[];
    onSelect: (value: string) => void;
    query : string;
    highlightedIndex : number,
    setHighlightedIndex : (index : number) => void;
  }
  
  export function AutocompleteList({
    suggestions,
    onSelect,
    query,
    highlightedIndex,
    setHighlightedIndex ,
  }: AutocompleteListProps) {
    if (suggestions.length === 0) return null;
  
    const highlightMatch = (text: string, query: string) => {
      const i = text.toLowerCase().indexOf(query.toLowerCase());
      if (i === -1) return text;
      return (
        <>
          {text.slice(0, i)}
          <span className="font-semibold text-red-400">{text.slice(i, i + query.length)}</span>
          {text.slice(i + query.length)}
        </>
      );
    };
  
    return (
      <ul
        className={`absolute z-10 w-full mt-1 bg-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto `}
      >
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            onClick={() => onSelect(suggestion)}
            onMouseEnter={() => setHighlightedIndex(index)}
            className={`px-4 py-2 cursor-pointer text-white ${
              index === highlightedIndex ? 'bg-gray-600' : 'hover:bg-gray-600'
            }`}
          >
            {highlightMatch(suggestion,query)}
          </li>
        ))}
      </ul>
    );
  }
  