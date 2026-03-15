import { makeAutoObservable } from 'mobx';

export type SortBy = 'matchScore' | 'appliedAt';
export type SortOrder = 'asc' | 'desc';

export class CandidatesStore {
  page = 1;
  search = '';
  hasExperience = false;
  sortBy: SortBy = 'matchScore';
  order: SortOrder = 'desc';

  constructor(initialState?: Partial<CandidatesStore>) {
    Object.assign(this, initialState);
    makeAutoObservable(this);
  }

  setSearch(value: string) {
    this.search = value;
    this.page = 1;
  }

  setPage(page: number) {
    this.page = page;
  }

  setSort(sortBy: SortBy, order: SortOrder) {
    this.sortBy = sortBy;
    this.order = order;
    this.page = 1;
  }

  toggleExperience() {
    this.hasExperience = !this.hasExperience;
    this.page = 1;
  }
}
