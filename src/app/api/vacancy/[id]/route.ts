import { NextResponse } from 'next/server';

import Comment from '@models/Comment';
import Vacancy from '@models/Vacancy';
import connectDB from 'src/shared/lib/mongodb';

export async function GET(request: Request) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _register = Comment;
  try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];

    await connectDB();

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ message: 'Неверный формат ID' }, { status: 400 });
    }

    const vacancy = await Vacancy.findById(id).populate({
      path: 'comments',
      populate: {
        path: 'user',
      },
    });

    if (!vacancy) {
      return NextResponse.json({ message: 'Вакансия не найдена' }, { status: 404 });
    }

    const result = vacancy.toObject();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';

    return NextResponse.json(
      { success: false, message: 'Ошибка при загрузке вакансий', details: message },
      { status: 500 }
    );
  }
}
