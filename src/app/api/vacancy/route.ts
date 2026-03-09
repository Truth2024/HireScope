import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { VACANCY_LIMIT } from '@constants/constants';
import Vacancy from '@models/Vacancy';
import type { IVacancyMongo, VacancyFilter } from '@myTypes/mongoTypes';
import connectDB from 'src/shared/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const pageParam = Number(searchParams.get('page'));
    const page = !isNaN(pageParam) && pageParam > 0 ? pageParam : 1;
    const search = searchParams.get('search')?.trim() || '';
    const skills = searchParams.get('skills')?.split(',').filter(Boolean) || [];
    const minSalary = searchParams.get('minSalary')
      ? Number(searchParams.get('minSalary'))
      : undefined;
    const maxSalary = searchParams.get('maxSalary')
      ? Number(searchParams.get('maxSalary'))
      : undefined;
    const sort = searchParams.get('sort') || 'newest';

    const skip = (page - 1) * VACANCY_LIMIT;

    const filter: VacancyFilter = {};

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }

    if (skills.length > 0) {
      filter.requirements = { $all: skills };
    }

    // Фильтр по зарплате
    if (minSalary !== undefined || maxSalary !== undefined) {
      filter.salary = { $and: [] };

      if (minSalary !== undefined) {
        filter.salary.$and?.push({
          'salary.max': { $gte: minSalary },
        });
      }

      if (maxSalary !== undefined) {
        filter.salary.$and?.push({
          'salary.min': { $lte: maxSalary },
        });
      }
    }

    // Определяем сортировку
    let sortOption = {};
    switch (sort) {
      case 'rating':
        sortOption = { rating: -1, createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1, _id: 1 };
        break;
      case 'salary_high':
        sortOption = { 'salary.max': -1, 'salary.min': -1, createdAt: -1 };
        break;
      case 'salary_low':
        sortOption = { 'salary.min': 1, 'salary.max': 1, createdAt: -1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1, _id: -1 };
        break;
    }

    const total = await Vacancy.countDocuments(filter);
    const totalPages = Math.ceil(total / VACANCY_LIMIT);

    const vacancies = await Vacancy.find(filter)
      .populate('createdBy', 'name')
      .sort(sortOption)
      .skip(skip)
      .limit(VACANCY_LIMIT)
      .lean();

    const formattedVacancies = vacancies.map((v: IVacancyMongo) => ({
      id: v._id.toString(),
      title: v.title,
      description: v.description.substring(0, 120) + (v.description.length > 120 ? '...' : ''),
      company: v.company,

      salary: v.salary ?? null,
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
