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

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _register = { Document };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cookieHeader = req.headers.get('cookie');
    const refreshToken = req.headers.get('cookie')?.split('refreshToken=')[1]?.split(';')[0];

    if (!refreshToken) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET!);
    } catch (err) {
      return NextResponse.json(
        { error: `Invalid or expired refresh token ${err}` },
        { status: 403 }
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newAccessToken = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.ACCESS_SECRET!,
      { expiresIn: '15m' }
    );

    const newRefreshToken = jwt.sign({ userId: user._id.toString() }, process.env.REFRESH_SECRET!, {
      expiresIn: '7d',
    });

    const response = NextResponse.json(
      {
        accessToken: newAccessToken,
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

    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (e: unknown) {
    return NextResponse.json({ error: `Internal server error ${e}` }, { status: 500 });
  }
}
