import { z } from 'zod';

export const experienceSchema = z.object({
  company: z.string().trim().min(1, 'companyRequired').max(100, 'companyMax'),
  position: z.string().trim().min(1, 'positionRequired').max(100, 'positionMax'),
  years: z.number().min(1, 'yearsMin').max(50, 'yearsMax'),
});

export type ExperienceFields = keyof z.infer<typeof experienceSchema>;
