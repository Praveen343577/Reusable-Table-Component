// src/Components/common/Table.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Search, ArrowUp, ArrowDown, ArrowUpDown, Download, Columns, Filter } from "lucide-react";
import "./Table.css";

const Table = ({
  data = [],
  columns = [],
  tabs = [],
  defaultTab = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(defaultTab || (tabs[0]?.label || ""));
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const [hiddenColumns, setHiddenColumns] = useState([]);
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
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const processedData = useMemo(() => {
    let result = [...data];

    if (activeTab && activeTab !== "ALL") {
      result = result.filter((row) => row.status === activeTab);
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((val) => String(val).toLowerCase().includes(lowerQuery))
      );
    }

    if (sortConfig.key) {
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
  }, [data, activeTab, searchQuery, sortConfig]);

  const totalEntries = processedData.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = processedData.slice(startIndex, startIndex + rowsPerPage);

  const toggleSelectAll = (e) => setSelectedIds(e.target.checked ? currentData.map((r) => r.id) : []);
  const toggleSelectRow = (id) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  const toggleColumn = (key) => setHiddenColumns((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  
  const visibleCols = columns.filter((col) => !hiddenColumns.includes(col.key));

  return (
    <div className="ct-container">
      <div className="ct-toolbar">
        {tabs.length > 0 && (
          <div className="ct-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                className={`ct-tab ${activeTab === tab.label ? "active" : ""}`}
                onClick={() => { setActiveTab(tab.label); setCurrentPage(1); }}
              >
                {tab.label} {tab.count !== undefined && <span className="ct-tab-badge">{tab.count}</span>}
              </button>
            ))}
          </div>
        )}

        <div className="ct-toolbar-actions">
          <div className="ct-search-wrapper">
            <Search size={16} className="ct-search-icon" />
            <input
              type="text"
              placeholder="Search"
              className="ct-search-input"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <button className="ct-btn"><Filter size={16} /></button>

          <div style={{ position: "relative" }} ref={colMenuRef}>
            <button className="ct-btn" onClick={() => setShowColumnMenu(!showColumnMenu)}>
              <Columns size={16} /> Columns
            </button>
            {showColumnMenu && (
              <div className="ct-dropdown-menu">
                {columns.map((col) => (
                  <label key={col.key} className="ct-dropdown-item">
                    <input type="checkbox" className="ct-checkbox" checked={!hiddenColumns.includes(col.key)} onChange={() => toggleColumn(col.key)} />
                    {col.header}
                  </label>
                ))}
              </div>
            )}
          </div>

          <button className="ct-btn"><Download size={16} /> Export</button>
        </div>
      </div>

      <div className="ct-table-wrapper">
        <table className="ct-table">
          <thead>
            <tr>
              <th style={{ width: "48px" }}>
                <input
                  type="checkbox"
                  className="ct-checkbox"
                  checked={selectedIds.length === currentData.length && currentData.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              {visibleCols.map((col) => (
                <th key={col.key} className="ct-th-sortable" onClick={() => handleSort(col.key)} style={{ width: col.width }}>
                  <div className="ct-th-content">
                    {col.header}
                    <div className="ct-sort-icons">
                      {sortConfig.key === col.key ? (
                        sortConfig.direction === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      ) : (
                        <ArrowUpDown size={14} style={{ opacity: 0.3 }} />
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr><td colSpan={visibleCols.length + 1} style={{ textAlign: "center", padding: "40px" }}>No records found.</td></tr>
            ) : (
              currentData.map((row) => (
                <tr key={row.id}>
                  <td>
                    <input
                      type="checkbox"
                      className="ct-checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => toggleSelectRow(row.id)}
                    />
                  </td>
                  {visibleCols.map((col) => (
                    <td key={`${row.id}-${col.key}`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="ct-footer">
        <div className="ct-showing-text">
          Showing {totalEntries === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + rowsPerPage, totalEntries)} of {totalEntries} page
          <select 
            className="ct-rows-select" 
            value={rowsPerPage} 
            onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
          >
            <option value={10}>10 rows</option>
            <option value={25}>25 rows</option>
            <option value={50}>50 rows</option>
          </select>
        </div>

        <div className="ct-pagination-controls">
          <button className="ct-page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>
            Previous
          </button>
          
          {Array.from({ length: Math.min(totalPages, 3) }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button key={pageNum} className={`ct-page-btn ${currentPage === pageNum ? "active" : ""}`} onClick={() => setCurrentPage(pageNum)}>
                {pageNum}
              </button>
            );
          })}
          
          <button className="ct-page-btn" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => prev + 1)}>
            Next
          </button>

          <div className="ct-go-to">
            Go to page <input type="text" />
          </div>
        </div>
      </div>
    </div>
  );
};

Table.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array.isRequired,
  tabs: PropTypes.array,
  defaultTab: PropTypes.string,
};

export default Table;