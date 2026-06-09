import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import useSort from './hooks/useSort';
import useSearch from './hooks/useSearch';
import useFilter from './hooks/useFilter';
import usePagination from './hooks/usePagination';
import useSelection from './hooks/useSelection';

import Toolbar from './Toolbar/Toolbar';
import Search from './Toolbar/Search';
import Filter from './Toolbar/Filter';
import ColumnToggle from './Toolbar/ColumnToggle';
import Export from './Toolbar/Export';
import Refresh from './Toolbar/Refresh';
import Header from './Header/Header';
import Body from './Body/Body';
import Pagination from './Pagination/Pagination';

import './Table.css';

const Table = ({
  data = [],
  columns = [],
  tabs = [],
  defaultTab = '',
  prevData = null,
  showTabs = true,
  title = '',
  showSearch = true,
  showFilter = true,
  showColumnToggle = true,
  showExport = true,
  showRowSelection = true,
  showPagination = true,
  filterableColumns,
  filterConfig = {},
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || (tabs[0]?.label || ''));
  const [hiddenColumns, setHiddenColumns] = useState([]);

  // Dev-mode warnings for invalid filterableColumns keys
  if (process.env.NODE_ENV === 'development' && filterableColumns) {
    filterableColumns.forEach((key) => {
      if (!columns.find((c) => c.key === key)) {
        console.warn(`[Table] filterableColumns: "${key}" not found in columns`);
      }
    });
  }

  const { searchQuery, setSearchQuery, filterBySearch, resetSearch } = useSearch();
  const { sortConfig, handleSort, sortData, resetSort } = useSort();
  const { filters, setColumnFilter, filterData, resetFilters } = useFilter(filterConfig);
  const { selectedIds, toggleSelectAll, toggleSelectRow, resetSelection } = useSelection();

  // Compute filterable columns list
  const filterableCols = useMemo(() => {
    if (!filterableColumns || filterableColumns.length === 0) return columns;
    return columns.filter((col) => filterableColumns.includes(col.key));
  }, [columns, filterableColumns]);

  // Tab filter — skip when tabs are hidden
  const tabFilteredData = useMemo(() => {
    if (!showTabs) return data;
    if (!activeTab || activeTab === 'ALL' || activeTab === 'All') return data;
    return data.filter((row) => row.status === activeTab);
  }, [data, activeTab, showTabs]);

  // Pipeline: tab → search → column filter → sort
  const processedData = useMemo(() => {
    let result = tabFilteredData;
    result = filterBySearch(result);
    result = filterData(result);
    result = sortData(result);
    return result;
  }, [tabFilteredData, filterBySearch, filterData, sortData]);

  const {
    currentPage, setCurrentPage,
    rowsPerPage, setRowsPerPage,
    totalPages, startIndex,
    paginationItems,
    paginateData,
    resetPagination,
  } = usePagination(processedData.length);

  const currentData = showPagination ? paginateData(processedData) : processedData;
  const visibleCols = columns.filter((col) => !hiddenColumns.includes(col.key));

  const toggleColumn = (key) => {
    setHiddenColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleRefresh = () => {
    resetSearch();
    resetSort();
    resetFilters();
    resetSelection();
    resetPagination();
    setHiddenColumns([]);
    setActiveTab(defaultTab || (tabs[0]?.label || ''));
  };

  const handleTabChange = (label) => {
    setActiveTab(label);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const allSelected = currentData.length > 0 && currentData.every((row) => selectedIds.includes(row.id));

  const hasToolbarActions = showSearch || showFilter || showColumnToggle || showExport;

  return (
    <div className="ct-container">
      <Toolbar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        showTabs={showTabs}
        title={title}
      >
        {hasToolbarActions && (
          <>
            {showSearch && 
              <Search 
                value={searchQuery} 
                onChange={handleSearchChange} 
              />
            }
            {showFilter && (
              <Filter
                columns={filterableCols}
                data={tabFilteredData}
                filters={filters}
                onFilterChange={setColumnFilter}
                filterConfig={filterConfig}
              />
            )}
            {showColumnToggle && (
              <ColumnToggle
                columns={columns}
                hiddenColumns={hiddenColumns}
                onToggleColumn={toggleColumn}
              />
            )}
            {showExport && 
              <Export 
                data={processedData} 
                visibleCols={visibleCols} 
                title={title} 
              />
            }
            <Refresh onRefresh={handleRefresh} />
          </>
        )}
      </Toolbar>

      <div className="ct-table-wrapper">
        <table className="ct-table">
          <Header
            visibleCols={visibleCols}
            sortConfig={sortConfig}
            onSort={handleSort}
            allSelected={allSelected}
            onToggleSelectAll={() => toggleSelectAll(currentData)}
            showRowSelection={showRowSelection}
          />
          <Body
            currentData={currentData}
            prevData={prevData}
            visibleCols={visibleCols}
            selectedIds={selectedIds}
            onToggleSelectRow={toggleSelectRow}
            showRowSelection={showRowSelection}
          />
        </table>
      </div>

      {showPagination && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalPages={totalPages}
          startIndex={startIndex}
          totalEntries={processedData.length}
          paginationItems={paginationItems}
        />
      )}
    </div>
  );
};

Table.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array.isRequired,
  tabs: PropTypes.array,
  defaultTab: PropTypes.string,
  prevData: PropTypes.array,
  showTabs: PropTypes.bool,
  title: PropTypes.string,
  showSearch: PropTypes.bool,
  showFilter: PropTypes.bool,
  showColumnToggle: PropTypes.bool,
  showExport: PropTypes.bool,
  showRowSelection: PropTypes.bool,
  showPagination: PropTypes.bool,
  filterableColumns: PropTypes.arrayOf(PropTypes.string),
  filterConfig: PropTypes.object,
};

export default Table;

