import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HeroProps {
  introFinished: boolean;
}

const HeroLayout: React.FC<{ 
  introFinished: boolean; 
  layer: 'bg' | 'fg' 
}> = ({ introFinished, layer }) => {
  const isBg = layer === 'bg';
  const isFg = layer === 'fg';

  return (
    <div className={`fixed inset-0 pointer-events-none px-6 md:px-12 ${isBg ? 'z-[5]' : 'z-[200]'}`}>
      <div className="absolute bottom-[12dvh] md:bottom-24 left-6 right-6 md:left-12 md:right-12 max-w-4xl">
        {/* Selected Work Tag */}
        <div className="mb-4 md:mb-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: isFg ? 1 : 0, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 text-current opacity-30 text-[8px] md:text-[10px] uppercase tracking-[0.4em] font-bold"
          >
            <div className="w-6 md:w-8 h-[1px] bg-current opacity-20" />
            <span>Selected Work 2018 — 2026</span>
          </motion.div>
        </div>

        {/* Main Title */}
        <h1 className="text-current text-[14vw] md:text-[8vw] font-serif leading-[0.85] md:leading-[0.82] tracking-tighter mb-4 md:mb-10 whitespace-nowrap">
          {/* Line 1: Every frame, */}
          <div className="overflow-hidden flex items-baseline">
            <motion.span
              initial={{ opacity: 0, y: '100%', filter: 'blur(20px)' }}
              animate={{ opacity: isFg ? 1 : 0, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.5, delay: 3.5, ease: [0.22, 1, 0.36, 1] }}
              className="block mr-[0.2em]"
            >
              Every
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: '100%', filter: 'blur(20px)' }}
              animate={{ opacity: isBg ? 1 : 0, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.5, delay: 3.6, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              frame,
            </motion.span>
          </div>

          {/* Line 2: every story. */}
          <div className="overflow-hidden flex items-baseline italic">
            <motion.span
              initial={{ opacity: 0, y: '100%', filter: 'blur(20px)' }}
              animate={{ opacity: isFg ? 1 : 0, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.5, delay: 3.8, ease: [0.22, 1, 0.36, 1] }}
              className="block mr-[0.2em]"
            >
              every
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: '100%', filter: 'blur(20px)' }}
              animate={{ opacity: isBg ? 1 : 0, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.5, delay: 3.9, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              story.
            </motion.span>
          </div>
        </h1>

        {/* Bottom Content - Reserved space to prevent jumping */}
        <div className="max-w-md h-[140px] md:h-[160px] relative">
          <AnimatePresence>
            {introFinished && (
              <motion.div
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: isFg ? 1 : 0, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <p className="text-current opacity-40 text-xs md:text-base leading-relaxed mb-6 md:mb-10 font-medium">
                  Twelve years of editorial, fashion, and brand photography — one infinite reel. 
                  Hover to feel it, click to see it full.
                </p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                  animate={{ opacity: isFg ? 1 : 0, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-4 md:gap-8 pointer-events-auto"
                >
                  <button className="px-6 py-4 md:px-10 md:py-5 bg-foreground text-background text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-bold rounded-sm hover:opacity-90 transition-all duration-500 hover:scale-105 active:scale-95">
                    Book a session
                  </button>
                  <button className="text-foreground opacity-40 hover:opacity-100 text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-500 underline underline-offset-8 decoration-foreground/10 hover:decoration-foreground">
                    View Archive
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Featured In Footer */}
      <div className={`fixed bottom-6 right-6 md:bottom-12 md:right-12 flex items-center gap-4 md:gap-8 text-[7px] md:text-[9px] uppercase tracking-[0.3em] text-current opacity-20 font-bold ${isBg ? 'opacity-0' : ''}`}>
        <div className="flex items-center gap-2 md:gap-4">
          <span>Featured in:</span>
          <span className="text-current opacity-40 hover:opacity-100 transition-opacity cursor-default">Vogue</span>
          <span className="text-current opacity-40 hover:opacity-100 transition-opacity cursor-default">Wired</span>
          <span className="text-current opacity-40 hover:opacity-100 transition-opacity cursor-default">Apple</span>
        </div>
      </div>
    </div>
  );
};

export const HeroBackground: React.FC<HeroProps> = (props) => (
  <HeroLayout {...props} layer="bg" />
);

export const HeroForeground: React.FC<HeroProps> = (props) => (
  <HeroLayout {...props} layer="fg" />
);

// Keep default export for backward compatibility if needed, but App.tsx will use the named ones
export const Hero = HeroForeground;
