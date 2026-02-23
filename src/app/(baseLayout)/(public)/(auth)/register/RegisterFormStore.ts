import { makeAutoObservable, runInAction } from 'mobx';
import type { ZodIssue } from 'zod';

import { RegisterSchema } from './registerSchema';

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
        throw new Error(data.error?.message || `HTTP error: ${response.status}`);
      }

      runInAction(() => {
        this.isLoading = false;
        this.isSuccess = true;
        this.errorServer = null;
      });

      return data;
    } catch (error: unknown) {
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        const isJsonParseError =
          error.message.includes("Failed to execute 'json'") &&
          error.message.includes('Unexpected end of JSON input');

        if (isJsonParseError) {
          errorMessage = 'Ошибка сервера (500). Пожалуйста, попробуйте позже.';
        } else {
          const isNetworkError =
            error.message.includes('Failed to fetch') ||
            error.message.includes('network request failed');

          errorMessage = isNetworkError
            ? 'Не удалось подключиться к серверу. Проверьте ваше интернет-соединение.'
            : error.message;
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      runInAction(() => {
        this.isLoading = false;
        this.isSuccess = false;
        this.errorServer = errorMessage;
      });
      throw errorMessage;
    }
  };
  get confirm() {
    return this._confirm;
  }

  get password() {
    return this._password;
  }

  setFirstName = (value: string) => {
    this.firstName = value;
    this.validateField('firstName', value);
  };
  setSurname = (value: string) => {
    this.surname = value;
    this.validateField('surname', value);
  };
  setSecondName = (value: string) => {
    this.secondName = value;
    this.validateField('secondName', value);
  };

  setEmail = (value: string) => {
    this.email = value;
    this.validateField('email', value);
  };

  setConfirm = (value: string) => {
    this._confirm = value;
    this.validateField('confirm', value);
  };

  setPassword = (value: string) => {
    this._password = value;
    this.validateField('password', value);
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
