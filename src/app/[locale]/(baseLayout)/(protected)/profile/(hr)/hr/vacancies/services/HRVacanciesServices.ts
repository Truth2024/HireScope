import jwt from 'jsonwebtoken';
import type { PipelineStage } from 'mongoose';
import { Types } from 'mongoose';
import { cookies } from 'next/headers';

import { CANDIDATES_LIMIT_IN_VACANCY } from '@constants/constants';
import connectDB from '@lib/mongodb';
import Candidate from '@models/Candidate';
import User from '@models/User';
import Vacancy from '@models/Vacancy';
import type {
  HRVacancyListItem,
  ICandidate,
  ISalary,
  IVacancy,
  IVacancyMongo,
} from '@myTypes/mongoTypes';

import type { CandidatesResponse, UserDocument, VacancyDocument } from './types';

export type HRVacanciesResult =
  | { status: 'success'; data: HRVacancyListItem[] }
  | { status: 'error'; code: number; message: string }
  | { status: 'unauthorized' }
  | { status: 'forbidden' };

export async function getHRVacancies(token?: string): Promise<HRVacanciesResult> {
  try {
    if (!token) {
      return { status: 'unauthorized' };
    }

    await connectDB();

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_SECRET!) as { userId: string };
    } catch {
      return { status: 'unauthorized' };
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return { status: 'unauthorized' };
    }

    if (user.role !== 'hr') {
      return { status: 'forbidden' };
    }

    const vacancies = await Vacancy.find({ createdBy: user._id })
      .select('title description requirements salary rating company createdAt candidates')
      .sort({ createdAt: -1 })
      .lean();

    const data: HRVacancyListItem[] = vacancies.map((v: IVacancyMongo) => ({
      id: v._id.toString(),
      title: v.title,
      description: v.description,
      company: v.company,
      requirements: v.requirements || [],
      candidates: v.candidates?.map((candidateId: Types.ObjectId) => candidateId.toString()) || [],
      salary: v.salary || null,
      rating: v.rating || 0,
      createdAt: v.createdAt.toISOString(),
    }));

    return { status: 'success', data };
  } catch {
    return {
      status: 'error',
      code: 500,
      message: 'Failed to fetch vacancies',
    };
  }
}

export type VacancyBaseResult =
  | { status: 'success'; data: IVacancy }
  | { status: 'notFound' }
  | { status: 'error'; code: number; message: string }
  | { status: 'unauthorized' };

export const vacancyBaseService = async (vacancyId: string): Promise<VacancyBaseResult> => {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get('refreshToken')?.value;
    let currentUserId: string | null = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.REFRESH_SECRET!) as { userId: string };
        currentUserId = decoded.userId;
      } catch {
        // Ignore token errors
      }
    }

    const vacancy = await Vacancy.findById(vacancyId).select('-candidates').lean<VacancyDocument>();

    if (!vacancy) {
      return { status: 'notFound' };
    }

    const salary: ISalary | null = vacancy.salary
      ? {
          min: vacancy.salary.min ?? null,
          max: vacancy.salary.max ?? null,
        }
      : null;

    const formattedVacancy: IVacancy = {
      id: vacancy._id.toString(),
      title: vacancy.title,
      description: vacancy.description,
      requirements: Array.isArray(vacancy.requirements) ? vacancy.requirements : [],
      company: vacancy.company,
      salary,
      rating: vacancy.rating,
      ratingDistribution: vacancy.commentsStats
        ? vacancy.commentsStats.distribution
        : { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      department: vacancy.department ?? null,
      createdBy: vacancy.createdBy?.toString() ?? null,
      isOwner: currentUserId ? vacancy.createdBy?.toString() === currentUserId : false,
      createdAt: vacancy.createdAt.toISOString(),
      candidates: [],
      commentsCount: vacancy.commentsStats?.total ?? 0,
    };

    return { status: 'success', data: formattedVacancy };
  } catch {
    return {
      status: 'error',
      code: 500,
      message: 'Failed to fetch vacancy',
    };
  }
};
// Типы для агрегации
type UserAggregate = {
  _id: Types.ObjectId;
  firstName: string;
  surname: string;
  secondName: string;
  email?: string;
  avatar: string | null;
  avatarBlur: string | null;
  experience: Array<{
    company: string;
    position: string;
    years: number;
  }>;
  skills: string[];
  role: 'hr' | 'candidate';
  createdAt: Date;
};

type CandidateAggregate = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  vacancyId: Types.ObjectId;
  status: string;
  matchScore: number | null;
  notes: string | null;
  appliedAt: Date;
  user: UserAggregate;
};

export type VacancyCandidatesResult =
  | { status: 'success'; data: CandidatesResponse }
  | { status: 'notFound' }
  | { status: 'forbidden' }
  | { status: 'unauthorized' }
  | { status: 'error'; code: number; message: string };

export const vacancyCandidatesService = async (
  vacancyId: string,
  page: number = 1,
  searchQuery?: string,
  hasExperience?: boolean,
  sortBy: 'matchScore' | 'appliedAt' = 'matchScore',
  order: 'asc' | 'desc' = 'desc'
): Promise<VacancyCandidatesResult> => {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get('refreshToken')?.value;
    const limit = CANDIDATES_LIMIT_IN_VACANCY;
    const skip = (page - 1) * limit;

    let currentUserId: string | null = null;
    let isAuthorized = false;

    if (!token) {
      return { status: 'unauthorized' };
    }

    try {
      const decoded = jwt.verify(token, process.env.REFRESH_SECRET!) as { userId: string };
      currentUserId = decoded.userId;
      const authUser = await User.findById(currentUserId).lean<UserDocument>();
      if (authUser) isAuthorized = true;
    } catch {
      return { status: 'unauthorized' };
    }

    const vacancy = await Vacancy.findById(vacancyId).select('createdBy').lean<VacancyDocument>();

    if (!vacancy) {
      return { status: 'notFound' };
    }

    if (vacancy.createdBy?.toString() !== currentUserId) {
      return { status: 'forbidden' };
    }

    const pipeline: PipelineStage[] = [
      { $match: { vacancyId: new Types.ObjectId(vacancyId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: false } } as PipelineStage.Unwind,
    ];

    if (searchQuery?.trim()) {
      const searchRegex = new RegExp(searchQuery.trim(), 'i');
      pipeline.push({
        $match: {
          $or: [
            { 'user.firstName': { $regex: searchRegex } },
            { 'user.surname': { $regex: searchRegex } },
            { 'user.secondName': { $regex: searchRegex } },
          ],
        },
      } as PipelineStage.Match);
    }

    if (hasExperience) {
      pipeline.push({
        $match: {
          'user.experience.0': { $exists: true },
        },
      } as PipelineStage.Match);
    }

    const sortStage: PipelineStage.Sort = {
      $sort: {
        [sortBy]: order === 'asc' ? 1 : -1,
      },
    };
    pipeline.push(sortStage);

    const countPipeline: PipelineStage[] = [...pipeline, { $count: 'total' }];
    const countResult = await Candidate.aggregate<{ total: number }>(countPipeline);
    const total = countResult[0]?.total || 0;

    pipeline.push({ $skip: skip } as PipelineStage.Skip);
    pipeline.push({ $limit: limit } as PipelineStage.Limit);

    const projectStage: PipelineStage.Project = {
      $project: {
        _id: 1,
        userId: '$user._id',
        vacancyId: 1,
        status: 1,
        matchScore: 1,
        notes: 1,
        appliedAt: 1,
        user: {
          _id: '$user._id',
          firstName: '$user.firstName',
          surname: '$user.surname',
          secondName: '$user.secondName',
          avatar: '$user.avatar',
          avatarBlur: '$user.avatarBlur',
          experience: '$user.experience',
          skills: '$user.skills',
          role: '$user.role',
          createdAt: '$user.createdAt',
          ...(isAuthorized ? { email: '$user.email' } : {}),
        },
      },
    };

    pipeline.push(projectStage);

    const candidates = await Candidate.aggregate<CandidateAggregate>(pipeline);

    const formattedCandidates: ICandidate[] = candidates.map((candidate) => {
      const userData = candidate.user;

      return {
        id: candidate._id.toString(),
        userId: userData._id.toString(),
        user: {
          id: userData._id.toString(),
          firstName: userData.firstName,
          surname: userData.surname,
          secondName: userData.secondName,
          email: isAuthorized ? userData.email || '' : '',
          role: userData.role,
          avatar: userData.avatar ?? null,
          avatarBlur: userData.avatarBlur ?? null,
          experience: userData.experience.map((exp) => ({
            company: exp.company || '',
            position: exp.position || '',
            years: exp.years || 0,
          })),
          unreadNotifications: 0,
          skills: userData.skills,
          createdAt: userData.createdAt.toISOString(),
        },
        vacancyId: candidate.vacancyId.toString(),
        matchScore: candidate.matchScore ?? null,
        notes: candidate.notes ?? null,
        appliedAt: candidate.appliedAt.toISOString(),
      };
    });

    const totalPages = Math.ceil(total / limit);

    return {
      status: 'success',
      data: {
        candidates: formattedCandidates,
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch {
    return {
      status: 'error',
      code: 500,
      message: 'Failed to fetch candidates',
    };
  }
};
