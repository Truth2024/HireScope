import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

import connectDB from '@lib/mongodb';
import User from '@models/User';
import Vacancy from '@models/Vacancy';
import type { IUser, IUserMongo, IVacancy, IVacancyMongo } from '@myTypes/mongoTypes';

export type CandidatesResult =
  | { status: 'success'; data: IUser[] }
  | { status: 'error'; code: number }
  | { status: 'empty' };

export type VacanciesResult =
  | { status: 'success'; data: IVacancy[] }
  | { status: 'error'; code: number }
  | { status: 'empty' };

export const fetchTopCandidates = async (limit = 4): Promise<CandidatesResult> => {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    let isAuthorized = false;

    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as { userId: string };
        const authUser = await User.findById(decoded.userId).lean();
        isAuthorized = !!authUser;
      } catch {
        isAuthorized = false;
      }
    }

    const usersMongo: IUserMongo[] = await User.find({ role: 'candidate' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const data = usersMongo.map((u) => ({
      id: u._id.toString(),
      firstName: u.firstName,
      surname: u.surname,
      secondName: u.secondName,
      email: u.email,
      role: u.role,
      avatar: isAuthorized ? (u.avatar ?? null) : null,
      avatarBlur: u.avatarBlur ?? null,
      skills: u.skills,
      experience:
        u.experience?.map((exp) => ({
          company: exp.company,
          position: exp.position,
          years: exp.years,
        })) ?? [],
      createdAt: u.createdAt.toString(),
      unreadNotifications: 0,
    }));

    if (data.length === 0) {
      return { status: 'empty' };
    }

    return { status: 'success', data };
  } catch {
    return { status: 'error', code: 500 };
  }
};

export const fetchTopVacancy = async (limit = 4): Promise<VacanciesResult> => {
  try {
    await connectDB();

    const vacancies = await Vacancy.find({ rating: { $gte: 4 } })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const data = vacancies.map((v: IVacancyMongo) => ({
      id: v._id.toString(),
      title: v.title,
      description: v.description.substring(0, 120) + '...',
      company: v.company,
      commentsCount: v.commentsStats?.total ?? 0,
      ratingDistribution: v.commentsStats?.distribution ?? {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
      salary: {
        min: v.salary?.min ?? null,
        max: v.salary?.max ?? null,
      },
      rating: v.rating ?? 0,
      department: v.department || 'Разработка',
      requirements: v.requirements?.slice(0, 4) || [],
      createdBy: v.createdBy ? v.createdBy._id.toString() : null,
      createdAt: v.createdAt.toISOString(),
    }));

    if (data.length === 0) {
      return { status: 'empty' };
    }

    return { status: 'success', data };
  } catch {
    return { status: 'error', code: 500 };
  }
};
