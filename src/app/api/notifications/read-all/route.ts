import { Types } from 'mongoose';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getAuthUser } from '@lib/auth';
import connectDB from '@lib/mongodb';
import { Notification } from '@models/Notification';
import User from '@models/User';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }
    await connectDB();
    const userId = new Types.ObjectId(user._id);
    const result = await Notification.updateMany(
      {
        userId,
        read: false,
      },
      {
        $set: { read: true },
      }
    );
    if (result.modifiedCount > 0) {
      await User.updateOne({ _id: userId }, { $set: { unreadNotifications: 0 } });
    }
    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    return NextResponse.json({ error: `Internal server error ${error}` }, { status: 500 });
  }
}
