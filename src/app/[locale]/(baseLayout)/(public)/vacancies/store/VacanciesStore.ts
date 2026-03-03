import { makeAutoObservable, runInAction } from 'mobx';

import type { IVacancy } from '@myTypes/mongoTypes';
import type { Option } from '@ui';

export class VacanciesStore {
  vacancies: IVacancy[] = [];
  total = 0;
  totalPages = 1;
  currentPage = 1;
  loading = false;
  error: string | null = null;
  search = '';
  selectedSkills: Option[] = [];
  sort = 'newest';

  constructor(initialData?: {
    vacancies: IVacancy[];
    total: number;
    totalPages: number;
    currentPage: number;
    search?: string;
    selectedSkills?: Option[];
    sort?: string;
  }) {
    makeAutoObservable(this);

    if (initialData) {
      this.vacancies = initialData.vacancies;
      this.total = initialData.total;
      this.totalPages = initialData.totalPages;
      this.currentPage = initialData.currentPage;
      this.search = initialData.search || '';
      this.selectedSkills = initialData.selectedSkills || [];
      this.sort = initialData.sort || 'newest';
    }
  }

  fetchVacancies = async (
    page: number,
    search: string,
    skills: Option[] = [],
    sort: string = this.sort
  ) => {
    this.loading = true;
    this.error = null;

    try {
      const skillValues = skills.map((s) => s.value);

      let url = `/api/vacancy?page=${page}`;

      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      if (skillValues.length > 0) {
        url += `&skills=${skillValues.join(',')}`;
      }

      if (sort !== 'newest') {
        url += `&sort=${sort}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Ошибка загрузки вакансий');

      const data = await res.json();

      runInAction(() => {
        this.vacancies = data.vacancies;
        this.total = data.total;
        this.totalPages = data.totalPages;
        this.currentPage = data.currentPage;
        this.search = search;
        this.selectedSkills = skills;
        this.sort = sort;

        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          params.set('page', String(data.currentPage));

          if (search) {
            params.set('search', search);
          } else {
            params.delete('search');
          }

          if (skillValues.length > 0) {
            params.set('skills', skillValues.join(','));
          } else {
            params.delete('skills');
          }

          if (sort !== 'newest') {
            params.set('sort', sort);
          } else {
            params.delete('sort');
          }

          const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
          window.history.replaceState({}, '', newUrl);
        }
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
  };

  setPage = (page: number) => {
    if (page < 1 || page > this.totalPages) return;
    this.fetchVacancies(page, this.search, this.selectedSkills, this.sort);
  };

  setSearch = (value: string) => {
    if (value === this.search) return;
    this.fetchVacancies(1, value, this.selectedSkills, this.sort);
  };

  setSkills = (skills: Option[]) => {
    this.fetchVacancies(1, this.search, skills, this.sort);
  };

  setSort = (value: string) => {
    if (value === this.sort) return;
    this.fetchVacancies(1, this.search, this.selectedSkills, value);
  };
}
