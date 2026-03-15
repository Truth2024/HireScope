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
    this.updateURL();
  }

  setPage(page: number) {
    this.page = page;
    this.updateURL();
  }

  setSort(sortBy: SortBy, order: SortOrder) {
    this.sortBy = sortBy;
    this.order = order;
    this.page = 1;
    this.updateURL();
  }

  toggleExperience() {
    this.hasExperience = !this.hasExperience;
    this.page = 1;
    this.updateURL();
  }

  private updateURL = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();

      if (this.page > 1) {
        params.set('page', this.page.toString());
      }

      if (this.search) {
        params.set('search', this.search);
      }

      if (this.hasExperience) {
        params.set('hasExperience', 'true');
      }

      if (this.sortBy !== 'matchScore') {
        params.set('sortBy', this.sortBy);
      }

      if (this.order !== 'desc') {
        params.set('order', this.order);
      }

      const url = params.toString() ? `?${params.toString()}` : window.location.pathname;
      window.history.pushState(null, '', url);
    }
  };

  resetFilters = () => {
    this.search = '';
    this.hasExperience = false;
    this.sortBy = 'matchScore';
    this.order = 'desc';
    this.page = 1;
    this.updateURL();
  };
}
