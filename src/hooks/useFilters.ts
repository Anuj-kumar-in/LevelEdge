import { useState, useCallback } from 'react';
import type { FilterState } from '../types/filters';
import { initialFilterState } from '../types/filters';

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const setFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => {
      // If we change filter parameters, we should reset page to 1
      const update: Partial<FilterState> = { [key]: value };
      if (key !== 'page') {
        update.page = 1;
      }
      return { ...prev, ...update };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilterState);
  }, []);

  const nextPage = useCallback(() => {
    setFilters(prev => ({ ...prev, page: prev.page + 1 }));
  }, []);

  const prevPage = useCallback(() => {
    setFilters(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }));
  }, []);

  return {
    filters,
    setFilter,
    resetFilters,
    nextPage,
    prevPage,
    setFilters
  };
}
