import { z } from 'zod';

export const formatTitle = (text: string): string => {
  if (!text) return '';
  return text
    .trim()
    .split(/\s+/)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};

const hasNoDigits = (text: string) => !/\d/.test(text);

export const TitleSchema = z
  .string()
  .min(1, 'Validation.empty')
  .min(3, 'Validation.tooShort')
  .max(100, 'Validation.tooLong')
  .refine(hasNoDigits, 'Validation.noDigits')
  .refine((t) => t.trim().length > 0, 'Validation.onlySpaces')
  .transform((t) => formatTitle(t));

export const CompanySchema = z
  .string()
  .min(1, 'Validation.empty')
  .max(30, 'Validation.tooLong')
  .refine((t) => t.trim().length > 0, 'Validation.onlySpaces')
  .transform((t) => {
    const trimmed = t.trim();
    if (trimmed.length === 0) return '';
    return trimmed[0].toUpperCase() + trimmed.slice(1).toLowerCase();
  });

export const SalarySchema = z
  .object({
    min: z.number().min(0, 'Validation.salaryNegative').nullable(),
    max: z.number().min(0, 'Validation.salaryNegative').nullable(),
  })
  .refine((data) => !(data.min && data.max && data.min > data.max), {
    message: 'Validation.salaryOrder',
    path: ['min'],
  });

export const DescriptionSchema = z
  .string()
  .min(1, 'Validation.empty')
  .min(20, 'Validation.tooShort')
  .max(5000, 'Validation.tooLong')
  .refine((t) => t.trim().length >= 20, 'Validation.tooShort');

export const RequirementsSchema = z.array(z.string()).min(1, 'Validation.atLeastOne');

export const VacancySchema = z.object({
  title: TitleSchema,
  description: DescriptionSchema,
  requirements: RequirementsSchema,
  salary: SalarySchema,
  company: CompanySchema,
});
export type VacancyFormData = z.infer<typeof VacancySchema>;
