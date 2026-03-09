import type { Types } from 'mongoose';

import type { ICandidate, IUserMongo } from '@myTypes/mongoTypes';
export type VacancyDocument = {
  _id: Types.ObjectId;
  title: string;
  description: string;
  requirements: string[];
  company: string;
  salary?: {
    min?: number;
    max?: number;
  };
  department?: string;
  rating: number;
  commentsStats?: {
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
  createdBy?: Types.ObjectId;
  createdAt: Date;
};

export type UserDocument = {
  _id: Types.ObjectId;
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
  createdAt: Date;
};
export type CandidatePopulated = {
  _id: Types.ObjectId;
  userId: IUserMongo | null;
  vacancyId: Types.ObjectId;
  status: 'new' | 'viewed' | 'interview' | 'offer' | 'rejected';
  matchScore?: number | null;
  notes?: string | null;
  appliedAt: Date;
};

export type CandidatesResponse = {
  candidates: ICandidate[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
