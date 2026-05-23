import { Search as SearchIcon } from 'lucide-react';
import './Search.css';

const Search = ({ value, onChange }) => {
  return (
    <div className="ct-search-wrapper">
      <SearchIcon size={16} className="ct-search-icon" />
      <input
        type="text"
        placeholder="Search"
        className="ct-search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default Search;
