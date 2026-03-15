import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { cookies } from 'next/headers';

import { COMMENTS_LIMIT, VACANCY_LIMIT } from '@constants/constants';
import connectDB from '@lib/mongodb';
import Comment from '@models/Comment';
import User from '@models/User';
import Vacancy from '@models/Vacancy';
import type {
  CommentWithUser,
  IUserMongo,
  IVacancy,
  IVacancyMongo,
  VacancyFilter,
} from '@myTypes/mongoTypes';

export type VacancyServiceResult =
  | { status: 'success'; data: IVacancy }
  | { status: 'notFound' }
  | { status: 'error'; code: number; message: string };

export const vacancyServiceById = async (
  vacancyId: string,
  page: number = 1
): Promise<VacancyServiceResult> => {
  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(vacancyId)) {
      return { status: 'notFound' };
    }
    const cookieStore = await cookies();
    const token = cookieStore.get('refreshToken')?.value;
    let currentUserId: string | null = null;
    let isAuthorized = false;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.REFRESH_SECRET!) as { userId: string };
        currentUserId = decoded.userId;
        const authUser: IUserMongo | null = await User.findById(currentUserId).lean();
        if (authUser) isAuthorized = true;
      } catch {
        isAuthorized = false;
      }
    }

    const vacancy = await Vacancy.findById(vacancyId).lean();

    if (!vacancy) {
      return { status: 'notFound' };
    }

    const commentsStats = await Comment.aggregate([
      { $match: { vacancy: new mongoose.Types.ObjectId(vacancyId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          distribution: { $push: '$rating' },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          averageRating: { $round: ['$averageRating', 1] },
          distribution: {
            $arrayToObject: {
              $map: {
                input: [1, 2, 3, 4, 5],
                as: 'rating',
                in: {
                  k: { $toString: '$$rating' },
                  v: {
                    $size: {
                      $filter: {
                        input: '$distribution',
                        as: 'r',
                        cond: { $eq: ['$$r', '$$rating'] },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    const skip = (page - 1) * COMMENTS_LIMIT;

    const comments = await Comment.find({ vacancy: vacancyId })
      .populate({
        path: 'user',
        select: 'firstName surname secondName avatar avatarBlur email',
      })
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(COMMENTS_LIMIT)
      .lean();

    const totalComments = commentsStats[0]?.total || 0;

    const formattedComments = comments.map((comment: CommentWithUser) => ({
      _id: comment._id.toString(),
      text: comment.text,
      rating: comment.rating,
      createdAt: comment.createdAt.toISOString(),
      user: {
        _id: comment.user._id.toString(),
        firstName: comment.user.firstName,
        surname: comment.user.surname,
        secondName: comment.user.secondName,
        avatar: isAuthorized ? (comment.user.avatar ?? null) : (comment.user.avatarBlur ?? null),
        avatarBlur: comment.user.avatarBlur ?? null,
      },
    }));

    const hasApplied =
      vacancy.candidates?.some(
        (candidateId: mongoose.Types.ObjectId) => candidateId.toString() === currentUserId
      ) ?? false;

    const formattedVacancy: IVacancy = {
      id: vacancy._id.toString(),
      title: vacancy.title,
      description: vacancy.description ?? '',
      requirements: Array.isArray(vacancy.requirements) ? vacancy.requirements : [],
      company: vacancy.company ?? '',
      salary: vacancy.salary ?? null,
      department: vacancy.department ?? null,
      rating: vacancy.rating ?? 0,
      comments: formattedComments,
      commentsCount: totalComments,
      ratingDistribution: commentsStats[0]?.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      createdBy: vacancy.createdBy?.toString() || null,
      isOwner: currentUserId ? vacancy.createdBy?.toString() === currentUserId : false,
      hasApplied,
      createdAt:
        vacancy.createdAt instanceof Date
          ? vacancy.createdAt.toISOString()
          : new Date().toISOString(),
    };

    return {
      status: 'success',
      data: JSON.parse(JSON.stringify(formattedVacancy)),
    };
  } catch {
    return {
      status: 'error',
      code: 500,
      message: 'Failed to fetch vacancy',
    };
  }
};

export type VacanciesServiceResult =
  | {
      status: 'success';
      data: {
        vacancies: IVacancy[];
        total: number;
        totalPages: number;
        currentPage: number;
      };
    }
  | { status: 'error'; code: number; message: string }
  | { status: 'empty' };

export const vacanciesServiceAll = async (
  page: number = 1,
  searchParam: string = '',
  skillsParam: string[] = [],
  sortParam: string = 'newest',
  limit: number = VACANCY_LIMIT
): Promise<VacanciesServiceResult> => {
  try {
    await connectDB();

    const skip = (page - 1) * limit;
    const filter: VacancyFilter = {};

    if (searchParam.trim()) {
      const escaped = searchParam.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }

    if (skillsParam.length > 0) {
      filter.requirements = { $all: skillsParam };
    }

    let sortOption = {};
    switch (sortParam) {
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
    const totalPages = Math.ceil(total / limit);

    const vacancies = await Vacancy.find(filter)
      .populate('createdBy', 'name')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    if (vacancies.length === 0) {
      return { status: 'empty' };
    }

    const formattedVacancies: IVacancy[] = vacancies.map((vacancy: IVacancyMongo) => ({
      id: vacancy._id.toString(),
      title: vacancy.title,
      description: vacancy.description,
      requirements: Array.isArray(vacancy.requirements) ? vacancy.requirements : [],
      company: vacancy.company,
      salary: vacancy.salary
        ? {
            min: vacancy.salary.min ?? null,
            max: vacancy.salary.max ?? null,
          }
        : null,
      department: vacancy.department ?? null,
      rating: vacancy.rating ?? 0,
      comments: [],
      commentsCount: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      createdBy: vacancy.createdBy?.toString() || null,
      createdAt:
        vacancy.createdAt instanceof Date
          ? vacancy.createdAt.toISOString()
          : new Date().toISOString(),
    }));

    return {
      status: 'success',
      data: {
        vacancies: JSON.parse(JSON.stringify(formattedVacancies)),
        total,
        totalPages,
        currentPage: page,
      },
    };
  } catch {
    return {
      status: 'error',
      code: 500,
      message: 'Failed to fetch vacancies',
    };
  }
};
