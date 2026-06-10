import tableStyles from "../Table.module.css";
import { Search as SearchIcon } from 'lucide-react';
import localStyles from "./Search.module.css";

const styles = { ...tableStyles, ...(typeof localStyles !== "undefined" ? localStyles : {}) };

const Search = ({ value, onChange, localeText = {} }) => {
  return (
    <div className={styles["ct-search-wrapper"]}>
      <SearchIcon size={16} className={styles["ct-search-icon"]} />
      <input
        type="text"
        placeholder={localeText.searchPlaceholder || "Search..."}
        className={styles["ct-search-input"]}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default Search;
