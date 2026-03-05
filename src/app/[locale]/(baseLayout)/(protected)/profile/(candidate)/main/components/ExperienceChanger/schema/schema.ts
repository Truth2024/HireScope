import { z } from 'zod';

export const ExperienceItemSchema = z.object({
  id: z.string(),
  company: z.string().min(1, 'Название компании обязательно'),
  position: z.string().min(1, 'Название должности обязательно'),
  years: z.number().min(1, 'Укажите количество лет').max(50, 'Максимум 50 лет'),
});

export type ExperienceItemSchema = z.infer<typeof ExperienceItemSchema>;
