import { useState, useRef, useEffect, useMemo } from 'react';
import { Filter as FilterIcon, ChevronRight } from 'lucide-react';
import './Filter.css';

const Filter = ({ columns, data, filters, onFilterChange, filterConfig = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedColumn, setExpandedColumn] = useState(null);
  const [filterSearch, setFilterSearch] = useState('');
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsOpen(false);
        setExpandedColumn(null);
        setFilterSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get unique values for each exact-type column from the data
  const columnValues = useMemo(() => {
    const values = {};
    columns.forEach((col) => {
      const config = filterConfig[col.key];
      // Skip range-type columns — they use config.ranges instead
      if (config?.type === 'range') return;
      const uniqueVals = [...new Set(data.map((row) => String(row[col.key])))].filter(Boolean).sort();
      values[col.key] = uniqueVals;
    });
    return values;
  }, [columns, data, filterConfig]);

  const activeFilterCount = Object.keys(filters).length;

  const toggleValue = (columnKey, value) => {
    const currentValues = filters[columnKey] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    onFilterChange(columnKey, newValues);
  };

  const clearColumnFilter = (columnKey, e) => {
    e.stopPropagation();
    onFilterChange(columnKey, []);
  };

  const clearAllFilters = () => {
    Object.keys(filters).forEach((key) => onFilterChange(key, []));
  };

  // Get display options for a column (range labels or filtered exact values)
  const getDisplayOptions = (col) => {
    const config = filterConfig[col.key];
    if (config?.type === 'range' && config.ranges) {
      const labels = config.ranges.map((r) => r.label);
      if (!filterSearch.trim()) return labels;
      const lower = filterSearch.toLowerCase();
      return labels.filter((l) => l.toLowerCase().includes(lower));
    }
    const values = columnValues[col.key] || [];
    if (!filterSearch.trim()) return values;
    const lower = filterSearch.toLowerCase();
    return values.filter((v) => v.toLowerCase().includes(lower));
  };

  // Check if search is enabled for a column
  const isSearchable = (colKey) => {
    const config = filterConfig[colKey];
    if (!config || config.searchable === undefined) return true; // default true
    return config.searchable;
  };

  return (
    <div style={{ position: 'relative' }} ref={filterRef}>
      <button className="ct-btn" onClick={() => setIsOpen(!isOpen)}>
        <FilterIcon size={16} />
        Filter
        {activeFilterCount > 0 && (
          <span className="ct-filter-badge">{activeFilterCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="ct-glass-dropdown ct-filter-dropdown">
          <div className="ct-filter-header">
            <span className="ct-filter-title">Filters</span>
            {activeFilterCount > 0 && (
              <button className="ct-filter-clear-all" onClick={clearAllFilters}>
                Clear all
              </button>
            )}
          </div>

          <div className="ct-filter-columns">
            {columns.map((col) => {
              const isExpanded = expandedColumn === col.key;
              const selectedValues = filters[col.key] || [];
              const displayOptions = getDisplayOptions(col);
              const searchable = isSearchable(col.key);

              return (
                <div key={col.key} className="ct-filter-column">
                  <div
                    className={`ct-filter-column-header ${isExpanded ? 'expanded' : ''} ${selectedValues.length > 0 ? 'has-filter' : ''}`}
                    onClick={() => {
                      setExpandedColumn(isExpanded ? null : col.key);
                      setFilterSearch('');
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <span>{col.header}</span>
                    <div className="ct-filter-column-meta">
                      {selectedValues.length > 0 && (
                        <>
                          <span className="ct-filter-count">{selectedValues.length}</span>
                          <div
                            className="ct-filter-clear-col-btn"
                            onClick={(e) => clearColumnFilter(col.key, e)}
                            title="Clear filter"
                            role="button"
                            tabIndex={0}
                          >
                            ×
                          </div>
                        </>
                      )}
                      <ChevronRight size={14} className={`ct-filter-chevron ${isExpanded ? 'active' : ''}`} />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="ct-filter-values">
                      {searchable && (
                        <input
                          type="text"
                          className="ct-filter-search-input"
                          placeholder={`Search ${col.header}...`}
                          value={filterSearch}
                          onChange={(e) => setFilterSearch(e.target.value)}
                          autoFocus
                        />
                      )}
                      <div className="ct-filter-values-list">
                        {displayOptions.length === 0 ? (
                          <div className="ct-filter-no-results">No matches</div>
                        ) : (
                          displayOptions.map((val) => (
                            <label key={val} className="ct-glass-dropdown-item ct-filter-value-item">
                              <input
                                type="checkbox"
                                className="ct-checkbox"
                                checked={selectedValues.includes(val)}
                                onChange={() => toggleValue(col.key, val)}
                              />
                              <span className="ct-filter-value-label">{val}</span>
                            </label>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;

