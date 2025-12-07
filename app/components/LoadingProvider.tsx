'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LoadingContextType {
  hasShownLoading: boolean;
  setHasShownLoading: (value: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  hasShownLoading: false,
  setHasShownLoading: () => {},
});

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [hasShownLoading, setHasShownLoading] = useState(true);

  useEffect(() => {
    const shown = sessionStorage.getItem('hasShownLoading');
    if (!shown) {
      setHasShownLoading(false);
    }
  }, []);

  return (
    <LoadingContext.Provider value={{ hasShownLoading, setHasShownLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}

