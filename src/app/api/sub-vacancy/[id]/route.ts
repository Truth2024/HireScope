import mongoose from 'mongoose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getAuthUser } from '@lib/auth';
import connectToDatabase from '@lib/mongodb';
import { pusherServer } from '@lib/pusherServer';
import Candidate from '@models/Candidate';
import { Notification } from '@models/Notification';
import User from '@models/User';
import Vacancy from '@models/Vacancy';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await connectToDatabase();

    const { id: vacancyId } = await params;

    if (!mongoose.Types.ObjectId.isValid(vacancyId)) {
      return NextResponse.json({ message: 'Invalid vacancy ID' }, { status: 400 });
    }

    const { candidateId } = await req.json();
    if (!candidateId || !mongoose.Types.ObjectId.isValid(candidateId)) {
      return NextResponse.json({ message: 'Invalid candidate ID' }, { status: 400 });
    }

    const candidateUser = await getAuthUser(req);
    if (!candidateUser) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const vacancy = await Vacancy.findOne({ _id: vacancyId }).session(session);
    if (!vacancy) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ message: 'Vacancy not found' }, { status: 404 });
    }

    const hrUser = await User.findById(vacancy.createdBy).session(session);
    if (!hrUser) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ message: 'HR user not found' }, { status: 404 });
    }

    if (vacancy.candidates.includes(candidateUser._id)) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ message: 'Candidate already applied' });
    }

    const matchScore = calculateMatchScore(candidateUser.skills, vacancy.requirements || []);
    vacancy.candidates.push(candidateUser._id);
    await vacancy.save({ session });

    const newCandidate = new Candidate({
      userId: candidateUser._id,
      vacancyId: vacancy._id,
      status: 'new',
      appliedAt: new Date(),
      matchScore,
    });
    await newCandidate.save({ session });

    const notificationData = {
      candidateId: candidateUser._id.toString(),
      vacancyId: vacancy._id.toString(),
      firstName: candidateUser.firstName,
      secondName: candidateUser.secondName,
      avatar: candidateUser.avatar || null,
      matchScore,
      title: vacancy.title,
      company: vacancy.company || vacancy.title,
    };

    const [notification] = await Notification.create(
      [
        {
          userId: hrUser._id,
          type: 'new_candidate',
          data: notificationData,
        },
      ],
      { session }
    );

    await User.updateOne({ _id: hrUser._id }, { $inc: { unreadNotifications: 1 } }).session(
      session
    );

    await session.commitTransaction();
    session.endSession();

    try {
      await pusherServer.trigger(`user-${hrUser._id}`, 'notification', {
        type: 'new_candidate',
        ...notificationData,
        notificationId: notification._id.toString(),
      });
    } catch {}

    return NextResponse.json({ message: 'Candidate applied successfully', result: 'success' });
  } catch (error: unknown) {
    await session.abortTransaction();
    session.endSession();

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Internal server error', error: errorMessage },
      { status: 500 }
    );
  }
}

function calculateMatchScore(userSkills: string[], vacancyRequirements: string[]): number | null {
  if (!vacancyRequirements.length) return null;
  const matches = vacancyRequirements.filter((skill) => userSkills.includes(skill));
  return Math.round((matches.length / vacancyRequirements.length) * 100);
}
