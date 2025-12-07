'use client';

import { motion } from 'framer-motion';

export default function ProfileLiveBorder() {
  const borders = [
    { color: '#8AB4F8', delay: 0 }, // Pastel Blue
    { color: '#F28B82', delay: 0.5 }, // Pastel Red
    { color: '#FDD663', delay: 1.0 }, // Pastel Yellow
    { color: '#81C995', delay: 1.5 }, // Pastel Green
  ];

  return (
    <>
      {borders.map((border, i) => (
        <motion.div
          key={i}
          className="absolute z-0 border-[1.5px]"
          style={{
            borderColor: border.color,
            inset: `-${(i + 1) * 5}px`, // -5px, -10px, -15px, -20px
          }}
          animate={{
            borderRadius: ['50%', '35%', '45%', '30%', '50%'],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: border.delay,
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
        />
      ))}
    </>
  );
}
