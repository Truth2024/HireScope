'use client';

import { makeAutoObservable, runInAction } from 'mobx';
import { z } from 'zod';

import type { ExperienceItem, ExperienceItemWithMeta } from '@myTypes/mongoTypes';
import type { AuthStore } from '@store/AuthStore/AuthStore';

// 1. Централизованная схема валидации
const experienceSchema = z.object({
  company: z.string().trim().min(1, 'companyRequired').max(100, 'companyMax'),
  position: z.string().trim().min(1, 'positionRequired').max(100, 'positionMax'),
  years: z.number().min(1, 'yearsMin').max(50, 'yearsMax'),
});

// Тип для валидных ключей полей
type ExperienceFields = keyof z.infer<typeof experienceSchema>;

export class ExperienceChangerStore {
  myExpMap = new Map<string, ExperienceItemWithMeta>();
  error: string | null = null;
  isEditing = false;
  isLoading = false;

  // Типизированная структура ошибок: Record<ID, Record<Field, Message>>
  fieldErrors: Partial<Record<string, Partial<Record<ExperienceFields, string>>>> = {};

  constructor(private t: (key: string) => string) {
    makeAutoObservable(this);
  }

  get myExp(): ExperienceItemWithMeta[] {
    return Array.from(this.myExpMap.values());
  }

  private setFieldError(id: string, field: ExperienceFields, msg: string) {
    if (!this.fieldErrors[id]) this.fieldErrors[id] = {};
    this.fieldErrors[id]![field] = this.t(msg);
  }

  private clearErrors(id: string, field: ExperienceFields) {
    if (this.fieldErrors[id]) {
      delete this.fieldErrors[id]![field];
      if (Object.keys(this.fieldErrors[id]!).length === 0) delete this.fieldErrors[id];
    }
  }

  getFieldError(id: string, field: ExperienceFields): string | undefined {
    return this.fieldErrors[id]?.[field];
  }

  setExp(exp: ExperienceItem[]) {
    this.myExpMap.clear();
    exp.forEach((item) => item.id && this.myExpMap.set(item.id, { ...item, isNew: false }));
    this.fieldErrors = {};
  }

  updateItem<K extends ExperienceFields>(id: string, field: K, value: unknown) {
    const item = this.myExpMap.get(id);
    if (!item) return;

    const val = field === 'years' ? Number(value) : value;
    this.myExpMap.set(id, { ...item, [field]: val, isNew: false });

    // Динамическая валидация конкретного поля через pick
    const fieldSchema = experienceSchema.pick({ [field]: true } as Record<ExperienceFields, true>);
    const res = fieldSchema.safeParse({ [field]: val });

    if (res.success) {
      this.clearErrors(id, field);
    } else {
      const issue = res.error.issues[0];
      this.setFieldError(id, field, issue.message);
    }
  }

  addEmpty() {
    const id = crypto.randomUUID();
    this.myExpMap.set(id, { id, company: '', position: '', years: 0, isNew: true });
  }

  delete(id: string) {
    this.myExpMap.delete(id);
    delete this.fieldErrors[id];
  }

  validateAll(): boolean {
    this.fieldErrors = {};
    let isValid = true;

    this.myExp.forEach((item) => {
      // Пропуск пустых новых записей
      if (item.isNew && !item.company && !item.position && item.years === 0) return;

      const res = experienceSchema.safeParse(item);
      if (!res.success) {
        isValid = false;
        res.error.issues.forEach((issue) => {
          const field = issue.path[0] as ExperienceFields;
          if (item.id) this.setFieldError(item.id, field, issue.message);
        });
      }
    });
    return isValid;
  }

  async savingExp(store: AuthStore) {
    if (!this.validateAll()) {
      this.error = this.t('fixFormErrors');
      return;
    }

    const dataToSave = this.myExp.filter(
      (i): i is ExperienceItem => !!(i.company && i.position && i.years && i.id)
    );

    this.isLoading = true;
    this.error = null;

    try {
      const res = await store.fetchWithAuth('/api/user/update-exp', {
        method: 'PUT',
        body: JSON.stringify({ experience: dataToSave }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || this.t('saveFailed'));
      }

      runInAction(() => {
        if (store.user) store.user.experience = dataToSave;
        this.setExp(dataToSave);
        this.isEditing = false;
      });
    } catch (e: unknown) {
      runInAction(() => (this.error = e instanceof Error ? e.message : this.t('saveFailed')));
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }
}
