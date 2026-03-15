import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';

import User from '@models/User';
import type { IUserMongo } from '@myTypes/mongoTypes';

export const getAuthUser = async (req: NextRequest): Promise<IUserMongo | null> => {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET!) as { userId: string };

    const user = await User.findById(decoded.userId);
    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return null;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return null;
    }

    throw error;
  }
};
