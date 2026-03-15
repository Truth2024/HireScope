import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getAuthUser } from '@lib/auth';
import connectDB from '@lib/mongodb';
import { pusherServer } from '@lib/pusherServer';
import Candidate from '@models/Candidate';
import { Notification } from '@models/Notification';
import User from '@models/User';
import Vacancy from '@models/Vacancy';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ candidateId: string }> }
) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { candidateId } = await params;

    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    await connectDB();

    const candidate = await Candidate.findById(candidateId).session(session);
    if (!candidate) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    const vacancy = await Vacancy.findById(candidate.vacancyId)
      .select('createdBy title company candidates')
      .session(session)
      .lean();

    if (!vacancy || vacancy.createdBy?.toString() !== user._id.toString()) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const targetUserId = candidate.userId;

    await Vacancy.updateOne(
      { _id: candidate.vacancyId },
      { $pull: { candidates: candidate.userId } }
    ).session(session);

    await Candidate.findByIdAndDelete(candidateId).session(session);

    const notificationData = {
      candidateId: candidate._id.toString(),
      vacancyId: candidate.vacancyId.toString(),
      title: vacancy.title,
      company: vacancy.company || vacancy.title,
      message: 'Работодатель отклонил вашу кандидатуру',
      firstName: user.firstName,
      secondName: user.secondName,
      avatar: user.avatar || null,
      matchScore: candidate.matchScore || 0,
    };

    const [notification] = await Notification.create(
      [
        {
          userId: targetUserId,
          type: 'candidate-rejected',
          data: notificationData,
        },
      ],
      { session }
    );

    await User.updateOne({ _id: targetUserId }, { $inc: { unreadNotifications: 1 } }).session(
      session
    );

    await session.commitTransaction();
    session.endSession();

    await pusherServer.trigger(`user-${targetUserId}`, 'notification', {
      type: 'candidate-rejected',
      ...notificationData,
      notificationId: notification._id.toString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return NextResponse.json(
      { error: `Internal error: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
