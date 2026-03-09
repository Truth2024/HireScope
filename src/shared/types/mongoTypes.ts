// ------------------------------
// Тип пользователя

import type mongoose from 'mongoose';

// ------------------------------
export type IUser = {
  id: string;
  firstName: string;
  surname: string;
  secondName: string;
  email: string;
  role: 'hr' | 'candidate';
  avatar?: string | null;
  avatarBlur?: string | null;
  skills: string[];
  isOwner?: boolean;
  experience: Array<{
    id?: string;
    company?: string;
    position?: string;
    years?: number;
  }>;
  createdAt: string; // ISO дата
};
export type IUserMongo = {
  _id: string;
  firstName: string;
  surname: string;
  secondName: string;
  email: string;
  role: 'hr' | 'candidate';
  avatar?: string | null;
  avatarBlur?: string | null;
  skills: string[];
  experience?: Array<{
    company?: string;
    position?: string;
    years?: number;
  }>;
  createdAt: string; // ISO дата
};
export type ExperienceItem = {
  id?: string;
  company?: string;
  position?: string;
  years?: number;
};
export type ExperienceItemWithMeta = {
  isNew?: boolean;
} & ExperienceItem;

export type UserFilter = {
  role?: string;
  $or?: Array<{ [key: string]: RegExp | { $exists?: boolean; $size?: number } }>;
  skills?: { $all: string[] };
  experience?:
    | { $ne: [] } // для фильтра "только с опытом" (не пустой массив)
    | { $exists: boolean; $size?: number }; // для других случаев
};

// ------------------------------
// Тип комментария
// ------------------------------
export type IComment = {
  _id: string;
  user: ICommentUser; // ← исправить
  text: string;
  rating: number;
  createdAt: string;
  email?: string;
};
export type CommentWithUser = {
  _id: mongoose.Types.ObjectId;
  text: string;
  rating: number;
  createdAt: Date;
  user: ICommentUser;
};

export type ICommentUser = {
  _id: string;
  firstName: string;
  surname: string;
  secondName: string;
  avatar: string | null;
  avatarBlur: string | null;
  email?: string;
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

export type ICandidateMongo = {
  _id: string; // _id.toString()
  userId: string;
  user?: IUserMongo; // ссылка на пользователя-кандидата
  vacancyId: string;
  status: 'new' | 'viewed' | 'interview' | 'offer' | 'rejected';
  matchScore?: number | null;
  notes?: string | null;
  appliedAt: string; // ISO дата
};

// ------------------------------
// Тип вакансии
// ------------------------------
export type IRatingDistribution = {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
};

export type IVacancy = {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  company: string;
  salary: ISalary | null;
  department?: string | null;
  isOwner?: boolean;
  rating: number;
  comments?: IComment[];
  commentsCount: number;
  ratingDistribution: IRatingDistribution;
  createdBy: string | null;
  candidates?: ICandidate[];
  createdAt: string;
  hasApplied?: boolean;
};

export type ICommentsStatsMongo = {
  total: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  lastUpdated: Date;
};

export type IVacancyMongo = {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  company: string;
  salary?: {
    min?: number;
    max?: number;
  };
  rating?: number;
  commentsStats?: ICommentsStatsMongo;
  department?: string;
  requirements?: string[];
  createdBy?: {
    _id: mongoose.Types.ObjectId;
    name: string;
  };
  candidates?: mongoose.Types.ObjectId[];
  createdAt: Date;
};

export type HRVacancyListItem = {
  id: string;
  title: string;
  description: string;
  company: string;
  requirements: string[];
  salary: {
    min?: number | null;
    max?: number | null;
  } | null;
  rating: number;
  createdAt: string;
  candidates: string[];
};

export type VacancyFilter = {
  $or?: Array<{
    title?: RegExp;
    description?: RegExp;
  }>;
  requirements?: { $in: string[] } | { $all: string[] };
  salary?: {
    $and?: Array<{
      'salary.min'?: { $lte?: number; $gte?: number };
      'salary.max'?: { $lte?: number; $gte?: number };
    }>;
  };
};
