import jwt from 'jsonwebtoken';
import type mongoose from 'mongoose';
import { NextResponse } from 'next/server';

import { ACCESS_EXPIRES } from '@constants/constants';
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
      { expiresIn: ACCESS_EXPIRES }
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
          unreadNotifications: user.unreadNotifications,
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
