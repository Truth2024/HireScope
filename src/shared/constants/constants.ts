export const COMMENTS_LIMIT = 5;
export const VACANCY_LIMIT = 4;
export const CANDIDATES_LIMIT = 4;
export const CANDIDATES_LIMIT_IN_VACANCY = 1;

export const skills = [
  { key: 'JavaScript', value: 'JavaScript' },
  { key: 'TypeScript', value: 'TypeScript' },
  { key: 'React', value: 'React' },
  { key: 'Next.js', value: 'Next.js' },
  { key: 'Vue', value: 'Vue' },
  { key: 'Angular', value: 'Angular' },
  { key: 'Node.js', value: 'Node.js' },
  { key: 'Python', value: 'Python' },
  { key: 'Java', value: 'Java' },
  { key: 'C++', value: 'C++' },
  { key: 'C#', value: 'C#' },
  { key: 'Go', value: 'Go' },
  { key: 'Rust', value: 'Rust' },
  { key: 'PHP', value: 'PHP' },
  { key: 'Ruby', value: 'Ruby' },
  { key: 'SQL', value: 'SQL' },
  { key: 'MongoDB', value: 'MongoDB' },
  { key: 'PostgreSQL', value: 'PostgreSQL' },
  { key: 'MySQL', value: 'MySQL' },
  { key: 'Docker', value: 'Docker' },
  { key: 'Kubernetes', value: 'Kubernetes' },
  { key: 'AWS', value: 'AWS' },
  { key: 'Azure', value: 'Azure' },
  { key: 'GCP', value: 'GCP' },
  { key: 'Git', value: 'Git' },
  { key: 'HTML', value: 'HTML' },
  { key: 'CSS', value: 'CSS' },
  { key: 'SASS', value: 'SASS' },
  { key: 'Tailwind', value: 'Tailwind' },
  { key: 'Django', value: 'Django' },
  { key: 'Figma', value: 'Figma' },
  { key: 'Redux', value: 'Redux' },
];

export const sortOptions = [
  { key: 'newest', value: 'sort.newest' },
  { key: 'oldest', value: 'sort.oldest' },
  { key: 'rating', value: 'sort.rating' },
  { key: 'salary_high', value: 'sort.salaryHigh' },
  { key: 'salary_low', value: 'sort.salaryLow' },
];

export const FILTERS_CONFIG = {
  skills,
  sortOptions,
} as const;

export const CANDIDATES_CONFIG = {
  skills,
  defaultPage: 1,
  defaultHasExperience: false,
} as const;

export const DEFAULT_VACANCIES_SORT = 'newest';
export const SEARCH_DEBOUNCE_DELAY = 500;
