'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { pusherClient } from '@lib/pusherClient';
import { RootStore } from '@store/RootStore';

const StoreContext = createContext<RootStore | null>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [store] = useState(() => new RootStore());

  useEffect(() => {
    store.authStore.initialize();

    return () => {
      const userId = store.authStore.user?.id;

      if (userId) {
        try {
          pusherClient.unsubscribe(`user-${userId}`);
        } catch {}
      }
    };
  }, [store]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) throw new Error('Store not initialized');
  return store;
};
