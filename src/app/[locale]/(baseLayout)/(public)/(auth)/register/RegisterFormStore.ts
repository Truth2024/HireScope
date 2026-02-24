import { makeAutoObservable, runInAction } from 'mobx';
import type { ZodIssue } from 'zod';

import { RegisterSchema } from './registerSchema';

type FormField = 'firstName' | 'surname' | 'secondName' | 'email' | 'password' | 'confirm';

class RegisterFormStore {
  private _password = '';
  private _confirm = '';
  firstName = '';
  surname = '';
  secondName = '';
  email = '';
  errors = { firstName: '', surname: '', secondName: '', email: '', password: '', confirm: '' };
  isLoading = false;
  errorServer: string | null = null;
  isSuccess = false;

  register = async () => {
    runInAction(() => {
      this.isLoading = true;
      this.errorServer = null;
      this.isSuccess = false;
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: this.firstName,
          surname: this.surname,
          secondName: this.secondName,
          email: this.email,
          password: this._password,
        }),
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
  get confirm() {
    return this._confirm;
  }

  get password() {
    return this._password;
  }

  setField = (field: FormField, value: string) => {
    if (field === 'password') {
      this._password = value;
    } else if (field === 'confirm') {
      this._confirm = value;
    } else {
      this[field] = value;
    }
    this.validateField(field, value);
  };

  reset = () => {
    this.firstName = '';
    this.surname = '';
    this.secondName = '';
    this.email = '';
    this._password = '';
    this._confirm = '';
    this.errors = {
      firstName: '',
      surname: '',
      secondName: '',
      email: '',
      password: '',
      confirm: '',
    };
  };

  validateField(field: keyof typeof this.errors, value: string) {
    const formData = {
      firstName: field === 'firstName' ? value : this.firstName,
      surname: field === 'surname' ? value : this.surname,
      secondName: field === 'secondName' ? value : this.secondName,
      email: field === 'email' ? value : this.email,
      password: field === 'password' ? value : this.password,
      confirm: field === 'confirm' ? value : this.confirm,
    };

    const result = RegisterSchema.safeParse(formData);

    if (result.success) {
      this.errors[field] = '';
    } else {
      const fieldError = result.error.issues.find((issue: ZodIssue) => issue.path[0] === field);
      this.errors[field] = fieldError ? fieldError.message : '';
    }
  }

  validation() {
    const formData = {
      firstName: this.firstName,
      surname: this.surname,
      secondName: this.secondName,
      email: this.email,
      password: this.password,
      confirm: this.confirm,
    };

    const result = RegisterSchema.safeParse(formData);

    if (result.success) {
      this.errors = {
        firstName: '',
        surname: '',
        secondName: '',
        email: '',
        password: '',
        confirm: '',
      };
      return true;
    } else {
      const newErrors = {
        firstName: '',
        surname: '',
        secondName: '',
        email: '',
        password: '',
        confirm: '',
      };
      result.error.issues.forEach((issue: ZodIssue) => {
        const key = issue.path[0] as keyof typeof this.errors;
        if (key in newErrors) {
          newErrors[key] = issue.message;
        }
      });
      this.errors = newErrors;
      return false;
    }
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default RegisterFormStore;
