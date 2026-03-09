import { makeAutoObservable, runInAction } from 'mobx';
import type { ZodIssue } from 'zod';

import type { IUser } from '@myTypes/mongoTypes';

import { RegisterSchema } from './registerSchema';

export type UserRole = 'candidate' | 'hr';

export type FormField =
  | 'firstName'
  | 'surname'
  | 'secondName'
  | 'email'
  | 'password'
  | 'confirm'
  | 'role';

export type ErrorField = 'firstName' | 'surname' | 'secondName' | 'email' | 'password' | 'confirm';

type FormErrors = {
  firstName: string;
  surname: string;
  secondName: string;
  email: string;
  password: string;
  confirm: string;
};

const formatName = (value: string): string => {
  if (!value) return '';
  return value.toLowerCase().replace(/(^|\s|-)([а-яёa-z])/g, (match) => match.toUpperCase());
};

class RegisterFormStore {
  private _password = '';
  private _confirm = '';

  firstName = '';
  surname = '';
  secondName = '';
  email = '';
  role: UserRole = 'candidate';

  errors: FormErrors = {
    firstName: '',
    surname: '',
    secondName: '',
    email: '',
    password: '',
    confirm: '',
  };

  isLoading = false;
  errorServer: string | null = null;
  isSuccess = false;

  constructor() {
    makeAutoObservable(this);
  }

  get password(): string {
    return this._password;
  }

  get confirm(): string {
    return this._confirm;
  }

  private get formData() {
    return {
      role: this.role,
      firstName: this.firstName,
      surname: this.surname,
      secondName: this.secondName,
      email: this.email,
      password: this.password,
      confirm: this.confirm,
    };
  }

  setField = (field: FormField, value: string): void => {
    const nameFields: FormField[] = ['firstName', 'surname', 'secondName'];
    const processedValue = nameFields.includes(field) ? formatName(value) : value;

    if (field === 'password') {
      this._password = processedValue;
    } else if (field === 'confirm') {
      this._confirm = processedValue;
    } else if (field === 'role') {
      this.role = processedValue as UserRole;
    } else {
      (this as unknown as Record<string, string>)[field] = processedValue;
    }

    if (field !== 'role') {
      this.validateField(field as keyof FormErrors, processedValue);
    }
  };

  register = async (): Promise<IUser> => {
    runInAction(() => {
      this.isLoading = true;
      this.errorServer = null;
      this.isSuccess = false;
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.error?.message ||
          data.message ||
          `Ошибка ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      runInAction(() => {
        this.isLoading = false;
        this.isSuccess = true;
        this.errorServer = null;
      });

      return data;
    } catch (error: unknown) {
      runInAction(() => {
        this.isLoading = false;
        this.isSuccess = false;
        this.errorServer =
          error instanceof Error ? error.message : 'Неизвестная ошибка при подключении к серверу';
      });
      throw error;
    }
  };

  validateField(field: keyof FormErrors, value: string): void {
    const dataToValidate = {
      ...this.formData,
      [field]: value,
    };

    const result = RegisterSchema.safeParse(dataToValidate);

    if (result.success) {
      this.errors[field] = '';
    } else {
      const fieldError = result.error.issues.find((issue: ZodIssue) => issue.path[0] === field);
      this.errors[field] = fieldError ? fieldError.message : '';
    }
  }

  validation(): boolean {
    const result = RegisterSchema.safeParse(this.formData);

    if (result.success) {
      this.resetErrors();
      return true;
    } else {
      const newErrors: FormErrors = this.getEmptyErrors();

      result.error.issues.forEach((issue: ZodIssue) => {
        const key = issue.path[0] as keyof FormErrors;
        if (key in newErrors) {
          newErrors[key] = issue.message;
        }
      });

      this.errors = newErrors;
      return false;
    }
  }

  reset = (): void => {
    this.firstName = '';
    this.surname = '';
    this.secondName = '';
    this.email = '';
    this._password = '';
    this._confirm = '';
    this.role = 'candidate';
    this.errors = this.getEmptyErrors();
  };

  private resetErrors(): void {
    this.errors = this.getEmptyErrors();
  }

  private getEmptyErrors(): FormErrors {
    return {
      firstName: '',
      surname: '',
      secondName: '',
      email: '',
      password: '',
      confirm: '',
    };
  }
}

export default RegisterFormStore;
