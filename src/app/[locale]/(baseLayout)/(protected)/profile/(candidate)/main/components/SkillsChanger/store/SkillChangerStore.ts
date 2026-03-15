'use client';

import { makeAutoObservable, runInAction } from 'mobx';

import { skills } from '@constants/constants';
import type { AuthStore } from '@store/AuthStore/AuthStore';

export class SkillChangerStore {
  mySkills: string[] = [];
  allSkillsOptions = skills;
  error: string | null = null;
  isEditing: boolean = false;
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setSkills(skills: string[]) {
    this.mySkills = [...skills];
  }

  setIsEditing(value: boolean) {
    this.isEditing = value;
  }

  toggleSkill(skill: string) {
    if (this.mySkills.includes(skill)) {
      this.mySkills = this.mySkills.filter((i) => i !== skill);
    } else {
      this.mySkills.push(skill);
    }
  }

  async savingSkills(store: AuthStore) {
    this.error = null;

    if (!store.user) {
      this.error = 'User not authenticated';
      return;
    }

    const originalSkills = store.user.skills;

    const newSkills = this.mySkills;

    const hasChanges =
      originalSkills.length !== newSkills.length ||
      originalSkills.some((skill, index) => skill !== newSkills[index]) ||
      originalSkills.some((skill) => !newSkills.includes(skill));

    if (!hasChanges) {
      this.isEditing = false;
      return;
    }

    try {
      this.isLoading = true;

      const response = await store.fetchWithAuth('/api/user/update-skills', {
        method: 'PUT',
        body: JSON.stringify({ skills: this.mySkills }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update skills');
      }

      const data = await response.json();
      runInAction(() => {
        store.user!.skills = [...this.mySkills];
        this.isEditing = false;
        this.isLoading = false;
      });

      return data;
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Error saving skills';
        this.isLoading = false;
      });
    }
  }
}
