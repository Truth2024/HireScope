import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { CANDIDATES_LIMIT } from '@constants/constants';
import User from '@models/User';
import type { IUserMongo, UserFilter } from '@myTypes/mongoTypes';
import connectDB from 'src/shared/lib/mongodb';

const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export async function GET(req: Request) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    let isAuthorized = false;

    if (refreshToken) {
      try {
        jwt.verify(refreshToken, REFRESH_SECRET);
        isAuthorized = true;
      } catch {
        isAuthorized = false;
      }
    }

    const url = new URL(req.url);
    const pageParam = Number(url.searchParams.get('page'));
    const page = !isNaN(pageParam) && pageParam > 0 ? pageParam : 1;
    const search = url.searchParams.get('search')?.trim() || '';
    const skills = url.searchParams.get('skills')?.split(',').filter(Boolean) || [];
    const skip = (page - 1) * CANDIDATES_LIMIT;

    const filter: UserFilter = { role: 'candidate' };

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ firstName: regex }, { surname: regex }, { secondName: regex }];
    }

    if (skills.length > 0) {
      filter.skills = { $in: skills };
    }

    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / CANDIDATES_LIMIT);

    const users = await User.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(CANDIDATES_LIMIT)
      .lean();

    const formattedCandidates = users.map((u: IUserMongo) => ({
      id: u._id.toString(),
      firstName: u.firstName,
      surname: u.surname,
      secondName: u.secondName,
      skills: u.skills,
      experience:
        u.experience?.map((exp) => ({
          company: exp.company,
          position: exp.position,
          years: exp.years,
        })) ?? [],
      createdAt: u.createdAt.toString(),
      avatar: isAuthorized ? (u.avatar ?? null) : null,
      avatarBlur: u.avatarBlur ?? null,
    }));

    return NextResponse.json({
      success: true,
      candidates: formattedCandidates,
      total,
      totalPages,
      currentPage: page,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return NextResponse.json(
      {
        success: false,
        message: 'Ошибка при загрузке кандидатов',
        details: message,
      },
      { status: 500 }
    );
  }
}
