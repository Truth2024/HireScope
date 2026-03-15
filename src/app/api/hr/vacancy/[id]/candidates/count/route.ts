import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import connectDB from '@lib/mongodb';
import Candidate from '@models/Candidate';
import Vacancy from '@models/Vacancy';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get('refreshToken')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET!) as { userId: string };

    const vacancy = await Vacancy.findById(id).select('createdBy').lean();

    if (!vacancy || vacancy.createdBy?.toString() !== decoded.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const count = await Candidate.countDocuments({ vacancyId: id });

    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ error: `Internal server error ${error}` }, { status: 500 });
  }
}
