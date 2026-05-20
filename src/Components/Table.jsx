import { useState, useMemo, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Search, ChevronUp, ChevronDown, Download, Columns, ChevronLeft, ChevronRight } from "lucide-react";
import DropdownSelect from "./DropdownSelect";
import "./Table.css";
import { useTranslation } from "react-i18next";

const Table = ({
  data = [],
  columns = [],
  enableSearch = true,
  enableTabs = false,
  tabs = [],
  defaultTab = "",
  enableFilters = false,
  filters = [],
  enableSorting = true,
  enableColumnToggle = true,
  enableExport = true,
  enablePagination = true,
  enableSelection = false,
  externalCurrentPage,
  onPageChange,
  totalEntries: totalEntriesProp,
  externalSearchQuery,
  onSearchChange,
  rowsPerPage: initialRowsPerPage = 100,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const { t } = useTranslation();

  const searchQuery = externalSearchQuery === undefined ? localSearchQuery : externalSearchQuery;
  const currentPage = externalCurrentPage === undefined ? localCurrentPage : externalCurrentPage;

  const getTabLabel = (tab) => typeof tab === "object" ? tab.label : tab;
  
  const initialTab = defaultTab || (tabs.length > 0 ? getTabLabel(tabs[0]) : "All");
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(defaultTab || (tabs.length > 0 ? getTabLabel(tabs[0]) : "All"));
  }, [defaultTab, tabs]);

  const handleSetCurrentPage = (page) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setLocalCurrentPage(page);
    }
  };

  const handleSearchChange = (value) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setLocalSearchQuery(value);
    }
    handleSetCurrentPage(1);
  };
  const [selectedIds, setSelectedIds] = useState([]);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [filterValues, setFilterValues] = useState({});
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const colMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colMenuRef.current && !colMenuRef.current.contains(event.target)) {
        setShowColumnMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (key) => {
    if (!enableSorting) return;
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleFilterChange = (filterKey, value) => {
    setFilterValues((prev) => ({ ...prev, [filterKey]: value }));
    handleSetCurrentPage(1);
  };

  const processedData = useMemo(() => {
    let result = [...data];

    // 1. Tab Filtering
    const isAllTab = activeTab === "All" || activeTab === defaultTab || activeTab === (tabs.length > 0 ? getTabLabel(tabs[0]) : "All");
    if (enableTabs && !isAllTab) {
      result = result.filter(
        (row) =>
          row.status === activeTab ||
          row.tabKey === activeTab ||
          row.availability_status === activeTab ||
          row.apiStatus === activeTab,
      );
    }

    // 2. Search Filtering
    if (enableSearch && searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((val) => String(val).toLowerCase().includes(lowerQuery))
      );
    }

    // 3. Dropdown Filtering
    if (enableFilters && Object.keys(filterValues).length > 0) {
      result = result.filter((row) => {
        return Object.entries(filterValues).every(([key, val]) => {
          if (!val || val === "All") return true;
          return String(row[key]) === String(val);
        });
      });
    }

    // 4. Sorting
    if (enableSorting && sortConfig.key) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key] || "";
        let bVal = b[sortConfig.key] || "";
        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, activeTab, searchQuery, filterValues, sortConfig, enableTabs, enableSearch, enableFilters, enableSorting, defaultTab, tabs]);

  const totalEntries = totalEntriesProp === undefined ? processedData.length : totalEntriesProp;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  // If server-side pagination is used, data is already sliced
  const currentData = enablePagination && !onPageChange ? processedData.slice(startIndex, startIndex + rowsPerPage) : processedData;

  const toggleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? currentData.map((r) => r.id) : []);
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleColumn = (key) => {
    setHiddenColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const visibleCols = columns.filter((col) => !hiddenColumns.includes(col.key));

  return (
    <div className="ct-container">
      <div className="ct-toolbar">
         {enableTabs && tabs.length > 0 && (
          <div className="ct-tabs">
            {tabs.map((tabObj) => {
              const tabLabel = typeof tabObj === "object" ? tabObj.label : tabObj;
              const tabCount = typeof tabObj === "object" ? tabObj.count : null;
              
              return (
                <button
                  key={tabLabel}
                  className={`ct-tab ${activeTab === tabLabel ? "active" : ""}`}
                  onClick={() => { setActiveTab(tabLabel); handleSetCurrentPage(1); }}
                >
                  {tabLabel}
                  {tabCount !== null && <span className="ct-tab-count">{tabCount}</span>}
                </button>
              );
            })}
          </div>
        )}

        <div className="ct-toolbar-actions">
          {enableSearch && (
            <div className="ct-search-wrapper">
              <Search size={14} className="ct-search-icon" />
              <input
                type="text"
                placeholder={t("table.search", "Search...")}
                className="ct-search-input"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          )}

          {enableFilters && filters.map((f) => (
            <div key={f.key} style={{ width: "120px" }}>
              <DropdownSelect
                options={f.options}
                value={filterValues[f.key] || ""}
                onChange={(val) => handleFilterChange(f.key, val)}
                placeholder={f.label}
              />
            </div>
          ))}

          {enableColumnToggle && (
            <div style={{ position: "relative" }} ref={colMenuRef}>
              <button className="ct-btn" onClick={() => setShowColumnMenu(!showColumnMenu)}>
                <Columns size={14} /> {t("table.columns", "Columns")}
              </button>
              {showColumnMenu && (
                <div className="ct-dropdown-menu">
                  {columns.map((col) => (
                    <label key={col.key} className="ct-dropdown-item">
                      <input
                        type="checkbox"
                        checked={!hiddenColumns.includes(col.key)}
                        onChange={() => toggleColumn(col.key)}
                      />
                      {col.header}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {enableExport && (
            <button className="ct-btn">
              <Download size={14} /> {t("table.export", "Export")}
            </button>
          )}
        </div>
      </div>

      <div className="ct-table-wrapper">
        <table className="ct-table">
          <thead>
            <tr style={{ backgroundColor: "#880808" }}>
              {enableSelection && (
                <th style={{ width: "48px" }}>
                  <input
                    type="checkbox"
                    className="ct-checkbox"
                    checked={selectedIds.length === currentData.length && currentData.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
              )}
              {visibleCols.map((col) => (
                <th
                  key={col.key}
                  className={enableSorting && col.sortable !== false ? "ct-th-sortable" : ""}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  style={{ width: col.width }}
                >
                  <div className="ct-th-content">
                    {col.header}
                    {enableSorting && col.sortable !== false && (
                      <div className="ct-sort-icons">
                        <ChevronUp className={sortConfig.key === col.key && sortConfig.direction === "asc" ? "active" : ""} />
                        <ChevronDown className={sortConfig.key === col.key && sortConfig.direction === "desc" ? "active" : ""} />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={visibleCols.length + (enableSelection ? 1 : 0)} style={{ textAlign: "center", padding: "32px" }}>
                  {t("table.noRecordsFound", "No records found.")}
                </td>
              </tr>
            ) : (
              currentData.map((row, index) => (
                <tr key={row.id ?? index}>
                  {enableSelection && (
                    <td>
                      <input
                        type="checkbox"
                        className="ct-checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={() => toggleSelectRow(row.id)}
                      />
                    </td>
                  )}
                  {visibleCols.map((col) => (
                    <td key={`${row.id ?? index}-${col.key}`} data-label={col.header}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {enablePagination && (
        <div className="ct-footer">
          <div className="ct-showing-text">
            {t("table.showing", "Showing")} <strong>{totalEntries === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + rowsPerPage, totalEntries)}</strong> {t("table.of", "of")} <strong>{totalEntries}</strong> {t("table.entries", "entries")}
          </div>

          <div className="ct-pagination-controls">
            <div className="ct-rows-per-page">
              {t("table.rowsPerPage", "Rows per page:")}
              <select className="ct-rows-select" value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); handleSetCurrentPage(1); }}>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="ct-pagination">
              <button className="ct-page-btn" style={{ display: "flex" }} disabled={currentPage === 1} onClick={() => handleSetCurrentPage(currentPage - 1)}>
                <ChevronLeft size={14} /> <span className="ct-page-nav-text">{t("table.previous", "Previous")}</span>
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                // Compact logic for many pages
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button key={pageNum} className={`ct-page-btn ${currentPage === pageNum ? "active" : ""}`} onClick={() => handleSetCurrentPage(pageNum)}>
                      {pageNum}
                    </button>
                  );
                } else if (
                  (pageNum === 2 && currentPage > 3) ||
                  (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return <span key={pageNum} style={{ color: "#9CA3AF", padding: "0 2px" }}>...</span>;
                }
                return null;
              })}

              <button className="ct-page-btn" style={{ display: "flex" }} disabled={currentPage === totalPages || totalPages === 0} onClick={() => handleSetCurrentPage(currentPage + 1)}>
                <span className="ct-page-nav-text">{t("table.next", "Next")}</span> <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Table.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      header: PropTypes.any,
      sortable: PropTypes.bool,
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      render: PropTypes.func,
    })
  ).isRequired,
  enableSearch: PropTypes.bool,
  enableTabs: PropTypes.bool,
  tabs: PropTypes.array,
  defaultTab: PropTypes.string,
  enableFilters: PropTypes.bool,
  filters: PropTypes.array,
  enableSorting: PropTypes.bool,
  enableColumnToggle: PropTypes.bool,
  enableExport: PropTypes.bool,
  enablePagination: PropTypes.bool,
  enableSelection: PropTypes.bool,
  externalCurrentPage: PropTypes.number,
  onPageChange: PropTypes.func,
  totalEntries: PropTypes.number,
  externalSearchQuery: PropTypes.string,
  onSearchChange: PropTypes.func,
  rowsPerPage: PropTypes.number,
};

export default Table;