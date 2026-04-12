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
      className="fixed inset-0 z-[-1] overflow-hidden bg-background text-foreground transition-colors duration-700"
    >
      <div 
        className="absolute inset-[-20%] opacity-20 animate-pulse-slow dark:opacity-20 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          maskImage: 'radial-gradient(circle at center, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 20%, transparent 80%)',
          transform: 'perspective(1200px) rotateX(15deg) scale(1.2)',
          filter: 'contrast(1.2) brightness(1.2)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      
      {/* Lens Flare / Glow Effect */}
      <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-current opacity-5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-current opacity-5 rounded-full blur-[100px] pointer-events-none" />
      
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: perspective(1200px) rotateX(15deg) scale(1.2) translateY(0); }
          50% { transform: perspective(1200px) rotateX(18deg) scale(1.25) translateY(-20px); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 20s ease-in-out infinite;
        }
      `}</style>
    </motion.div>
  );
};
