import z from 'zod';

export const RegisterSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: 'Имя должно содержать мин. 2 буквы.' })
      .regex(/^[а-яА-ЯёЁ]+$/, {
        message: 'Имя должно содержать только русский алфавит.',
      }),
    surname: z
      .string()
      .min(2, { message: 'Фамилия должна содержать мин. 2 буквы.' })
      .regex(/^[а-яА-ЯёЁ]+$/, {
        message: 'Фамилия должна содержать только русский алфавит.',
      }),
    secondName: z
      .string()
      .min(2, { message: 'Отчество должно содержать мин. 2 буквы.' })
      .regex(/^[а-яА-ЯёЁ]+$/, {
        message: 'Отчество должно содержать только русский алфавит.',
      }),
    email: z.string().email({ message: 'Неверный формат email.' }),
    password: z.string().min(8, { message: 'Пароль должен содержать минимум 8 символов.' }),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Пароли не совпадают.',
    path: ['confirm'],
  });

export type RegisterForm = z.infer<typeof RegisterSchema>;
