import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import SKILLS from '@constants/skills';
import User from '@models/User';
import connectDB from 'src/shared/lib/mongodb';

const ACCESS_SECRET = process.env.ACCESS_SECRET!;

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    let decoded;
    try {
      decoded = jwt.verify(token, ACCESS_SECRET) as { userId: string };
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
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
      decoded.userId,
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

    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    let decoded;
    try {
      decoded = jwt.verify(token, ACCESS_SECRET) as { userId: string };
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const user = await User.findById(decoded.userId).select('skills');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      skills: user.skills || [],
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error', error: `${error}` },
      { status: 500 }
    );
  }
}
