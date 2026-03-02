import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { VACANCY_LIMIT } from '@constants/constants';
import User from '@models/User';
import Vacancy from '@models/Vacancy';
import type { IVacancyMongo, VacancyFilter } from '@myTypes/mongoTypes';
import connectDB from 'src/shared/lib/mongodb';

export async function GET(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _registerModels = User;

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const pageParam = Number(searchParams.get('page'));
    const page = !isNaN(pageParam) && pageParam > 0 ? pageParam : 1;
    const search = searchParams.get('search')?.trim() || '';
    const skills = searchParams.get('skills')?.split(',').filter(Boolean) || [];

    const skip = (page - 1) * VACANCY_LIMIT;

    const filter: VacancyFilter = {};

    const conditions = [];

    if (search) {
      const regex = new RegExp(search, 'i');
      conditions.push({ title: regex }, { description: regex });
    }

    if (skills.length > 0) {
      conditions.push({ requirements: { $in: skills } });
    }

    if (conditions.length > 0) {
      filter.$or = conditions;
    }

    const total = await Vacancy.countDocuments(filter);
    const totalPages = Math.ceil(total / VACANCY_LIMIT);

    const vacancies = await Vacancy.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(VACANCY_LIMIT)
      .lean();

    const formattedVacancies = vacancies.map((v: IVacancyMongo) => ({
      id: v._id.toString(),
      title: v.title,
      description: v.description.substring(0, 120) + (v.description.length > 120 ? '...' : ''),
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

    return NextResponse.json({
      success: true,
      vacancies: formattedVacancies,
      total,
      totalPages,
      currentPage: page,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';

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
