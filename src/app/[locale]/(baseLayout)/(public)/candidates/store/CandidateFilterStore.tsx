import { makeAutoObservable } from 'mobx';

export type SortByKey = 'name' | 'experience' | 'createdAt' | 'rating';

export type CandidateFilterState = {
  page: number;
  search: string;
  skills: string[];
  hasExperience: boolean;
};
export class CandidateFilterStore {
  filters: CandidateFilterState = {
    page: 1,
    search: '',
    skills: [],
    hasExperience: false,
  };

  constructor(initialState: Partial<CandidateFilterState> = {}) {
    makeAutoObservable(this);
    this.filters = { ...this.filters, ...initialState };
  }

  updateFilters = (updates: Partial<CandidateFilterState>) => {
    if (
      updates.search !== undefined ||
      updates.skills !== undefined ||
      updates.hasExperience !== undefined
    ) {
      updates.page = 1;
    }

    this.filters = { ...this.filters, ...updates };
    this.updateURL(this.filters);
  };

  private updateURL = (newFilters: CandidateFilterState) => {
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

      if (newFilters.hasExperience) {
        params.set('hasExperience', 'true');
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
    const currentSkills = this.filters.skills;
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter((s) => s !== skill)
      : [...currentSkills, skill];
    this.updateFilters({ skills: newSkills });
  };

  setHasExperience = (hasExperience: boolean) => {
    this.updateFilters({ hasExperience });
  };

  setPage = (page: number) => {
    this.updateFilters({ page });
  };

  resetFilters = () => {
    this.updateFilters({
      page: 1,
      search: '',
      skills: [],
      hasExperience: false,
    });
  };
}
