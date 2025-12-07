'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface StreamCardProps {
  stream: {
    id: string;
    title: string;
    thumbnail: string;
    videoId: string;
    isLive?: boolean;
  };
}

export default function StreamCard({ stream }: StreamCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={`https://www.youtube.com/watch?v=${stream.videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`aspect-video bg-black rounded-xl overflow-hidden shadow-lg relative ${
          stream.isLive ? 'ring-[3px] ring-red-600' : ''
        }`}
      >
        <Image
          src={stream.thumbnail}
          alt={stream.title}
          fill
          className="object-cover"
        />

        {stream.isLive && (
          <>
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                boxShadow: [
                  'inset 0 0 20px rgba(255, 0, 0, 0.3)',
                  'inset 0 0 40px rgba(255, 0, 0, 0.5)',
                  'inset 0 0 20px rgba(255, 0, 0, 0.3)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-3 right-3 z-10"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 10px rgba(255, 0, 0, 0.5)',
                    '0 0 20px rgba(255, 0, 0, 0.8)',
                    '0 0 10px rgba(255, 0, 0, 0.5)',
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="bg-red-600 text-white px-3 py-1 rounded-full font-bold text-sm flex items-center gap-2"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-2 h-2 bg-white rounded-full"
                />
                LIVE
              </motion.div>
            </motion.div>
          </>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 20,
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-x-0 bottom-0 p-4 pointer-events-none"
        >
          <h3 className="text-white font-bold text-base md:text-lg line-clamp-2">
            {stream.title}
          </h3>
        </motion.div>
      </div>
    </motion.a>
  );
}
