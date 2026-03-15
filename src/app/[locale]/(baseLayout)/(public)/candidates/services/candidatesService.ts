'use server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

import { CANDIDATES_LIMIT } from '@constants/constants';
import connectDB from '@lib/mongodb';
import User from '@models/User';
import type { IUser, IUserMongo, UserFilter } from '@myTypes/mongoTypes';

export const candidatesServiceAll = async (
  page: number = 1,
  searchParam: string = '',
  skillsParam: string[] = [],
  hasExperience?: boolean
): Promise<{
  candidates: IUser[];
  totalResult: number;
  totalPages: number;
}> => {
  await connectDB();

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  let isAuthorized = false;

  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as { userId: string };
      if (decoded.userId) {
        isAuthorized = true;
      }
    } catch {
      isAuthorized = false;
    }
  }

  const skip = (page - 1) * CANDIDATES_LIMIT;

  const filter: UserFilter = { role: 'candidate' };

  if (searchParam.trim()) {
    const regex = new RegExp(searchParam.trim(), 'i');
    filter.$or = [{ firstName: regex }, { surname: regex }, { secondName: regex }];
  }

  if (skillsParam.length > 0) {
    filter.skills = { $all: skillsParam };
  }

  if (hasExperience) {
    filter.experience = { $ne: [] };
  }

  const totalResult = await User.countDocuments(filter);
  const totalPages = Math.ceil(totalResult / CANDIDATES_LIMIT);

  const users = await User.find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .skip(skip)
    .limit(CANDIDATES_LIMIT)
    .lean();

  const candidates: IUser[] = users.map((u: IUserMongo) => ({
    id: u._id.toString(),
    firstName: u.firstName,
    surname: u.surname,
    role: u.role,
    email: u.email,
    secondName: u.secondName,
    avatar: isAuthorized ? (u.avatar ?? null) : (u.avatarBlur ?? null),
    avatarBlur: u.avatarBlur ?? null,
    skills: u.skills,
    experience: u.experience ?? [],
    createdAt: u.createdAt,
  }));

  return {
    candidates: JSON.parse(JSON.stringify(candidates)),
    totalResult,
    totalPages,
  };
};
