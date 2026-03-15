import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getAuthUser } from '@lib/auth';
import connectToDatabase from '@lib/mongodb';
import Candidate from '@models/Candidate';
import Vacancy from '@models/Vacancy';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const p = await params;
    const user = await getAuthUser(req);

    const vacancyId = p.id;
    const { title, requirements, description, salary, company } = await req.json();

    const updatedVacancy = await Vacancy.findOneAndUpdate(
      {
        _id: vacancyId,
        createdBy: user._id,
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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id: vacancyId } = await params;

    const user = await getAuthUser(req);

    // Удаляем вакансию
    const deletedVacancy = await Vacancy.findOneAndDelete({
      _id: vacancyId,
      createdBy: user._id,
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
