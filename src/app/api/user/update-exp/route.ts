import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

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

    const { experience } = await req.json();

    if (!Array.isArray(experience)) {
      return NextResponse.json({ message: 'Experience must be an array' }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(decoded.userId, { experience }, { new: true }).select(
      '-password'
    );

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Experience updated successfully',
      result: 'success',
    });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
  }
}
