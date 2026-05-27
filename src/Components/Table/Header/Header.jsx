import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import './Header.css';

const Header = ({ visibleCols, sortConfig, onSort, allSelected, onToggleSelectAll, showRowSelection = true }) => {
  return (
    <thead>
      <tr>
        {showRowSelection && (
          <th style={{ width: '48px' }}>
            <input
              type="checkbox"
              className="ct-checkbox"
              checked={allSelected}
              onChange={onToggleSelectAll}
            />
          </th>
        )}
        {visibleCols.map((col) => (
          <th key={col.key} className="ct-th-sortable" onClick={() => onSort(col.key)} style={{ width: col.width }}>
            <div className="ct-th-content">
              {col.header}
              <div className={`ct-sort-icons ${sortConfig.key === col.key ? 'active' : ''}`}>
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

