import tableStyles from "../Table.module.css";
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import localStyles from "./Header.module.css";

const styles = { ...tableStyles, ...(typeof localStyles !== "undefined" ? localStyles : {}) };

const Header = ({ visibleCols, sortConfig, onSort, allSelected, onToggleSelectAll, showRowSelection = true }) => {
  return (
    <thead style={{ display: 'block', width: '100%' }}>
      <tr style={{ display: 'flex', width: '100%' }}>
        {showRowSelection && (
          <th style={{ width: '3rem', flexShrink: 0 }}>
            <input
              type="checkbox"
              className={styles["ct-checkbox"]}
              checked={allSelected}
              onChange={onToggleSelectAll}
            />
          </th>
        )}
        {visibleCols.map((col) => (
          <th key={col.key} className={styles["ct-th-sortable"]} onClick={() => onSort(col.key)} style={{ width: col.width || 'auto', flex: col.width ? '0 0 auto' : '1 1 0px' }}>
            <div className={styles["ct-th-content"]}>
              {col.header}
              <div className={`${styles["ct-sort-icons"]} ${sortConfig.key === col.key ? styles['active'] : ''}`}>
                {sortConfig.key === col.key ? (
                  sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                ) : (
                  <ArrowUpDown size={14} style={{ opacity: 0.5 }} />
                )}
              </div>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default Header;

