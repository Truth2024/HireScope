import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';

import User from '@models/User';

export const getAuthUser = async (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }

  const token = authHeader.replace('Bearer ', '');
  const decoded = jwt.verify(token, process.env.ACCESS_SECRET!) as { userId: string };

  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
};
