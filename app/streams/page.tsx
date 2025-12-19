'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StreamCard from '../components/StreamCard';
import { useLoading } from '../components/LoadingProvider';

interface Stream {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  videoId: string;
  isLive?: boolean;
}

const ITEMS_PER_PAGE = 12;

export default function StreamsPage() {
  const { isInitialLoading } = useLoading();
  const [allStreams, setAllStreams] = useState<Stream[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStreams() {
      if (isInitialLoading) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      const startTime = Date.now();
      try {
        const response = await fetch('/api/youtube/streams?maxResults=50');
        if (!response.ok) {
          throw new Error('Failed to fetch streams');
        }
        const data = await response.json();

        const elapsed = Date.now() - startTime;
        const minLoadTime = 600;

        if (elapsed < minLoadTime) {
          await new Promise((resolve) =>
            setTimeout(resolve, minLoadTime - elapsed)
          );
        }

        setAllStreams(data.videos || []);
      } catch (err) {
        setError('Failed to load streams');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStreams();
  }, []);

  const totalPages = Math.ceil(allStreams.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentStreams = allStreams.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPaginationRange = () => {
    const range = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);

    if (end - start < showPages - 1) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black text-white font-sans"
    >
      <div className="px-4 md:px-[75px] py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <span>←</span> Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              All Streams
            </h1>
            <p className="text-gray-400 text-lg">
              Watch all past streams and highlights from the channel
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="aspect-video bg-zinc-900 rounded-xl overflow-hidden"
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
                          'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
                        backgroundSize: '200% 100%',
                      }}
                      suppressHydrationWarning
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {!loading && error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center py-12"
              >
                <p className="text-red-400 text-lg">{error}</p>
              </motion.div>
            )}

            {!loading && !error && allStreams.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center py-12"
              >
                <p className="text-gray-400 text-lg">No streams found</p>
              </motion.div>
            )}

            {!loading && !error && currentStreams.length > 0 && (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {currentStreams.map((stream, index) => (
                    <motion.div
                      key={stream.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <StreamCard stream={stream} />
                      <div className="mt-3">
                        <p className="text-gray-400 text-sm">
                          {new Date(stream.publishedAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === 1
                          ? 'bg-zinc-800 text-gray-600 cursor-not-allowed'
                          : 'bg-zinc-800 text-white hover:bg-zinc-700'
                      }`}
                    >
                      ← Previous
                    </button>

                    {getPaginationRange().map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          currentPage === page
                            ? 'bg-purple-600 text-white scale-110'
                            : 'bg-zinc-800 text-white hover:bg-zinc-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === totalPages
                          ? 'bg-zinc-800 text-gray-600 cursor-not-allowed'
                          : 'bg-zinc-800 text-white hover:bg-zinc-700'
                      }`}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
