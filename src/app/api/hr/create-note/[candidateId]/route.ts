import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import connectDB from '@lib/mongodb';
import Candidate from '@models/Candidate';
import Vacancy from '@models/Vacancy';

const ACCESS_SECRET = process.env.ACCESS_SECRET!;

type RouteParams = {
  params: {
    candidateId: string;
  };
};

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { candidateId } = await params;
    const { note } = await request.json();

    if (typeof note !== 'string') {
      return NextResponse.json({ error: 'Invalid note' }, { status: 400 });
    }

    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    const { userId } = jwt.verify(token, ACCESS_SECRET) as { userId: string };

    await connectDB();

    const candidate = await Candidate.findById(candidateId).lean();

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    const vacancy = await Vacancy.findById(candidate.vacancyId).select('createdBy').lean();

    if (!vacancy || vacancy.createdBy?.toString() !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const updatedCandidate = await Candidate.findByIdAndUpdate(
      candidateId,
      { notes: note },
      { new: true }
    ).lean();

    return NextResponse.json({
      success: true,
      note: updatedCandidate?.notes ?? null,
    });
  } catch (error) {
    return NextResponse.json({ error: `Internal error: ${error}` }, { status: 500 });
  }
}
