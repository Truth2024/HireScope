import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
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
  await connectToDatabase();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, password, firstName, surname, secondName, role } = await req.json();

    if (!email || !password || !role) {
      await session.abortTransaction();
      session.endSession();

      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const exist = await User.findOne({ email }).session(session);

    if (exist) {
      await session.abortTransaction();
      session.endSession();

      return NextResponse.json(
        {
          error: 'Пользователь с таким email уже существует',
          message: 'Данный email занят',
        },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [user] = await User.create(
      [
        {
          email,
          password: passwordHash,
          firstName,
          surname,
          secondName,
          role,
        },
      ],
      { session }
    );

    const accessToken = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.ACCESS_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    await session.commitTransaction();
    session.endSession();

    const response = NextResponse.json(
      {
        message: 'User created',
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
          experience: (user.experience || []).map((exp: ExperienceDocument) => ({
            id: exp._id?.toString(),
            company: exp.company,
            position: exp.position,
            years: exp.years,
          })),
          createdAt: user.createdAt.toISOString(),
        },
      },
      { status: 201 }
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
