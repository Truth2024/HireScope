import { makeAutoObservable, runInAction } from 'mobx';

import type { IUser } from '@myTypes/mongoTypes';
import type { Option } from '@ui';

export class CandidatesStore {
  candidates: IUser[] = [];
  totalPages = 1;
  currentPage = 1;
  loading = false;
  error: string | null = null;
  search = '';
  selectedSkills: Option[] = [];

  constructor(initialData?: {
    candidates: IUser[];
    totalPages: number;
    currentPage: number;
    search: string;
    selectedSkills?: Option[];
  }) {
    makeAutoObservable(this);

    if (initialData) {
      this.candidates = initialData.candidates;
      this.totalPages = initialData.totalPages;
      this.currentPage = initialData.currentPage;
      this.search = initialData.search;
      this.selectedSkills = initialData.selectedSkills || [];
    }
  }

  async fetchCandidates(page: number, search: string, skills: Option[] = []) {
    this.loading = true;
    this.error = null;

    try {
      const skillValues = skills.map((s) => s.value);

      let url = `/api/candidate?page=${page}`;

      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      if (skillValues.length > 0) {
        url += `&skills=${skillValues.join(',')}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Ошибка загрузки кандидатов');

      const data = await res.json();

      runInAction(() => {
        this.candidates = data.candidates;
        this.totalPages = data.totalPages;
        this.currentPage = data.currentPage;
        this.search = search;
        this.selectedSkills = skills;

        const params = new URLSearchParams();
        params.set('page', String(data.currentPage));

        if (search) {
          params.set('search', search);
        }

        if (skillValues.length > 0) {
          params.set('skills', skillValues.join(','));
        }

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
      });
    } catch (err: unknown) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Неизвестная ошибка';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.fetchCandidates(page, this.search, this.selectedSkills);
  }

  setSearch(value: string) {
    if (value === this.search) return;
    this.fetchCandidates(1, value, this.selectedSkills);
  }

  setSkills(skills: Option[]) {
    this.fetchCandidates(1, this.search, skills);
  }
}
