import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

import User from '@models/User';
import connectToDatabase from 'src/shared/lib/mongodb';

const ACCESS_SECRET = process.env.ACCESS_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export async function POST(req: Request) {
  await connectToDatabase();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const user = await User.findOne({ email: identifier }).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const accessToken = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign({ userId: user._id.toString() }, REFRESH_SECRET, {
      expiresIn: '7d',
    });

    await session.commitTransaction();
    session.endSession();

    const response = NextResponse.json(
      {
        message: 'Login successful',
        accessToken,
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

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (e: unknown) {
    await session.abortTransaction();
    session.endSession();

    const details = e instanceof Error ? e.message : 'Неизвестная ошибка';

    return NextResponse.json({ error: 'Server error', details }, { status: 500 });
  }
}
