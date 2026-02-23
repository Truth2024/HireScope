import { NextResponse } from 'next/server';

import User from '@models/User';
import connectDB from 'src/shared/lib/mongodb';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];

    await connectDB();

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ message: 'Неверный формат ID' }, { status: 400 });
    }

    const userDoc = await User.findById(id).lean();

    if (!userDoc) {
      return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
    }

    const user = {
      id: userDoc._id.toString(),
      firstName: userDoc.firstName,
      surname: userDoc.surname,
      secondName: userDoc.secondName,
      email: userDoc.email,
      role: userDoc.role,
      avatar: userDoc.avatar || null,
      avatarBlur: userDoc.avatarBlur || null,
      skills: userDoc.skills || [],
      experience: userDoc.experience || [],
      createdAt: userDoc.createdAt?.toISOString() || new Date().toISOString(),
    };

    return NextResponse.json(user);
  } catch (error: unknown) {
    const details = error instanceof Error ? error.message : 'Неизвестная ошибка';

    return NextResponse.json(
      {
        message: 'Ошибка при загрузке пользователя',
        details,
      },
      { status: 500 }
    );
  }
}
