import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { COMMENTS_LIMIT } from '@constants/constants';
import { getAuthUser } from '@lib/auth';
import Comment from '@models/Comment';
import User from '@models/User';
import Vacancy from '@models/Vacancy';
import type { CommentWithUser } from '@myTypes/mongoTypes';
import connectDB from 'src/shared/lib/mongodb';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const { id } = await params;

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page')) || 1;

    const token = req.cookies.get('refreshToken')?.value;

    let isAuthorized = false;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.REFRESH_SECRET!) as { userId: string };
        const authUser = await User.findById(decoded.userId).lean();
        if (authUser) isAuthorized = true;
      } catch {
        isAuthorized = false;
      }
    }

    const objectId = new mongoose.Types.ObjectId(id);

    const stats = await Comment.aggregate([
      { $match: { vacancy: objectId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          distribution: { $push: '$rating' },
        },
      },
    ]);

    const total = stats[0]?.total || 0;

    const skip = (page - 1) * COMMENTS_LIMIT;

    const comments = await Comment.find({ vacancy: objectId })
      .populate({
        path: 'user',
        select: 'firstName surname secondName avatar avatarBlur email',
      })
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(COMMENTS_LIMIT)
      .lean();

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
      },
    }));

    return NextResponse.json({
      comments: formattedComments,
      total,
      page,
      totalPages: Math.ceil(total / COMMENTS_LIMIT),
    });
  } catch (error) {
    return NextResponse.json({ message: `Something went wrong. Error: ${error}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const { text, rating } = await req.json();
    const user = await getAuthUser(req);

    const comment = await Comment.create({
      text,
      rating,
      vacancy: new mongoose.Types.ObjectId(id),
      user: user._id,
    });

    const vacancy = await Vacancy.findById(id);
    if (vacancy) {
      vacancy.comments.push(comment._id);
      await vacancy.updateRating();
    }

    const populatedComment = await comment.populate({
      path: 'user',
      select: 'firstName surname secondName avatar avatarBlur email',
    });

    const updatedVacancy = await Vacancy.findById(id).select('rating commentsStats').lean();

    return NextResponse.json({
      comment: {
        _id: populatedComment._id.toString(),
        text: populatedComment.text,
        rating: populatedComment.rating,
        createdAt: populatedComment.createdAt.toISOString(),
        user: {
          _id: populatedComment.user._id.toString(),
          firstName: populatedComment.user.firstName,
          surname: populatedComment.user.surname,
          secondName: populatedComment.user.secondName,
          avatar: populatedComment.user.avatar ?? null,
          avatarBlur: populatedComment.user.avatarBlur ?? null,
        },
      },
      stats: {
        totalComments: updatedVacancy?.commentsStats?.total || 0,
        averageRating: updatedVacancy?.rating || 0,
        ratingDistribution: updatedVacancy?.commentsStats?.distribution || {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        },
      },
      total: updatedVacancy?.commentsStats?.total || 0,
    });
  } catch (err) {
    return NextResponse.json(
      { message: (err as Error).message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
