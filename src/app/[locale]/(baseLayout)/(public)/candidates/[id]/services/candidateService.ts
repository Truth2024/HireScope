'use server';

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

import User from '@models/User';
import type { IUser, IUserMongo } from '@myTypes/mongoTypes';
import connectDB from 'src/shared/lib/mongodb';

export type CandidateResult =
  | { status: 'success'; data: IUser }
  | { status: 'error'; code: number; message: string }
  | { status: 'notFound' };

export const fetchCandidateById = async (id: string): Promise<CandidateResult> => {
  try {
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

    const userDoc: IUserMongo | null = await User.findById(id).lean();

    if (!userDoc) {
      return { status: 'notFound' };
    }

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
      unreadNotifications: 0,
    };

    return { status: 'success', data: user };
  } catch (error) {
    let code = 500;
    let message = 'Internal server error';

    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        code = 503;
        message = 'Database connection failed';
      } else if (error.message.includes('jwt')) {
        code = 401;
        message = 'Authentication failed';
      }
    }

    return { status: 'error', code, message };
  }
};
