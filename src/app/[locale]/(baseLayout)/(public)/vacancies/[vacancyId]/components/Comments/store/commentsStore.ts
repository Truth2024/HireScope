'use client';

import { makeAutoObservable, runInAction } from 'mobx';

import { COMMENTS_LIMIT } from '@constants/constants';
import type { IComment, IRatingDistribution } from '@myTypes/mongoTypes';
import type { AuthStore } from '@store/AuthStore/AuthStore';

type InitData = {
  comments: IComment[];
  page: number;
  totalPages: number;
  commentsCount: number;
  rating: number;
  ratingDistribution: IRatingDistribution;
};

export class CommentsStore {
  comments: IComment[] = [];
  currentPage = 1;
  totalPages = 1;
  isLoading = false;
  vacancyId: string;
  commentsCount = 0;
  rating = 0;
  ratingDistribution: IRatingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  error: string | null = null;

  constructor(vacancyId: string, initialData?: InitData) {
    makeAutoObservable(this);
    this.vacancyId = vacancyId;

    if (initialData) {
      this.comments = initialData.comments;
      this.currentPage = initialData.page;
      this.totalPages = initialData.totalPages;
      this.commentsCount = initialData.commentsCount;
      this.rating = initialData.rating;
      this.ratingDistribution = initialData.ratingDistribution;
    }
  }

  private handleError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'Произошла неизвестная ошибка';
  }

  async fetchComments(page = 1) {
    this.isLoading = true;
    this.error = null;
    try {
      const res = await fetch(`/api/vacancy/${this.vacancyId}/comments?page=${page}&limit=5`);

      if (!res.ok) {
        throw new Error(`Ошибка загрузки: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      runInAction(() => {
        this.comments = page === 1 ? data.comments : [...this.comments, ...data.comments];
        this.currentPage = data.page;
        this.totalPages = data.totalPages;
      });
    } catch (error) {
      runInAction(() => {
        this.error = this.handleError(error);
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  changePage = () => {
    if (this.isLoading) return;
    if (this.currentPage >= this.totalPages) return;

    const nextPage = this.currentPage + 1;
    this.fetchComments(nextPage);
  };

  feedback = async (text: string, rating: number, authStore: AuthStore) => {
    if (!authStore.user || !authStore.accessToken) {
      this.error = 'Необходима авторизация';
      return;
    }

    this.isLoading = true;
    this.error = null;

    try {
      const res = await authStore.fetchWithAuth(`/api/vacancy/${this.vacancyId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text, rating }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Не удалось отправить комментарий');
      }

      const data = await res.json();

      runInAction(() => {
        this.commentsCount = data.stats.totalComments;
        this.rating = data.stats.averageRating;
        this.ratingDistribution = data.stats.ratingDistribution;
        this.totalPages = Math.ceil(this.commentsCount / COMMENTS_LIMIT);
        this.comments = [];
        this.currentPage = 1;
      });

      await this.fetchComments(1);
    } catch (err) {
      runInAction(() => {
        this.error = this.handleError(err);
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };
}
