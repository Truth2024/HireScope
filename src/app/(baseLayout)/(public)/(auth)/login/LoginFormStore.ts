import { makeAutoObservable, runInAction } from 'mobx';

// import { proxyRoutes } from '@api';
// import type { AutharizationStore } from 'app/authorization/stores/AutharizationStore';

import { LoginSchema } from './loginSchema';

class LoginFormStore {
  private _identifier = '';
  private _password = '';
  errors = { identifier: '', password: '' };

  isLoading = false;
  errorServer: string | null = null;
  isSuccess = false;

  login = async () => {
    runInAction(() => {
      this.isLoading = true;
      this.errorServer = null;
      this.isSuccess = false;
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: this._identifier,
          password: this._password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP error: ${response.status}`);
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
        this.errorServer = error instanceof Error ? error.message : 'Неизвестная ошибка';
      });
    }
  };
  get identifier() {
    return this._identifier;
  }
  get password() {
    return this._password;
  }

  setIdentifier = (value: string) => {
    this._identifier = value;
    this.validateField('identifier', value);
  };

  setPassword = (value: string) => {
    this._password = value;
    this.validateField('password', value);
  };

  reset = () => {
    this.errors = { identifier: '', password: '' };
    this._identifier = '';
    this._password = '';
  };

  validateField(field: 'identifier' | 'password', value: string) {
    const formData = {
      identifier: field === 'identifier' ? value : this.identifier,
      password: field === 'password' ? value : this.password,
    };

    const result = LoginSchema.safeParse(formData);

    if (result.success) {
      this.errors[field] = '';
    } else {
      const fieldError = result.error.issues.find((issue) => issue.path[0] === field);
      this.errors[field] = fieldError ? fieldError.message : '';
    }
  }

  validation() {
    const formData = {
      identifier: this.identifier,
      password: this.password,
    };

    const result = LoginSchema.safeParse(formData);

    if (result.success) {
      this.errors = { identifier: '', password: '' };
      return true;
    } else {
      const newErrors = { identifier: '', password: '' };
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof typeof this.errors;
        newErrors[key] = issue.message;
      });
      this.errors = newErrors;
      return false;
    }
  }

  constructor() {
    makeAutoObservable(this);
  }
}
export default LoginFormStore;
