import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getAuthUser } from '@lib/auth';
import connectToDatabase from '@lib/mongodb';
import Vacancy from '@models/Vacancy';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const user = await getAuthUser(req);

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
      createdBy: user._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
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
