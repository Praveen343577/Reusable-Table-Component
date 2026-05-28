import { useState, useRef, useEffect } from 'react';
import { Columns } from 'lucide-react';

const ColumnToggle = ({ columns, hiddenColumns, onToggleColumn }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <button className="ct-btn" onClick={() => setShowMenu(!showMenu)} title="Columns">
        <Columns size={16} /> <span className="ct-btn-text">Columns</span>
      </button>
      {showMenu && (
        <div className="ct-glass-dropdown">
          {columns.map((col) => (
            <label key={col.key} className="ct-glass-dropdown-item">
              <input
                type="checkbox"
                className="ct-checkbox"
                checked={!hiddenColumns.includes(col.key)}
                onChange={() => onToggleColumn(col.key)}
              />
              {col.header}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColumnToggle;
