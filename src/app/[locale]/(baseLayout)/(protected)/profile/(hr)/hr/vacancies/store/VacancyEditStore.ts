'use client';

import { makeAutoObservable, runInAction } from 'mobx';

import type { VacancyFormData } from '@EditVacancySchema/schema';
import { VacancySchema, formatTitle } from '@EditVacancySchema/schema';
import { skills } from '@constants/constants';
import type { ISalary, IVacancy } from '@myTypes/mongoTypes';
import type { AuthStore } from '@store/AuthStore/AuthStore';

type FormField = keyof VacancyFormData;

const initialSalary: ISalary = { min: null, max: null };
const initialErrors = (): Record<FormField, string> => ({
  title: '',
  description: '',
  requirements: '',
  salary: '',
  company: '',
});

export class VacancyEditStore {
  private _title = '';
  private _requirements: string[] = [];
  private _description = '';
  private _company = '';
  private _salary: ISalary = { ...initialSalary };
  private _originalVacancy: IVacancy | null = null;

  errors = initialErrors();
  isLoading = false;
  errorServer: string | null = null;
  isSuccess = false;

  constructor() {
    makeAutoObservable(this);
  }

  get title() {
    return this._title;
  }
  get company() {
    return this._company;
  }
  get requirements() {
    return this._requirements;
  }
  get description() {
    return this._description;
  }
  get salary() {
    return this._salary;
  }
  get allRequirementsOptions() {
    return skills.map((i) => i.value);
  }

  get isValid(): boolean {
    return Object.values(this.errors).every((err) => !err);
  }

  get hasChanges(): boolean {
    if (!this._originalVacancy) return false;
    const current = this.getFormData();
    const original = this._originalVacancy;

    return (
      current.title !== original.title ||
      current.company !== original.company ||
      current.description !== original.description ||
      JSON.stringify(current.requirements) !== JSON.stringify(original.requirements) ||
      JSON.stringify(current.salary) !== JSON.stringify(original.salary)
    );
  }

  init(vacancy: IVacancy) {
    this._originalVacancy = vacancy;
    this._title = vacancy.title;
    this._company = vacancy.company;
    this._requirements = [...vacancy.requirements];
    this._description = vacancy.description;
    this._salary = vacancy.salary ? { ...vacancy.salary } : { ...initialSalary };
    this.validateAll();
  }

  setTitle = (v: string) => {
    this._title = v;
    this.validateField('title');
  };
  setCompany = (v: string) => {
    this._company = v;
    this.validateField('company');
  };
  setDescription = (v: string) => {
    this._description = v;
    this.validateField('description');
  };

  setSalaryField = (value: string, type: keyof ISalary) => {
    if (value === '' || /^\d+$/.test(value)) {
      this._salary[type] = value === '' ? null : Number(value);
      this.validateField('salary');
    }
  };

  toggleRequirement = (skill: string) => {
    this._requirements = this._requirements.includes(skill)
      ? this._requirements.filter((s) => s !== skill)
      : [...this._requirements, skill];
    this.validateField('requirements');
  };

  validateField(field: FormField) {
    const result = VacancySchema.safeParse(this.getFormData());
    this.errors[field] = result.success
      ? ''
      : result.error.issues.find((i) => i.path[0] === field)?.message || '';
  }

  validateAll(): boolean {
    const result = VacancySchema.safeParse(this.getFormData());
    this.errors = initialErrors();

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as FormField;
        if (field in this.errors) this.errors[field] = issue.message;
      });
    }
    return result.success;
  }

  getFormData(): VacancyFormData {
    return {
      title: formatTitle(this._title),
      description: this._description,
      company: this._company,
      requirements: this._requirements,
      salary: this._salary,
    };
  }

  reset = () => this._originalVacancy && this.init(this._originalVacancy);

  private async _executeRequest<T>(
    requestFn: () => Promise<Response>,
    onSuccess?: (data: Record<string, unknown>) => T
  ): Promise<T | boolean> {
    runInAction(() => {
      this.isLoading = true;
      this.errorServer = null;
      this.isSuccess = false;
    });

    try {
      const response = await requestFn();
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Ошибка сервера');

      runInAction(() => {
        this.isLoading = false;
        this.isSuccess = true;
      });

      return onSuccess ? onSuccess(result) : true;
    } catch (error: unknown) {
      runInAction(() => {
        this.isLoading = false;
        this.errorServer = error instanceof Error ? error.message : 'Неизвестная ошибка';
      });
      return false;
    }
  }

  saveChanges = (auth: AuthStore, id: string) => {
    if (!this.validateAll()) return Promise.resolve(false);
    return this._executeRequest(() =>
      auth.fetchWithAuth(`/api/hr/vacancy/${id}`, {
        method: 'PUT',
        body: JSON.stringify(this.getFormData()),
      })
    );
  };

  delete = (auth: AuthStore, id: string) =>
    this._executeRequest(() => auth.fetchWithAuth(`/api/hr/vacancy/${id}`, { method: 'DELETE' }));

  create = async (auth: AuthStore): Promise<{ success: boolean; id?: string }> => {
    if (!this.validateAll()) return { success: false };

    const result = await this._executeRequest(
      () =>
        auth.fetchWithAuth('/api/hr/vacancy/create', {
          method: 'POST',
          body: JSON.stringify(this.getFormData()),
        }),
      (data: { data?: { id?: string } }) => ({ success: true, id: data.data?.id })
    );

    return typeof result === 'object' ? result : { success: !!result };
  };
}
