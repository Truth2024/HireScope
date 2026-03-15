import type { SortOrder, Types } from 'mongoose';

export type NotificationDataPage = {
  candidateId: string;
  vacancyId: string;
  firstName: string;
  secondName: string;
  matchScore: number;
  avatar: string;
  title?: string;
  company?: string;
  message?: string;
};

export type NotificationType =
  | 'new_candidate'
  | 'candidate-accepted'
  | 'candidate-rejected'
  | 'all';

export type NotificationStatus = 'read' | 'unread' | 'all';
export type NotificationSort = 'newest' | 'oldest';

export type NotificationFilter = {
  type?: NotificationType;
  status?: NotificationStatus;
  sortBy?: NotificationSort;
};

export type NotificationResponseItem = {
  id: string;
  type: NotificationType;
  data: NotificationDataPage;
  read: boolean;
  createdAt: string;
};

export type NotificationResponse = {
  notifications: NotificationResponseItem[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type NotificationQueryFields = {
  userId: Types.ObjectId;
  read?: boolean;
  type?: Exclude<NotificationType, 'all'>;
};

export type NotificationSortFields = {
  createdAt?: SortOrder;
};

export type NotificationDoc = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: Exclude<NotificationType, 'all'>;
  data: NotificationDataPage;
  read: boolean;
  createdAt: Date;
};
export type NotificationPage = {
  id: string;
  userId: string;
  type: NotificationType;
  data: NotificationDataPage;
  read: boolean;
  createdAt: string;
};
