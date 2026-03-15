import jwt from 'jsonwebtoken';
import type { Types } from 'mongoose';
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
  IUserMongo,
  IVacancy,
  IVacancyMongo,
} from '@myTypes/mongoTypes';

import type {
  CandidatePopulated,
  CandidatesResponse,
  UserDocument,
  VacancyDocument,
} from './types';

export async function getHRVacancies(token?: string): Promise<HRVacancyListItem[]> {
  if (!token) throw new Error('Unauthorized');

  await connectDB();

  const decoded = jwt.verify(token, process.env.REFRESH_SECRET!) as { userId: string };

  const user = await User.findById(decoded.userId);
  if (!user || user.role !== 'hr') throw new Error('Forbidden');

  const vacancies = await Vacancy.find({ createdBy: user._id })
    .select('title description requirements salary rating company createdAt candidates')
    .sort({ createdAt: -1 })
    .lean();

  return vacancies.map((v: IVacancyMongo) => ({
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
}

export const vacancyBaseService = async (vacancyId: string): Promise<IVacancy | null> => {
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

  // Получаем только базовую информацию о вакансии без кандидатов
  const vacancy = await Vacancy.findById(vacancyId)
    .select('-candidates') // Исключаем кандидатов
    .lean<VacancyDocument>();

  if (!vacancy) {
    return null;
  }

  // Формируем salary объект
  const salary: ISalary | null = vacancy.salary
    ? {
        min: vacancy.salary.min ?? null,
        max: vacancy.salary.max ?? null,
      }
    : null;

  // Создаем финальный объект вакансии
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
    candidates: [], // Пустой массив для совместимости с типом
    commentsCount: vacancy.commentsStats?.total ?? 0,
  };

  return formattedVacancy;
};

export const vacancyCandidatesService = async (
  vacancyId: string,
  page: number = 1,
  searchQuery?: string,
  hasExperience?: boolean,
  sortBy: 'matchScore' | 'appliedAt' = 'matchScore',
  order: 'asc' | 'desc' = 'desc'
): Promise<CandidatesResponse | null> => {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get('refreshToken')?.value;
  const limit = CANDIDATES_LIMIT_IN_VACANCY;
  const skip = (page - 1) * limit;

  let currentUserId: string | null = null;
  let isAuthorized = false;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_SECRET!) as { userId: string };
      currentUserId = decoded.userId;
      const authUser = await User.findById(currentUserId).lean<UserDocument>();
      if (authUser) isAuthorized = true;
    } catch {
      isAuthorized = false;
    }
  }

  const vacancy = await Vacancy.findById(vacancyId).select('createdBy').lean();
  if (!vacancy || (currentUserId && vacancy.createdBy?.toString() !== currentUserId)) {
    return null;
  }

  const allCandidates = await Candidate.find({ vacancyId }).select('userId').lean();
  const candidateUserIds = allCandidates
    .map((doc) => doc.userId)
    .filter((id): id is Types.ObjectId => id !== null);

  let matchingUserIds = candidateUserIds;

  if (searchQuery?.trim()) {
    const searchRegex = new RegExp(searchQuery.trim(), 'i');
    const users = await User.find({
      _id: { $in: candidateUserIds },
      $or: [{ firstName: searchRegex }, { surname: searchRegex }, { secondName: searchRegex }],
    })
      .select('_id')
      .lean();
    matchingUserIds = users.map((u) => u._id);
  }

  if (hasExperience && matchingUserIds.length > 0) {
    const usersWithExp = await User.find({
      _id: { $in: matchingUserIds },
      'experience.0': { $exists: true },
    })
      .select('_id')
      .lean();
    matchingUserIds = usersWithExp.map((u) => u._id);
  }

  const finalQuery = {
    vacancyId,
    userId: { $in: matchingUserIds },
  };

  const sortOptions: Record<string, 1 | -1> = {
    [sortBy]: order === 'asc' ? 1 : -1,
  };

  const [candidates, total] = await Promise.all([
    Candidate.find(finalQuery)
      .populate<{ userId: IUserMongo | null }>({
        path: 'userId',
        model: User,
        select: isAuthorized
          ? 'firstName surname secondName email avatar avatarBlur experience skills role createdAt'
          : 'firstName surname secondName avatarBlur experience skills role createdAt',
      })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean<CandidatePopulated[]>(),
    Candidate.countDocuments(finalQuery),
  ]);

  const formattedCandidates: ICandidate[] = candidates.map((candidate) => {
    const userData = candidate.userId;

    return {
      id: candidate._id.toString(),
      userId: userData?._id.toString() ?? '',
      user: userData
        ? {
            id: userData._id.toString(),
            firstName: userData.firstName,
            surname: userData.surname,
            secondName: userData.secondName,
            email: isAuthorized ? userData.email : '',
            role: userData.role,
            avatar: userData.avatar ?? null,
            avatarBlur: userData.avatarBlur ?? null,

            experience:
              userData.experience?.map((exp) => {
                return {
                  company: exp.company || '',
                  position: exp.position || '',
                  years: exp.years || 0,
                };
              }) ?? [],
            skills: userData.skills,
            createdAt: userData.createdAt.toString(),
          }
        : undefined,
      vacancyId: candidate.vacancyId.toString(),
      status: candidate.status,
      matchScore: candidate.matchScore ?? null,
      notes: candidate.notes ?? null,
      appliedAt: candidate.appliedAt.toISOString(),
    };
  });

  const totalPages = Math.ceil(total / limit);

  return {
    candidates: formattedCandidates,
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};
