import jwt from 'jsonwebtoken';
import type { SortOrder } from 'mongoose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { VACANCY_LIMIT } from '@constants/constants';
import Vacancy from '@models/Vacancy';
import type { IVacancy, IVacancyMongo, VacancyFilter } from '@myTypes/mongoTypes';
import connectDB from 'src/shared/lib/mongodb';

export async function GET(req: Request) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    let isAuthorized = false;

    if (refreshToken) {
      try {
        jwt.verify(refreshToken, process.env.REFRESH_SECRET!);
        isAuthorized = true;
      } catch {
        isAuthorized = false;
      }
    }

    const { searchParams } = new URL(req.url);
    const pageParam = Number(searchParams.get('page'));
    const page = !isNaN(pageParam) && pageParam > 0 ? pageParam : 1;

    const search = searchParams.get('search')?.trim() || '';
    const skills = searchParams.get('skills')?.split(',').filter(Boolean) || [];
    const sortParam = searchParams.get('sort') || 'newest';

    const skip = (page - 1) * VACANCY_LIMIT;

    const filter: VacancyFilter = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }
    if (skills.length > 0) {
      filter.requirements = { $all: skills };
    }

    const sortOptions: Record<string, Record<string, SortOrder>> = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      salary: { 'salary.max': -1 },
    };
    const sort = sortOptions[sortParam];

    const [totalResult, vacancies] = await Promise.all([
      Vacancy.countDocuments(filter),
      Vacancy.find(filter).sort(sort).skip(skip).limit(VACANCY_LIMIT).lean<IVacancyMongo[]>(),
    ]);

    const totalPages = Math.ceil(totalResult / VACANCY_LIMIT);

    const formattedVacancies: IVacancy[] = vacancies.map((v) => ({
      id: v._id.toString(),
      title: v.title,
      description: v.description || '',
      requirements: v.requirements || [],
      company: v.company || '',
      salary: v.salary
        ? {
            min: v.salary.min ?? null,
            max: v.salary.max ?? null,
          }
        : null,
      department: v.department || null,
      rating: v.rating || 0,
      commentsStats: v.commentsStats || null,
      createdAt: v.createdAt instanceof Date ? v.createdAt.toISOString() : new Date().toISOString(),
      createdBy: isAuthorized ? v.createdBy?.toString() || null : null,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      commentsCount: 0,
    }));

    return NextResponse.json({
      vacancies: formattedVacancies,
      totalResult,
      totalPages,
      currentPage: page,
    });
  } catch (error: unknown) {
    const details = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return NextResponse.json(
      { success: false, message: 'Ошибка при загрузке вакансий', details },
      { status: 500 }
    );
  }
}
