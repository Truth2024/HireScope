import { NextResponse } from 'next/server';

import connectDB from '@lib/mongodb';
import User from '@models/User';
import Vacancy from '@models/Vacancy';
import type { IVacancyMongo } from '@myTypes/mongoTypes';

export async function GET() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const registerModels = User;
  try {
    await connectDB();

    const limit = 4;

    const vacancies = await Vacancy.find({
      rating: { $gte: 4 },
    })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit);

    const formattedVacancies = vacancies.map((v: IVacancyMongo) => ({
      id: v._id.toString(),
      title: v.title,
      description: v.description.substring(0, 120) + '...',
      company: v.company,

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
    const message = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        success: false,
        message: 'Ошибка при загрузке вакансий',
        details: message,
      },
      { status: 500 }
    );
  }
}
