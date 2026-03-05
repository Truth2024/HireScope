import jwt from 'jsonwebtoken';
import type mongoose from 'mongoose';
import { Document } from 'mongoose';
import { NextResponse } from 'next/server';

import User from '@models/User';
import connectToDatabase from 'src/shared/lib/mongodb';

type ExperienceDocument = {
  _id?: mongoose.Types.ObjectId;
  company?: string;
  position?: string;
  years?: number;
};
const ACCESS_SECRET = process.env.ACCESS_SECRET!;

export async function GET(req: Request) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _register = { Document };
  try {
    await connectToDatabase();

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let decoded: any;
    try {
      decoded = jwt.verify(token, ACCESS_SECRET);
    } catch (err) {
      return NextResponse.json({ error: `Invalid or expired token ${err}` }, { status: 401 });
    }

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          firstName: user.firstName,
          surname: user.surname,
          secondName: user.secondName,
          email: user.email,
          role: user.role,
          avatar: user.avatar ?? null,
          avatarBlur: user.avatarBlur ?? null,
          skills: user.skills ?? [],
          experience: (user.experience || []).map((exp: ExperienceDocument) => ({
            id: exp._id?.toString(),
            company: exp.company,
            position: exp.position,
            years: exp.years,
          })),
          createdAt: user.createdAt.toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (e: unknown) {
    return NextResponse.json({ error: `Internal server error ${e}` }, { status: 500 });
  }
}
