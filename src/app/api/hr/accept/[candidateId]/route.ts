import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import connectDB from '@lib/mongodb';
import { pusherServer } from '@lib/pusherServer';
import Candidate from '@models/Candidate';
import Vacancy from '@models/Vacancy';

const ACCESS_SECRET = process.env.ACCESS_SECRET!;

type RouteParams = {
  params: {
    candidateId: string;
  };
};

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { candidateId } = await params;

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { userId } = jwt.verify(token, ACCESS_SECRET) as { userId: string };

    await connectDB();

    // Находим кандидата
    const candidate = await Candidate.findById(candidateId).lean();
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    // Находим вакансию с полем candidates
    const vacancy = await Vacancy.findById(candidate.vacancyId)
      .select('createdBy title company candidates')
      .lean();

    if (!vacancy || vacancy.createdBy?.toString() !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Удаляем кандидата из массива candidates в вакансии
    await Vacancy.updateOne(
      { _id: candidate.vacancyId },
      { $pull: { candidates: candidate.userId } }
    );

    // Удаляем самого кандидата
    await Candidate.findByIdAndDelete(candidateId);

    // Отправляем уведомление через Pusher
    await pusherServer.trigger(`user-${candidate.userId}`, 'notification', {
      type: 'candidate-accepted',
      vacancyId: candidate.vacancyId,
      title: vacancy.title,
      company: vacancy.company || vacancy.title,
      message: 'Работодатель вас принял',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal error: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
