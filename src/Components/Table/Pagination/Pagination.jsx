import { useState, useRef, useEffect } from 'react';
import { ChevronsLeft, ChevronsRight, ChevronDown } from 'lucide-react';
import './Pagination.css';

const ROWS_OPTIONS = [10, 25, 50];

const Pagination = ({
  currentPage, setCurrentPage,
  rowsPerPage, setRowsPerPage,
  totalPages, startIndex,
  totalEntries, paginationItems,
}) => {
  const [showRowsDropdown, setShowRowsDropdown] = useState(false);
  const rowsDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rowsDropdownRef.current && !rowsDropdownRef.current.contains(event.target)) {
        setShowRowsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="ct-footer">
      <div className="ct-showing-text">
        Showing {totalEntries === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + rowsPerPage, totalEntries)} of {totalEntries} page

        <div style={{ position: 'relative' }} ref={rowsDropdownRef}>
          <button
            className="ct-rows-trigger"
            onClick={() => setShowRowsDropdown(!showRowsDropdown)}
          >
            {rowsPerPage} rows
            <ChevronDown size={12} className={`ct-rows-chevron ${showRowsDropdown ? 'rotated' : ''}`} />
          </button>
          {showRowsDropdown && (
            <div className="ct-glass-dropdown ct-rows-dropdown">
              {ROWS_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  className={`ct-glass-dropdown-item ${rowsPerPage === opt ? 'active' : ''}`}
                  onClick={() => {
                    setRowsPerPage(opt);
                    setCurrentPage(1);
                    setShowRowsDropdown(false);
                  }}
                >
                  {opt} rows
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="ct-pagination-controls">
        <button className="ct-page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>
          Previous
        </button>

        {paginationItems.map((item, index) => {
          if (item === 'left') {
            return (
              <button key={`left-${index}`} className="ct-page-btn ct-ellipsis" onClick={() => setCurrentPage(Math.max(1, currentPage - 5))}>
                <ChevronsLeft size={16} />
              </button>
            );
          }
          if (item === 'right') {
            return (
              <button key={`right-${index}`} className="ct-page-btn ct-ellipsis" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 5))}>
                <ChevronsRight size={16} />
              </button>
            );
          }
          return (
            <button key={item} className={`ct-page-btn ${currentPage === item ? 'active' : ''}`} onClick={() => setCurrentPage(item)}>
              {item}
            </button>
          );
        })}

        <button className="ct-page-btn" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => prev + 1)}>
          Next
        </button>

        <div className="ct-go-to">
          Go to page <input
            type="number"
            min={1}
            max={totalPages}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const val = parseInt(e.target.value, 10);
                if (val >= 1 && val <= totalPages) setCurrentPage(val);
                e.target.value = '';
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
