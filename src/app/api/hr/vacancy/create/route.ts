import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import connectToDatabase from '@lib/mongodb';
import Vacancy from '@models/Vacancy';

const ACCESS_SECRET = process.env.ACCESS_SECRET!;

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    let decoded: { userId: string };

    try {
      decoded = jwt.verify(token, ACCESS_SECRET) as { userId: string };
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { title, requirements, description, salary, company } = await req.json();

    if (!title || !requirements || !description || !company) {
      return NextResponse.json(
        { message: 'Missing required fields: title, requirements, description, company' },
        { status: 400 }
      );
    }

    if (!Array.isArray(requirements) || requirements.length === 0) {
      return NextResponse.json(
        { message: 'Requirements must be a non-empty array' },
        { status: 400 }
      );
    }

    const newVacancy = await Vacancy.create({
      title,
      requirements,
      description,
      salary: {
        min: salary?.min ?? null,
        max: salary?.max ?? null,
      },
      company,
      createdBy: decoded.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        message: 'Vacancy created successfully',
        result: 'success',
        data: newVacancy,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Internal server error', error: errorMessage },
      { status: 500 }
    );
  }
}
