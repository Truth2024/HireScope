import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

import connectDB from '@lib/mongodb';
import User from '@models/User';
import Vacancy from '@models/Vacancy';
import type { IUser, IUserMongo, IVacancy, IVacancyMongo } from '@myTypes/mongoTypes';

const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export const fetchTopCandidates = async (limit = 6): Promise<IUser[]> => {
  await connectDB();

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  let isAuthorized = false;

  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { userId: string };
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

  return usersMongo.map((u) => ({
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
  }));
};

export const fetchTopVacancy = async (limit = 4): Promise<IVacancy[]> => {
  try {
    await connectDB();

    const vacancies = await Vacancy.find({ rating: { $gte: 4 } })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit);

    return vacancies.map((v: IVacancyMongo) => ({
      id: v._id.toString(),
      title: v.title,
      description: v.description.substring(0, 120) + '...',
      company: v.company,
      level: v.level,
      salary: {
        min: v.salary?.min ?? null,
        max: v.salary?.max ?? null,
      },
      rating: v.rating,
      department: v.department || 'Разработка',
      requirements: v.requirements?.slice(0, 4) || [],
      createdBy: v.createdBy
        ? {
            id: v.createdBy._id.toString(),
            name: v.createdBy.name,
          }
        : null,
      createdAt: v.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
};
