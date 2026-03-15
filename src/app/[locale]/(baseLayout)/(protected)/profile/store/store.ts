import { makeAutoObservable } from 'mobx';

import type { NotificationSort, NotificationStatus, NotificationType } from '../types';

export class NotificationsStore {
  page = 1;
  type?: NotificationType;
  status?: NotificationStatus;
  sortBy?: NotificationSort;

  constructor(initialState?: Partial<NotificationsStore>) {
    Object.assign(this, initialState);
    makeAutoObservable(this);
  }

  setPage(page: number) {
    this.page = page;
    this.updateURL();
  }

  setType(type?: NotificationType) {
    this.type = type;
    this.page = 1;
    this.updateURL();
  }

  setStatus(status?: NotificationStatus) {
    this.status = status;
    this.page = 1;
    this.updateURL();
  }

  setSortBy(sortBy?: NotificationSort) {
    this.sortBy = sortBy;
    this.page = 1;
    this.updateURL();
  }

  resetFilters() {
    this.type = undefined;
    this.status = undefined;
    this.sortBy = undefined;
    this.page = 1;
    this.updateURL();
  }

  private updateURL = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();

      if (this.page > 1) {
        params.set('page', this.page.toString());
      }

      if (this.type) {
        params.set('type', this.type);
      }

      if (this.status) {
        params.set('status', this.status);
      }

      if (this.sortBy) {
        params.set('sortBy', this.sortBy);
      }

      const url = params.toString() ? `?${params.toString()}` : window.location.pathname;
      window.history.pushState(null, '', url);
    }
  };
}
