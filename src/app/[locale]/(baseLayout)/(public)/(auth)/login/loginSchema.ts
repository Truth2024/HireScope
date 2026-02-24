import z from 'zod';

// login
export const LoginSchema = z.object({
  identifier: z.string().email({ message: 'Неверный формат email.' }),
  password: z.string().min(8, { message: 'Пароль должен содержать минимум 8 символов.' }),
});

export type LoginForm = z.infer<typeof LoginSchema>;
