'use client';

import { AuthStore } from './AuthStore/AuthStore';

export class RootStore {
  authStore: AuthStore;

  constructor() {
    this.authStore = new AuthStore();
  }
}
