import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

import User from '@models/User';
import connectToDatabase from 'src/shared/lib/mongodb';

const ACCESS_SECRET = process.env.ACCESS_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cookieHeader = req.headers.get('cookie');
    const refreshToken = req.headers.get('cookie')?.split('refreshToken=')[1]?.split(';')[0];

    if (!refreshToken) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_SECRET);
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
      ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    const newRefreshToken = jwt.sign({ userId: user._id.toString() }, REFRESH_SECRET, {
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
          experience: user.experience ?? [],
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
