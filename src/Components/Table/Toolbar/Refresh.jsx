import tableStyles from "../Table.module.css";
import { RotateCcw } from 'lucide-react';

const styles = { ...tableStyles, ...(typeof localStyles !== "undefined" ? localStyles : {}) };

const Refresh = ({ onRefresh, localeText = {} }) => {
  return (
    <button className={styles["ct-btn"]} onClick={onRefresh} title={localeText.refresh || "Reset all filters, sort, and search"}>
      <RotateCcw size={16} />
    </button>
  );
};

export default Refresh;
