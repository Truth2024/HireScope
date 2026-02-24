// ------------------------------
// Тип пользователя
// ------------------------------
export type IUser = {
  id: string; // _id.toString()
  firstName: string;
  surname: string;
  secondName: string;
  email: string;
  role: 'hr' | 'candidate';
  avatar?: string | null;
  avatarBlur?: string | null;
  skills: string[]; // может быть пустым
  experience?: Array<{
    company?: string;
    position?: string;
    years?: number;
  }>;
  createdAt: string; // ISO дата
};
export type IUserMongo = {
  _id: string; // _id.toString()
  firstName: string;
  surname: string;
  secondName: string;
  email: string;
  role: 'hr' | 'candidate';
  avatar?: string | null;
  avatarBlur?: string | null;
  skills: string[]; // может быть пустым
  experience?: Array<{
    company?: string;
    position?: string;
    years?: number;
  }>;
  createdAt: string; // ISO дата
};

// ------------------------------
// Тип комментария
// ------------------------------
export type IComment = {
  _id: string; // _id.toString()
  user: IUser; // пользователь, оставивший комментарий
  text: string;
  rating: number; // 1-5
  createdAt: string; // ISO дата
};

// ------------------------------
// Тип зарплаты
// ------------------------------
export type ISalary = {
  min: number | null;
  max: number | null;
};

// ------------------------------
// Тип кандидата
// ------------------------------
export type ICandidate = {
  id: string; // _id.toString()
  userId: string;
  user?: IUser; // ссылка на пользователя-кандидата
  vacancyId: string;
  status: 'new' | 'viewed' | 'interview' | 'offer' | 'rejected';
  matchScore?: number | null;
  notes?: string | null;
  appliedAt: string; // ISO дата
};

// ------------------------------
// Тип вакансии
// ------------------------------
export type IVacancy = {
  id: string; // _id.toString()
  title: string;
  description: string;
  requirements: string[];
  company: string;
  salary: ISalary | null;
  department?: string | null;
  level: 'junior' | 'middle' | 'senior' | null;
  rating: number;
  comments: IComment[];
  commentsCount: number; // количество комментариев
  createdBy: IUser | null;
  candidates: ICandidate[];
  createdAt: string; // ISO дата
};
export type IVacancyMongo = {
  _id: string;
  title: string;
  description?: string;
  company: string;
  level: string;
  salary?: {
    min?: number;
    max?: number;
  };
  rating?: number;
  department?: string;
  requirements?: string[];
  createdBy?: {
    _id: string;
    name: string;
  };
  createdAt: Date;
};
