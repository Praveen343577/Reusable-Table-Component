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
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || (tabs[0]?.label || ''));
  const [hiddenColumns, setHiddenColumns] = useState([]);

  const { searchQuery, setSearchQuery, filterBySearch, resetSearch } = useSearch();
  const { sortConfig, handleSort, sortData, resetSort } = useSort();
  const { filters, setColumnFilter, filterData, resetFilters } = useFilter();
  const { selectedIds, toggleSelectAll, toggleSelectRow, resetSelection } = useSelection();

  // Tab filter
  const tabFilteredData = useMemo(() => {
    if (!activeTab || activeTab === 'ALL' || activeTab === 'All') return data;
    return data.filter((row) => row.status === activeTab);
  }, [data, activeTab]);

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

  const currentData = paginateData(processedData);
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

  return (
    <div className="ct-container">
      <Toolbar tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange}>
        <Search value={searchQuery} onChange={handleSearchChange} />
        <Filter
          columns={columns}
          data={tabFilteredData}
          filters={filters}
          onFilterChange={setColumnFilter}
        />
        <ColumnToggle
          columns={columns}
          hiddenColumns={hiddenColumns}
          onToggleColumn={toggleColumn}
        />
        <Export onExport={() => {}} />
        <Refresh onRefresh={handleRefresh} />
      </Toolbar>

      <div className="ct-table-wrapper">
        <table className="ct-table">
          <Header
            visibleCols={visibleCols}
            sortConfig={sortConfig}
            onSort={handleSort}
            allSelected={allSelected}
            onToggleSelectAll={() => toggleSelectAll(currentData)}
          />
          <Body
            currentData={currentData}
            prevData={prevData}
            visibleCols={visibleCols}
            selectedIds={selectedIds}
            onToggleSelectRow={toggleSelectRow}
          />
        </table>
      </div>

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
