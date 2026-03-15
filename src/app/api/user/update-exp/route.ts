import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getAuthUser } from '@lib/auth';
import User from '@models/User';
import connectDB from 'src/shared/lib/mongodb';

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const decoded = await getAuthUser(req);

    const { experience } = await req.json();

    if (!Array.isArray(experience)) {
      return NextResponse.json({ message: 'Experience must be an array' }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(decoded._id, { experience }, { new: true }).select(
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
