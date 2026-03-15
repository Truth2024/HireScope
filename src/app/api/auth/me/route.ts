import type mongoose from 'mongoose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getAuthUser } from '@lib/auth';
import connectToDatabase from 'src/shared/lib/mongodb';

type ExperienceDocument = {
  _id?: mongoose.Types.ObjectId;
  company?: string;
  position?: string;
  years?: number;
};

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          firstName: user.firstName,
          surname: user.surname,
          secondName: user.secondName,
          email: user.email,
          role: user.role,
          avatar: user.avatar ?? null,
          avatarBlur: user.avatarBlur ?? null,
          skills: user.skills ?? [],
          experience: (user.experience || []).map((exp: ExperienceDocument) => ({
            id: exp._id?.toString(),
            company: exp.company,
            position: exp.position,
            years: exp.years,
          })),
          createdAt: user.createdAt.toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (e: unknown) {
    return NextResponse.json({ error: `Internal server error ${e}` }, { status: 500 });
  }
}
