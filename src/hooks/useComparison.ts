import { useState, useCallback } from 'react';

export function useComparison() {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);

  const addCompany = useCallback((slug: string) => {
    setSelectedSlugs(prev => {
      if (prev.includes(slug)) return prev;
      if (prev.length >= 3) {
        // Replace the last selected company if max limit reached
        return [...prev.slice(0, 2), slug];
      }
      return [...prev, slug];
    });
  }, []);

  const removeCompany = useCallback((slug: string) => {
    setSelectedSlugs(prev => prev.filter(s => s !== slug));
  }, []);

  const clearComparison = useCallback(() => {
    setSelectedSlugs([]);
  }, []);

  return {
    selectedSlugs,
    addCompany,
    removeCompany,
    clearComparison,
    setSelectedSlugs
  };
}
