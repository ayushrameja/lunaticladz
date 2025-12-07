'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StreamCard from './components/StreamCard';
import LoadingScreen from './components/LoadingScreen';
import { useLoading } from './components/LoadingProvider';
import ProfileLiveBorder from './components/ProfileLiveBorder';

interface Stream {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  videoId: string;
  isLive?: boolean;
}

export default function Home() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasShownLoading, setHasShownLoading } = useLoading();
  const [showLoading, setShowLoading] = useState(!hasShownLoading);
  const isLive = streams.some((stream) => stream.isLive);

  useEffect(() => {
    if (!hasShownLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
        setHasShownLoading(true);
        sessionStorage.setItem('hasShownLoading', 'true');
      }, 2500);

      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [hasShownLoading, setHasShownLoading]);

  useEffect(() => {
    async function fetchStreams() {
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

  const baseDelay = showLoading ? 0.8 : 0.2;

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoading && <LoadingScreen />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: baseDelay }}
        className="min-h-screen bg-black text-white font-sans selection:bg-purple-100 selection:text-white"
      >
        <section className="relative flex flex-col items-center justify-center pt-20 pb-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-linear-to-b from-black/40 to-black z-10" />
            <Image
              src="/profile.png"
              alt="Background"
              fill
              className="object-cover opacity-50 blur-sm"
              priority
            />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center px-4 md:px-[75px] max-w-2xl mx-auto space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: baseDelay + 0.2 }}
              className="relative w-48 h-48 md:w-40 md:h-40"
            >
              {isLive && <ProfileLiveBorder />}
              <div className="relative z-10 w-full h-full rounded-full overflow-hidden bg-zinc-800">
                <Image
                  src="/profile.png"
                  alt="Lunaticladz Profile"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: baseDelay + 0.4 }}
              className="text-4xl md:text-5xl font-pattaya text-white drop-shadow-lg tracking-wide"
            >
              Lunaticladz
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
              className="flex items-center gap-6 text-sm md:text-base font-medium tracking-wide pt-2"
            >
              <Link
                href="https://youtube.com/@LunaticladzGaming"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-400 transition-colors border-b border-transparent hover:border-purple-400 pb-0.5"
              >
                YouTube
              </Link>
              <span className="text-gray-600">•</span>
              <Link
                href="https://www.instagram.com/lunaticladz/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-400 transition-colors border-b border-transparent hover:border-purple-400 pb-0.5"
              >
                Instagram
              </Link>
              <span className="text-gray-600">•</span>
              <Link
                href="https://discord.gg/cnEW2Wff8G"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-400 transition-colors border-b border-transparent hover:border-purple-400 pb-0.5"
              >
                Discord
              </Link>
            </motion.div>
          </div>
        </section>

        <motion.section
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: baseDelay + 1.0 }}
          className="relative z-20 bg-[#5000AB] rounded-t-3xl md:rounded-t-3xl px-4 md:px-[75px] py-8 md:py-12 -mt-10 min-h-[500px]"
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Watch My Latest Streams
                </h2>
                <p className="text-purple-100 max-w-xl text-sm md:text-base opacity-90">
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
                    <p className="text-purple-200 text-lg font-medium opacity-80">
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
