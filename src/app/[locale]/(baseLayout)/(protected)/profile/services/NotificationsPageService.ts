import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

import type {
  NotificationDataPage,
  NotificationFilter,
  NotificationQueryFields,
  NotificationResponse,
  NotificationResponseItem,
  NotificationSortFields,
  NotificationType,
} from '@NotificationPageTypes';
import { NOTIFICATION_LIMIT } from '@constants/constants';
import connectDB from '@lib/mongodb';
import { Notification } from '@models/Notification';

type NotificationDoc = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: NotificationType;
  data: NotificationDataPage;
  read: boolean;
  createdAt: Date;
};

export type NotificationsServiceResult =
  | { status: 'success'; data: NotificationResponse }
  | { status: 'unauthorized' }
  | { status: 'error'; code: number; message: string };

export async function NotificationsPageService(
  refreshToken: string,
  page: number = 1,
  filters: NotificationFilter = {}
): Promise<NotificationsServiceResult> {
  try {
    if (!refreshToken) {
      return { status: 'unauthorized' };
    }

    await connectDB();

    let decoded: { userId: string };
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as { userId: string };
    } catch {
      return { status: 'unauthorized' };
    }

    const query: NotificationQueryFields = {
      userId: new Types.ObjectId(decoded.userId),
    };

    if (filters.status === 'read') {
      query.read = true;
    } else if (filters.status === 'unread') {
      query.read = false;
    }

    if (filters.type && filters.type !== 'all') {
      query.type = filters.type;
    }

    const sortOptions: NotificationSortFields = {};
    if (filters.sortBy === 'oldest') {
      sortOptions.createdAt = 1;
    } else {
      sortOptions.createdAt = -1;
    }

    const skip = (page - 1) * NOTIFICATION_LIMIT;

    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(NOTIFICATION_LIMIT)
        .lean() as Promise<NotificationDoc[]>,
      Notification.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / NOTIFICATION_LIMIT);

    const data: NotificationResponse = {
      notifications: notifications.map(
        (n): NotificationResponseItem => ({
          id: n._id.toString(),
          type: n.type,
          data: n.data,
          read: n.read,
          createdAt: n.createdAt.toISOString(),
        })
      ),
      total,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return { status: 'success', data };
  } catch {
    return {
      status: 'error',
      code: 500,
      message: 'Failed to fetch notifications',
    };
  }
}
