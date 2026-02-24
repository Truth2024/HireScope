import { NextResponse } from 'next/server';

import User from '@models/User';
import connectDB from 'src/shared/lib/mongodb';
import type { IUserMongo } from 'src/shared/types/mongoTypes';

export async function GET() {
  try {
    await connectDB();

    const limit = 6;

    const users = await User.find({
      role: 'candidate',
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // сериализация
    const formattedCandidates = users.map((u: IUserMongo) => ({
      id: u._id,
      firstName: u.firstName,
      surname: u.surname,
      secondName: u.secondName,
      avatar: u.avatar ?? null,
      avatarBlur: u.avatarBlur ?? null,
      skills: u.skills,
      experience: u.experience ?? [],
      createdAt: u.createdAt,
    }));

    return NextResponse.json(formattedCandidates);
  } catch (error: unknown) {
    const details = error instanceof Error ? error.message : 'Неизвестная ошибка';

    return NextResponse.json(
      {
        success: false,
        message: 'Ошибка при загрузке кандидатов',
        details,
      },
      { status: 500 }
    );
  }
}
