import { Types } from 'mongoose';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import type {
  NotificationDoc,
  NotificationQueryFields,
  NotificationResponse,
  NotificationSort,
  NotificationSortFields,
  NotificationStatus,
  NotificationType,
} from '@NotificationPageTypes';
import { NOTIFICATION_LIMIT } from '@constants/constants';
import { getAuthUser } from '@lib/auth';
import connectDB from '@lib/mongodb';
import { Notification } from '@models/Notification';

const VALID_TYPES: NotificationType[] = [
  'new_candidate',
  'candidate-accepted',
  'candidate-rejected',
];

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const type = searchParams.get('type') as NotificationType | null;
    const status = searchParams.get('status') as NotificationStatus | null;
    const sortBy = searchParams.get('sortBy') as NotificationSort | null;

    const query: NotificationQueryFields = {
      userId: new Types.ObjectId(user._id),
    };

    if (type && type !== 'all' && VALID_TYPES.includes(type)) {
      query.type = type;
    }

    if (status === 'read') {
      query.read = true;
    } else if (status === 'unread') {
      query.read = false;
    }

    const sort: NotificationSortFields = {};
    if (sortBy === 'oldest') {
      sort.createdAt = 1;
    } else {
      sort.createdAt = -1;
    }

    const skip = (page - 1) * NOTIFICATION_LIMIT;

    const [notifications, total] = await Promise.all([
      Notification.find(query).sort(sort).skip(skip).limit(NOTIFICATION_LIMIT).lean() as Promise<
        NotificationDoc[]
      >,
      Notification.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / NOTIFICATION_LIMIT);

    const response: NotificationResponse = {
      notifications: notifications.map((n) => ({
        id: n._id.toString(),
        type: n.type,
        data: n.data,
        read: n.read,
        createdAt: n.createdAt.toISOString(),
      })),
      total,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: `Internal server error ${error}` }, { status: 500 });
  }
}
