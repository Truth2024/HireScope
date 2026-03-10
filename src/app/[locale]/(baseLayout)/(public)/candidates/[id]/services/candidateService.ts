'use server';

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

import User from '@models/User';
import type { IUser, IUserMongo } from '@myTypes/mongoTypes';
import connectDB from 'src/shared/lib/mongodb';

export const fetchCandidateById = async (id: string): Promise<IUser | null> => {
  await connectDB();

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;
  let isAuthorized = false;
  let isOwner = false;

  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as { userId: string };
      if (decoded.userId) {
        isOwner = decoded.userId === id;
        isAuthorized = true;
      }
    } catch {
      isAuthorized = false;
    }
  }

  try {
    const userDoc: IUserMongo | null = await User.findById(id).lean();
    if (!userDoc) return null;

    const user: IUser = {
      id: userDoc._id.toString(),
      firstName: userDoc.firstName,
      surname: userDoc.surname,
      secondName: userDoc.secondName,
      email: userDoc.email,
      role: userDoc.role,
      isOwner: isOwner,
      avatar: isAuthorized ? (userDoc.avatar ?? null) : null,
      avatarBlur: userDoc.avatarBlur ?? null,
      skills: userDoc.skills,
      experience: userDoc.experience ?? [],
      createdAt: userDoc.createdAt.toString(),
    };

    return user;
  } catch {
    return null;
  }
};
