'use client';

import { makeAutoObservable, runInAction } from 'mobx';

import { pusherClient } from '@lib/pusherClient';
import type { IUser } from '@myTypes/mongoTypes';

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
      const newToken = await this.refreshToken();

      if (!newToken) {
        runInAction(() => {
          this.user = null;
          this.accessToken = null;
          this.isLoading = false;
        });
        return;
      }

      runInAction(() => {
        this.isLoading = false;
      });
    } catch (e) {
      runInAction(() => {
        this.user = null;
        this.accessToken = null;
        this.error = e as string;
        this.isLoading = false;
      });
    }
  }

  async fetchWithAuth(input: RequestInfo, init?: RequestInit) {
    const isFormData = init?.body instanceof FormData;
    const res = await fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        ...(this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {}),
        ...(!isFormData && { 'Content-Type': 'application/json' }),
      },
      credentials: 'include',
    });

    if (res.status !== 401) return res;

    const newToken = await this.refreshToken();

    if (!newToken) {
      this.logout();
      throw new Error('Session expired');
    }
    const isFormDataRetry = init?.body instanceof FormData;
    return fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${newToken}`,
        ...(!isFormDataRetry && { 'Content-Type': 'application/json' }),
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

          if (!refreshRes.ok) throw new Error('Refresh network failed');

          const data = await refreshRes.json();

          if (data.authenticated === false) {
            return null;
          }

          runInAction(() => {
            this.accessToken = data.accessToken;
            this.user = data.user;
          });

          return data.accessToken;
        } catch {
          await this.logout();
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
  incrementUnread() {
    if (!this.user) return null;
    this.user.unreadNotifications += 1;
  }
  resetUnreadCount() {
    if (!this.user) return null;
    this.user.unreadNotifications = 0;
  }
  setAvatar(value: string) {
    if (!this.user) return;
    this.user.avatar = value;
  }

  async logout() {
    if (this.user?.id) {
      try {
        pusherClient.unsubscribe(`user-${this.user.id}`);
      } catch {}
    }

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      runInAction(() => {
        this.error = error as string;
      });
    } finally {
      runInAction(() => {
        this.user = null;
        this.accessToken = null;
      });

      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      }
    }
  }
}
