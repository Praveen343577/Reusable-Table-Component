import { useState, useCallback } from 'react';

const useFilter = () => {
  const [filters, setFilters] = useState({});

  const setColumnFilter = useCallback((columnKey, values) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (!values || values.length === 0) {
        delete next[columnKey];
      } else {
        next[columnKey] = values;
      }
      return next;
    });
  }, []);

  const filterData = useCallback((data) => {
    const activeFilters = Object.entries(filters);
    if (activeFilters.length === 0) return data;
    return data.filter((row) =>
      activeFilters.every(([key, values]) =>
        values.includes(String(row[key]))
      )
    );
  }, [filters]);

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  const activeFilterCount = Object.keys(filters).length;

  return { filters, setColumnFilter, filterData, resetFilters, activeFilterCount };
};

export default useFilter;
