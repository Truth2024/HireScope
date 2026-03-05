'use client';

import { makeAutoObservable, runInAction } from 'mobx';
import { z } from 'zod';

import type { ExperienceItem, ExperienceItemWithMeta } from '@myTypes/mongoTypes';
import type { AuthStore } from '@store/AuthStore/AuthStore';

export class ExperienceChangerStore {
  myExpMap = new Map<string, ExperienceItemWithMeta>();
  error: string | null = null;
  isEditing = false;
  isLoading = false;
  fieldErrors: Record<string, Record<string, string>> = {};

  private t: (key: string) => string;

  constructor(t: (key: string) => string) {
    makeAutoObservable(this);
    this.t = t;
  }

  // Геттеры
  get myExp(): ExperienceItem[] {
    return Array.from(this.myExpMap.values());
  }

  private get myExpWithMeta(): ExperienceItemWithMeta[] {
    return Array.from(this.myExpMap.values());
  }

  // Приватные методы проверки
  private isItemEmpty = (item: ExperienceItem) =>
    !item.company?.trim() && !item.position?.trim() && !item.years;

  private isItemComplete = (item: ExperienceItem) =>
    Boolean(item.company?.trim() && item.position?.trim() && item.years && item.years > 0);

  private isItemUnchanged = (item: ExperienceItemWithMeta) =>
    Boolean(item.isNew) && this.isItemEmpty(item);

  // Работа с ошибками
  private setFieldError = (id: string, field: string, message: string) => {
    if (!this.fieldErrors[id]) this.fieldErrors[id] = {};
    this.fieldErrors[id][field] = message;
  };

  private clearFieldError = (id: string, field: string) => {
    if (this.fieldErrors[id]?.[field]) {
      delete this.fieldErrors[id][field];
      if (Object.keys(this.fieldErrors[id]).length === 0) {
        delete this.fieldErrors[id];
      }
    }
  };

  getFieldError = (id: string, field: string): string | undefined => this.fieldErrors[id]?.[field];

  // 👇 Схема с переводами
  private get schema() {
    return z.object({
      id: z.string(),
      company: z.string().min(1, this.t('companyRequired')).max(100, this.t('companyMax')),
      position: z.string().min(1, this.t('positionRequired')).max(100, this.t('positionMax')),
      years: z.number().min(1, this.t('yearsMin')).max(50, this.t('yearsMax')),
    });
  }

  // Публичные методы
  setExp = (exp: ExperienceItem[]) => {
    this.myExpMap.clear();
    exp.forEach((item) => {
      if (item.id) {
        this.myExpMap.set(item.id, { ...item, isNew: false });
      }
    });
    this.fieldErrors = {};
  };

  setIsEditing = (value: boolean) => {
    this.isEditing = value;
  };

  validateField = (id: string, field: keyof ExperienceItem, value: string | number) => {
    try {
      const fieldSchema = z.object({ [field]: this.schema.shape[field] });
      fieldSchema.parse({ [field]: value });
      this.clearFieldError(id, field as string);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        if (firstError) this.setFieldError(id, field as string, firstError.message);
      }
      return false;
    }
  };

  updateItem = (id: string, field: keyof ExperienceItem, value: string | number) => {
    const processedValue = field === 'years' ? Number(value) || 0 : value;
    this.validateField(id, field, processedValue);

    const item = this.myExpMap.get(id);
    if (!item) return;

    const updatedItem = { ...item, [field]: processedValue, isNew: false };
    this.myExpMap.set(id, updatedItem);

    if (this.isItemEmpty(updatedItem)) this.delete(id);
  };

  delete = (id: string) => {
    this.myExpMap.delete(id);
    delete this.fieldErrors[id];
  };

  addEmpty = () => {
    const id = crypto.randomUUID();
    this.myExpMap.set(id, {
      id,
      company: '',
      position: '',
      years: undefined,
      isNew: true,
    });
  };

  cancel = (originalExperience: ExperienceItem[]) => {
    this.setExp(originalExperience);
    this.isEditing = false;
  };

  validateItem = (item: ExperienceItem): boolean => {
    try {
      this.schema.parse(item);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((issue) => {
          const field = issue.path[0] as string;
          if (item.id) this.setFieldError(item.id, field, issue.message);
        });
      }
      return false;
    }
  };

  validateAll = (): boolean => {
    if (this.myExp.length === 0) return true;

    let isValid = true;
    this.myExpWithMeta.forEach((item) => {
      if (this.isItemUnchanged(item)) return;

      if (!this.isItemComplete(item)) {
        this.setFieldError(item.id!, 'form', this.t('formComplete'));
        isValid = false;
      } else if (!this.validateItem(item)) {
        isValid = false;
      }
    });
    return isValid;
  };

  getFilledExp = (): ExperienceItem[] =>
    this.myExpWithMeta.filter((item) => !this.isItemUnchanged(item)).filter(this.isItemComplete);

  async savingExp(store: AuthStore) {
    this.error = null;

    if (!store.user) {
      this.error = this.t('userNotAuthenticated');
      return;
    }

    const invalidItems = this.myExpWithMeta
      .filter((item) => !this.isItemUnchanged(item))
      .filter((item) => !this.isItemComplete(item));

    if (invalidItems.length > 0) {
      this.error = this.t('fillAllFields');
      invalidItems.forEach((item) => this.setFieldError(item.id!, 'form', this.t('fillAllFields')));
      return;
    }

    if (!this.validateAll()) {
      this.error = this.t('fixFormErrors');
      return;
    }

    const filledExp = this.getFilledExp();

    try {
      this.isLoading = true;

      const response = await store.fetchWithAuth('/api/user/update-exp', {
        method: 'PUT',
        body: JSON.stringify({ experience: filledExp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        this.error = errorData.message || this.t('saveFailed');
        return;
      }

      runInAction(() => {
        if (store.user) store.user.experience = [...filledExp];
        this.setExp(filledExp);
        this.isEditing = false;
        this.isLoading = false;
        this.fieldErrors = {};
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : this.t('unknownError');
        this.isLoading = false;
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  isNewItem = (id: string): boolean => this.myExpMap.get(id)?.isNew || false;
}
