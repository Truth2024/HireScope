import jwt from 'jsonwebtoken';
import type { Types } from 'mongoose';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { CANDIDATES_LIMIT_IN_VACANCY } from '@constants/constants';
import connectDB from '@lib/mongodb';
import Candidate from '@models/Candidate';
import User from '@models/User';
import Vacancy from '@models/Vacancy';
import type { ICandidate, IUserMongo } from '@myTypes/mongoTypes';

type CandidatePopulated = {
  _id: Types.ObjectId;
  userId: IUserMongo | null;
  vacancyId: Types.ObjectId;
  status: 'new' | 'viewed' | 'interview' | 'offer' | 'rejected';
  matchScore?: number | null;
  notes?: string | null;
  appliedAt: Date;
};

type UserDocument = {
  _id: Types.ObjectId;
  firstName: string;
  surname: string;
  secondName: string;
  email: string;
  role: 'hr' | 'candidate';
  avatar?: string | null;
  avatarBlur?: string | null;
  skills: string[];
  experience?: Array<{
    company?: string;
    position?: string;
    years?: number;
  }>;
  createdAt: Date;
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = CANDIDATES_LIMIT_IN_VACANCY;
    const searchQuery = searchParams.get('search') || '';
    const hasExperienceParam = searchParams.get('hasExperience') === 'true';

    // ПАРАМЕТРЫ СОРТИРОВКИ
    const sortBy = searchParams.get('sortBy') || 'matchScore';
    const order = searchParams.get('order') || 'desc';

    if (page < 1) {
      return NextResponse.json({ error: 'Invalid pagination parameters' }, { status: 400 });
    }

    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get('refreshToken')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let currentUserId: string | null = null;
    let isAuthorized = false;

    try {
      const decoded = jwt.verify(token, process.env.REFRESH_SECRET!) as { userId: string };
      currentUserId = decoded.userId;
      const authUser = await User.findById(currentUserId).lean<UserDocument>();
      if (authUser) isAuthorized = true;
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const vacancy = await Vacancy.findById(id).select('createdBy').lean();
    if (!vacancy) {
      return NextResponse.json({ error: 'Vacancy not found' }, { status: 404 });
    }

    const isOwner = currentUserId ? vacancy.createdBy?.toString() === currentUserId : false;
    if (!isOwner) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const skip = (page - 1) * limit;

    const candidatesQuery: Record<string, unknown> = { vacancyId: id };
    const allCandidates = await Candidate.find({ vacancyId: id }).select('userId').lean();
    const candidateUserIds = allCandidates
      .map((doc) => doc.userId)
      .filter((uid): uid is Types.ObjectId => uid !== null);

    let matchingUserIds = candidateUserIds;

    if (searchQuery.trim()) {
      const searchRegex = new RegExp(searchQuery.trim(), 'i');
      const users = await User.find({
        _id: { $in: candidateUserIds },
        $or: [{ firstName: searchRegex }, { surname: searchRegex }, { secondName: searchRegex }],
      })
        .select('_id')
        .lean();
      matchingUserIds = users.map((u) => u._id);
    }

    if (hasExperienceParam && matchingUserIds.length > 0) {
      const usersWithExp = await User.find({
        _id: { $in: matchingUserIds },
        'experience.0': { $exists: true },
      })
        .select('_id')
        .lean();
      matchingUserIds = usersWithExp.map((u) => u._id);
    }

    candidatesQuery.userId = { $in: matchingUserIds };

    const sortOptions: Record<string, 1 | -1> = {
      [sortBy]: order === 'asc' ? 1 : -1,
    };

    const [candidates, total] = await Promise.all([
      Candidate.find(candidatesQuery)
        .populate<{ userId: IUserMongo | null }>({
          path: 'userId',
          model: User,
          select: isAuthorized
            ? 'firstName surname secondName email avatar avatarBlur experience skills role createdAt'
            : 'firstName surname secondName avatarBlur experience skills role createdAt',
        })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean<CandidatePopulated[]>(),
      Candidate.countDocuments(candidatesQuery),
    ]);

    const formattedCandidates: ICandidate[] = candidates.map((candidate) => {
      const userData = candidate.userId;
      return {
        id: candidate._id.toString(),
        userId: userData?._id.toString() ?? '',
        user: userData
          ? {
              id: userData._id.toString(),
              firstName: userData.firstName,
              surname: userData.surname,
              secondName: userData.secondName,
              email: isAuthorized ? userData.email : '',
              role: userData.role,
              avatar: userData.avatar ?? null,
              avatarBlur: userData.avatarBlur ?? null,
              experience: userData.experience ?? [],
              skills: userData.skills,
              createdAt: userData.createdAt.toString(),
            }
          : undefined,
        vacancyId: candidate.vacancyId.toString(),
        status: candidate.status,
        matchScore: candidate.matchScore ?? null,
        notes: candidate.notes ?? null,
        appliedAt: candidate.appliedAt.toISOString(),
      };
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      candidates: formattedCandidates,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      sortBy,
      order,
    });
  } catch (error) {
    return NextResponse.json({ error: `Internal error: ${error}` }, { status: 500 });
  }
}
