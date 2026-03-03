'use client';

import { useLocalObservable } from 'mobx-react-lite';
import React, { createContext, useContext } from 'react';

import type { CandidateFilterState } from '@candidatesStore/CandidateFilterStore';
import { CandidateFilterStore } from '@candidatesStore/CandidateFilterStore';

type FilterProviderProps = {
  children: React.ReactNode;
  initialState: CandidateFilterState;
};

const FilterStoreContext = createContext<CandidateFilterStore | undefined>(undefined);

export function FilterProvider({ children, initialState }: FilterProviderProps) {
  const store = useLocalObservable(() => new CandidateFilterStore(initialState));
  return <FilterStoreContext.Provider value={store}>{children}</FilterStoreContext.Provider>;
}
export const useFilters = (): CandidateFilterStore => {
  const context = useContext(FilterStoreContext);

  if (!context) {
    throw new Error('useFilters must be used within FilterProvider');
  }

  return context;
};
