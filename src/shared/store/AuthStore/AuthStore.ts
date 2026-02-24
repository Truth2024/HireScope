'use client';

import { makeAutoObservable, runInAction } from 'mobx';

import type { IUser } from 'src/shared/types/mongoTypes';

export class AuthStore {
  user: IUser | null = null;
  accessToken: string | null = null;
  isLoading = true;
  error: string | null = null;

  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async initialize() {
    if (typeof window === 'undefined') return;

    try {
      const res = await this.fetchWithAuth('/api/auth/me', {
        method: 'GET',
      });

      if (!res.ok) throw new Error('Не удалось получить пользователя');

      const data = await res.json();

      runInAction(() => {
        this.user = data.user;
        this.isLoading = false;
      });
    } catch (e: unknown) {
      runInAction(() => {
        this.user = null;
        this.isLoading = false;

        if (e instanceof Error) {
          this.error = e.message;
        } else {
          this.error = 'Unknown error';
        }
      });
    }
  }

  async fetchWithAuth(input: RequestInfo, init?: RequestInit) {
    const res = await fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        ...(this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {}),
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (res.status !== 401) return res;

    const newToken = await this.refreshToken();

    if (!newToken) {
      this.logout();
      throw new Error('Session expired');
    }

    return fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${newToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
  }

  async refreshToken() {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      this.refreshPromise = (async () => {
        try {
          const refreshRes = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
          });

          if (!refreshRes.ok) throw new Error('Refresh failed');

          const data = await refreshRes.json();

          runInAction(() => {
            this.accessToken = data.accessToken;
            this.user = data.user;
          });

          return data.accessToken as string;
        } catch {
          return null;
        } finally {
          this.isRefreshing = false;
          this.refreshPromise = null;
        }
      })();
    }

    return this.refreshPromise;
  }

  setUser(user: IUser, accessToken: string) {
    this.user = user;
    this.accessToken = accessToken;
  }

  logout() {
    this.user = null;
    this.accessToken = null;
  }
}
