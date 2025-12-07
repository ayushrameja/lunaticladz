'use client';

import { motion } from 'framer-motion';

export default function LoadingScreen() {
  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          duration: 2,
          ease: 'easeInOut',
        },
        opacity: {
          duration: 0.3,
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <div className="text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-pattaya text-white tracking-wide">
            Lunaticladz
          </h1>
        </motion.div>

        <svg
          width="200"
          height="4"
          viewBox="0 0 200 4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto"
        >
          <motion.line
            x1="0"
            y1="2"
            x2="200"
            y2="2"
            stroke="url(#gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            variants={pathVariants}
            initial="hidden"
            animate="visible"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </motion.div>
  );
}
