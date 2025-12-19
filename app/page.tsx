'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StreamCard from './components/StreamCard';
import { useLoading } from './components/LoadingProvider';
import ProfileLiveBorder from './components/ProfileLiveBorder';

const THEMES = [
  {
    id: 'original',
    image: '/profile.png',
    accentColor: '#8B5CF6',
    secondaryColor: '#C084FC',
    textColor: 'text-violet-400',
    borderColor: 'hover:border-violet-400',
    sectionBg: 'bg-[#12071F]', // Deep Midnight Purple
    selection: 'selection:bg-violet-500/30',
  },
  {
    id: 'cafe',
    image: '/Cafe-themed.png',
    accentColor: '#D97706',
    secondaryColor: '#FBBF24',
    textColor: 'text-[#DDB892]', // Warm Latte Tan
    borderColor: 'hover:border-[#DDB892]',
    sectionBg: 'bg-[#1A0F0A]', // Dark Roasted Espresso
    selection: 'selection:bg-[#DDB892]/30',
  },
  {
    id: 'beach',
    image: '/Beach-themed.png',
    accentColor: '#BC6C25',
    secondaryColor: '#E2711D',
    textColor: 'text-[#E2711D]', // Vibrant Clay Sunset
    borderColor: 'hover:border-[#E2711D]',
    sectionBg: 'bg-[#24211E]', // Cooler Wet Mud/Charcoal
    selection: 'selection:bg-[#E2711D]/30',
  },
];

interface Stream {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  videoId: string;
  isLive?: boolean;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const { isInitialLoading } = useLoading();
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const currentTheme = THEMES[currentThemeIndex];
  const isLive = streams.some((stream) => stream.isLive);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentThemeIndex((prev) => (prev + 1) % THEMES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchStreams() {
      // Small artificial delay to coordinate with initial loader if it's the first mount
      if (isInitialLoading) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const startTime = Date.now();
      try {
        const response = await fetch('/api/youtube/streams?maxResults=3');
        if (!response.ok) {
          throw new Error('Failed to fetch streams');
        }
        const data = await response.json();

        const elapsed = Date.now() - startTime;
        const minLoadTime = 800;

        if (elapsed < minLoadTime) {
          await new Promise((resolve) =>
            setTimeout(resolve, minLoadTime - elapsed)
          );
        }

        setStreams(data.videos || []);
      } catch (err) {
        console.error('Failed to load streams:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStreams();
  }, []);

  const baseDelay = 0.2;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: baseDelay }}
        className={`min-h-screen flex flex-col bg-black text-white font-sans ${currentTheme.selection}`}
        suppressHydrationWarning
      >
        <section
          className="relative flex flex-col items-center justify-center pt-20 pb-20 overflow-hidden"
          suppressHydrationWarning
        >
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-linear-to-b from-black/40 to-black z-10" />
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTheme.image}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <Image
                  src={currentTheme.image}
                  alt="Background"
                  fill
                  className="object-cover blur-sm"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div
            className="relative z-10 flex flex-col items-center text-center px-4 md:px-[75px] max-w-2xl mx-auto space-y-6"
            suppressHydrationWarning
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: baseDelay + 0.2 }}
              className="relative w-48 h-48 md:w-40 md:h-40"
            >
              {isLive && <ProfileLiveBorder />}
              <div
                className="relative z-10 w-full h-full rounded-full overflow-hidden bg-zinc-800"
                suppressHydrationWarning
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTheme.image}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={currentTheme.image}
                      alt="Lunaticladz Profile"
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: baseDelay + 0.4 }}
              className="text-4xl md:text-5xl font-monas text-white drop-shadow-lg tracking-tight"
            >
              LunaticLadz
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: baseDelay + 0.6 }}
              className="text-lg md:text-xl text-gray-200 leading-relaxed font-light"
            >
              The official hub for community challenges, live updates, and
              leaderboard stats.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: baseDelay + 0.8 }}
              className="flex items-center gap-8 text-sm md:text-base font-medium tracking-wide pt-2"
            >
              <Link
                href="https://youtube.com/@LunaticladzGaming"
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-1 transition-all duration-300 border-b border-transparent pb-0.5 ${currentTheme.textColor} ${currentTheme.borderColor}`}
              >
                YouTube
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300"
                >
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </Link>
              <Link
                href="https://www.instagram.com/lunaticladz/"
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-1 transition-all duration-300 border-b border-transparent pb-0.5 ${currentTheme.textColor} ${currentTheme.borderColor}`}
              >
                Instagram
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300"
                >
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </Link>
              <Link
                href="https://discord.gg/cnEW2Wff8G"
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-1 transition-all duration-300 border-b border-transparent pb-0.5 ${currentTheme.textColor} ${currentTheme.borderColor}`}
              >
                Discord
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300"
                >
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>

        <motion.section
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: baseDelay + 1.0 }}
          className={`relative z-20 rounded-t-3xl md:rounded-t-3xl px-4 md:px-[75px] py-8 md:py-12 -mt-10 flex-1 transition-colors duration-1000 ${currentTheme.sectionBg}`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Watch My Latest Streams
                </h2>
                <p
                  className={`max-w-xl text-sm md:text-base opacity-90 transition-colors duration-1000 ${
                    currentTheme.id === 'original'
                      ? 'text-violet-100'
                      : currentTheme.id === 'cafe'
                      ? 'text-[#EDE0D4]' // Soft Cream
                      : 'text-[#FFD8A8]' // Light Peach/Clay
                  }`}
                >
                  Catch up on the most intense moments, clutch plays, and
                  community challenges from recent sessions.
                </p>
              </div>

              <Link
                href="/streams"
                className="text-white font-medium hover:opacity-80 transition-opacity flex items-center gap-2 group whitespace-nowrap"
              >
                View all streams
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="wait">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <motion.div
                      key={`skeleton-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="aspect-video bg-white/10 rounded-xl overflow-hidden"
                      suppressHydrationWarning
                    >
                      <motion.div
                        animate={{
                          backgroundPosition: ['200% 0', '-200% 0'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        className="w-full h-full"
                        style={{
                          backgroundImage:
                            'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                          backgroundSize: '200% 100%',
                        }}
                        suppressHydrationWarning
                      />
                    </motion.div>
                  ))
                ) : streams.length > 0 ? (
                  streams.map((stream, index) => (
                    <motion.div
                      key={stream.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <StreamCard stream={stream} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full flex items-center justify-center py-12">
                    <p
                      className={`text-lg font-medium opacity-80 transition-colors duration-1000 ${
                        currentTheme.id === 'original'
                          ? 'text-violet-200'
                          : currentTheme.id === 'cafe'
                          ? 'text-[#DDB892]'
                          : 'text-[#E2711D]'
                      }`}
                    >
                      No recent streams found
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </>
  );
}
