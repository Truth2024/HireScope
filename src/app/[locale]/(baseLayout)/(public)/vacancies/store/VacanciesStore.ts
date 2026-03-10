import { makeAutoObservable } from 'mobx';

export type SortKey = 'newest' | 'oldest' | 'salary';

export type VacanciesFilterState = {
  page: number;
  search: string;
  skills: string[];
  sort: SortKey;
};

export class VacanciesStore {
  filters: VacanciesFilterState = {
    page: 1,
    search: '',
    skills: [],
    sort: 'newest',
  };

  constructor(initialState: Partial<VacanciesFilterState> = {}) {
    makeAutoObservable(this);
    this.filters = { ...this.filters, ...initialState };
  }

  updateFilters = (updates: Partial<VacanciesFilterState>) => {
    if (
      updates.search !== undefined ||
      updates.skills !== undefined ||
      updates.sort !== undefined
    ) {
      updates.page = 1;
    }

    this.filters = { ...this.filters, ...updates };
    this.updateURL(this.filters);
  };

  private updateURL = (newFilters: VacanciesFilterState) => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();

      if (newFilters.page > 1) {
        params.set('page', newFilters.page.toString());
      }

      if (newFilters.search) {
        params.set('search', newFilters.search);
      }

      if (newFilters.skills.length > 0) {
        params.set('skills', newFilters.skills.join(','));
      }

      if (newFilters.sort !== 'newest') {
        params.set('sort', newFilters.sort);
      }

      const url = params.toString() ? `?${params.toString()}` : window.location.pathname;
      window.history.pushState(null, '', url);
    }
  };

  setSearch = (search: string) => {
    this.updateFilters({ search });
  };

  setSkills = (skills: string[]) => {
    this.updateFilters({ skills });
  };

  toggleSkill = (skill: string) => {
    const { skills } = this.filters;
    const newSkills = skills.includes(skill)
      ? skills.filter((s) => s !== skill)
      : [...skills, skill];
    this.updateFilters({ skills: newSkills });
  };

  setSort = (sort: SortKey) => {
    this.updateFilters({ sort });
  };

  setPage = (page: number) => {
    this.updateFilters({ page });
  };

  resetFilters = () => {
    this.updateFilters({
      page: 1,
      search: '',
      skills: [],
      sort: 'newest',
    });
  };
}
