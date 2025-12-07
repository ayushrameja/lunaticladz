'use client';

import { motion } from 'framer-motion';

export default function ProfileLiveBorder() {
  return (
    <>
      <motion.div
        className="absolute inset-[-6px] rounded-full z-0"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          background:
            'conic-gradient(from 0deg, #ff0000, #ff6b00, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0000)',
        }}
      />

      <motion.div
        className="absolute inset-[-20px] rounded-full z-0"
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background:
            'radial-gradient(circle, rgba(255, 0, 0, 0.5) 0%, rgba(255, 0, 0, 0) 70%)',
          filter: 'blur(25px)',
        }}
      />
    </>
  );
}
