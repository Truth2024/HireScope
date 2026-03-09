import React from 'react';

export const useNotificationSound = () => {
  const [isSoundEnabled, setIsSoundEnabled] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('notificationSound');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  const toggleSound = React.useCallback(() => {
    setIsSoundEnabled((prev) => {
      const newValue = !prev;
      localStorage.setItem('notificationSound', String(newValue));
      return newValue;
    });
  }, []);

  return { isSoundEnabled, toggleSound };
};
