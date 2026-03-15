import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getAuthUser } from '@lib/auth';
import connectDB from '@lib/mongodb';
import Candidate from '@models/Candidate';
import Vacancy from '@models/Vacancy';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ candidateId: string }> }
) {
  try {
    const { candidateId } = await params;
    const { note } = await request.json();

    if (typeof note !== 'string') {
      return NextResponse.json({ error: 'Invalid note' }, { status: 400 });
    }

    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    await connectDB();

    const candidate = await Candidate.findById(candidateId).lean();

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    const vacancy = await Vacancy.findById(candidate.vacancyId).select('createdBy').lean();

    if (!vacancy || vacancy.createdBy?.toString() !== user._id.toString()) {
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
