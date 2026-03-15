import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import SKILLS from '@constants/skills';
import { getAuthUser } from '@lib/auth';
import User from '@models/User';
import connectDB from 'src/shared/lib/mongodb';

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const decoded = await getAuthUser(req);
    if (!decoded) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }
    const { skills } = await req.json();

    if (!Array.isArray(skills)) {
      return NextResponse.json({ message: 'Skills must be an array' }, { status: 400 });
    }

    const invalidSkills = skills.filter((skill) => !SKILLS.includes(skill));
    if (invalidSkills.length > 0) {
      return NextResponse.json(
        {
          message: 'Invalid skills provided',
          invalidSkills,
        },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      decoded._id,
      { skills: skills },
      { new: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Skills updated successfully',
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        surname: user.surname,
        secondName: user.secondName,
        email: user.email,
        skills: user.skills,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }
    return NextResponse.json({
      skills: user.skills,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error', error: `${error}` },
      { status: 500 }
    );
  }
}
