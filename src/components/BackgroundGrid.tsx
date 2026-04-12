import React from 'react';
import { motion } from 'motion/react';

interface BackgroundGridProps {
  visible: boolean;
}

export const BackgroundGrid: React.FC<BackgroundGridProps> = ({ visible }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 2, ease: "easeInOut" }}
      className="fixed inset-0 z-[-1] overflow-hidden bg-background"
    >
      {/* Primary Technical Grid */}
      <div 
        className="absolute inset-[-50%] opacity-[0.15] dark:opacity-[0.2]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
          color: 'rgb(var(--foreground))',
        }}
      />

      {/* Secondary Bold Grid Lines */}
      <div 
        className="absolute inset-[-50%] opacity-[0.05] dark:opacity-[0.1]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 2px, transparent 2px),
            linear-gradient(to bottom, currentColor 2px, transparent 2px)
          `,
          backgroundSize: '200px 200px',
          transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
          color: 'rgb(var(--foreground))',
        }}
      />

      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-foreground/5 blur-[120px] rounded-full pointer-events-none" />
    </motion.div>
  );
};
