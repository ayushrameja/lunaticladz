'use client';

import { motion } from 'framer-motion';

export default function LiveBorder() {
  return (
    <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(0deg, #ff0000 0%, #ff6b00 25%, #ffff00 50%, #00ff00 75%, #0000ff 100%)',
            'linear-gradient(72deg, #ff0000 0%, #ff6b00 25%, #ffff00 50%, #00ff00 75%, #0000ff 100%)',
            'linear-gradient(144deg, #ff0000 0%, #ff6b00 25%, #ffff00 50%, #00ff00 75%, #0000ff 100%)',
            'linear-gradient(216deg, #ff0000 0%, #ff6b00 25%, #ffff00 50%, #00ff00 75%, #0000ff 100%)',
            'linear-gradient(288deg, #ff0000 0%, #ff6b00 25%, #ffff00 50%, #00ff00 75%, #0000ff 100%)',
            'linear-gradient(360deg, #ff0000 0%, #ff6b00 25%, #ffff00 50%, #00ff00 75%, #0000ff 100%)',
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          padding: '3px',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.5, 1, 0.5],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(8px)',
        }}
      />
    </div>
  );
}

