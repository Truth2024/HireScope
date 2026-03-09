import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import connectToDatabase from '@lib/mongodb';
import { pusherServer } from '@lib/pusherServer';
import Candidate from '@models/Candidate';
import User from '@models/User';
import Vacancy from '@models/Vacancy';

const ACCESS_SECRET = process.env.ACCESS_SECRET!;

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Проверка токена
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let decoded: { userId: string };
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      decoded = jwt.verify(authHeader.replace('Bearer ', ''), ACCESS_SECRET) as { userId: string };
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Находим вакансию
    const vacancy = await Vacancy.findOne({ _id: vacancyId });
    if (!vacancy) {
      return NextResponse.json({ message: 'Vacancy not found' }, { status: 404 });
    }

    const user = await User.findById(candidateId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Проверяем, что этот пользователь ещё не добавлен в кандидаты вакансии
    if (vacancy.candidates.includes(user._id)) {
      return NextResponse.json({ message: 'Candidate already applied' });
    }
    // Добавляем кандидата
    const matchScore = calculateMatchScore(user.skills || [], vacancy.requirements || []);
    vacancy.candidates.push(user._id);
    await vacancy.save();
    // Создаём документ Candidate
    const newCandidate = new Candidate({
      userId: user._id,
      vacancyId: vacancy._id,
      status: 'new',
      appliedAt: new Date(),
      matchScore,
    });
    await newCandidate.save();
    // Триггерим пушер уведомление для HR (создателя вакансии)
    try {
      await pusherServer.trigger(`user-${vacancy.createdBy}`, 'notification', {
        type: 'new_candidate',
        candidateId: user._id,
        firstName: user.firstName,
        secondName: user.secondName,
        avatar: user.avatar,
        matchScore,
        vacancyId: vacancy._id,
      });
    } catch {}

    return NextResponse.json({ message: 'Candidate applied successfully', result: 'success' });
  } catch (error: unknown) {
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
