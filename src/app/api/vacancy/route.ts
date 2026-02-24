import { NextResponse } from 'next/server';

import User from '@models/User';
import Vacancy from '@models/Vacancy';
import connectDB from 'src/shared/lib/mongodb';
import type { IVacancyMongo } from 'src/shared/types/mongoTypes';

export async function GET() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _registerModels = User;
  try {
    await connectDB();

    const vacancies = await Vacancy.find().populate('createdBy', 'name').sort({ createdAt: -1 });

    const formattedVacancies = vacancies.map((v: IVacancyMongo) => ({
      id: v._id.toString(),
      title: v.title,
      description: v.description?.substring(0, 120) + '...',
      company: v.company,
      level: v.level,
      salary: {
        min: v.salary?.min ?? null,
        max: v.salary?.max ?? null,
      },
      rating: v.rating,
      department: v.department || 'Разработка',
      requirements: v.requirements?.slice(0, 4) || [],
      createdBy: v.createdBy
        ? {
            id: v.createdBy._id.toString(),
            name: v.createdBy.name,
          }
        : null,
      createdAt: v.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedVacancies);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';

    return NextResponse.json(
      { success: false, message: 'Ошибка при загрузке вакансий', details: message },
      { status: 500 }
    );
  }
}
