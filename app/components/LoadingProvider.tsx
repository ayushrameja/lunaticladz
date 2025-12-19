'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from './LoadingScreen';

interface LoadingContextType {
  isInitialLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType>({
  isInitialLoading: true,
});

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Preload important images
    const imagesToPreload = [
      '/profile.png',
      '/Cafe-themed.png',
      '/Beach-themed.png',
    ];
    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LoadingContext.Provider value={{ isInitialLoading: isLoading }}>
      <AnimatePresence mode="wait">
        {isMounted && isLoading && <LoadingScreen key="loader" />}
      </AnimatePresence>
      <div
        suppressHydrationWarning
        style={{
          opacity: isMounted && isLoading ? 0 : 1,
          visibility: isMounted && isLoading ? 'hidden' : 'visible',
          transition: 'opacity 0.5s ease-in-out',
        }}
      >
        {children}
      </div>
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
