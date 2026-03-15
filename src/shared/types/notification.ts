export type Notification = {
  type: string;
  message?: string;
  candidateId?: string;
  vacancyId: string;
  firstName: string;
  secondName: string;
  matchScore: number;
  avatar: string;
  title?: string;
  company?: string;
};

export type NotificationContextType = {
  notifications: Notification[];
  clearNotifications: () => void;
  toggleSound: () => void;
  isSoundEnabled: boolean;
};

export type StoredNotification = Notification & {
  id: string;
  read: boolean;
  createdAt: string;
};
