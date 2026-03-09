import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import connectToDatabase from '@lib/mongodb';
import Candidate from '@models/Candidate';
import Vacancy from '@models/Vacancy';

const ACCESS_SECRET = process.env.ACCESS_SECRET!;

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const p = await params;

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

    const vacancyId = p.id;
    const { title, requirements, description, salary, company } = await req.json();

    const updatedVacancy = await Vacancy.findOneAndUpdate(
      {
        _id: vacancyId,
        createdBy: decoded.userId,
      },
      {
        $set: {
          title,
          requirements,
          description,
          salary: {
            min: salary?.min ?? null,
            max: salary?.max ?? null,
          },
          company,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedVacancy) {
      return NextResponse.json(
        { message: 'Vacancy not found or you do not have permission to edit it' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      message: 'Vacancy updated successfully',
      result: 'success',
      data: updatedVacancy,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Internal server error', error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { id: vacancyId } = await params;

    // Проверка токена
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let decoded: { userId: string };
    try {
      decoded = jwt.verify(authHeader.replace('Bearer ', ''), ACCESS_SECRET) as { userId: string };
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Удаляем вакансию
    const deletedVacancy = await Vacancy.findOneAndDelete({
      _id: vacancyId,
      createdBy: decoded.userId,
    });

    if (!deletedVacancy) {
      return NextResponse.json(
        { message: 'Vacancy not found or you do not have permission to delete it' },
        { status: 403 }
      );
    }

    // Удаляем всех кандидатов, связанных с этой вакансией
    await Candidate.deleteMany({ vacancyId: vacancyId });

    return NextResponse.json({
      message: 'Vacancy and related candidates deleted successfully',
      result: 'success',
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Internal server error', error: errorMessage },
      { status: 500 }
    );
  }
}
