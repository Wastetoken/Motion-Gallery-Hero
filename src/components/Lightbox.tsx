import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PortfolioImage } from '../constants';

interface LightboxProps {
  image: PortfolioImage | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ image, onClose, onPrev, onNext }) => {
  useEffect(() => {
    let lastScrollTime = 0;
    const scrollThreshold = 500; // ms

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastScrollTime < scrollThreshold) return;

      if (Math.abs(e.deltaY) > 10) {
        if (e.deltaY > 0) {
          onNext();
        } else {
          onPrev();
        }
        lastScrollTime = now;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: true });
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center overflow-hidden"
          onClick={onClose}
        >
          {/* Theme-aware Overlay for Focus */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
          
          {/* Animated Bokeh Circles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: Math.random() * window.innerHeight,
                  scale: Math.random() * 2 + 1,
                  opacity: 0 
                }}
                animate={{ 
                  x: [null, Math.random() * window.innerWidth],
                  y: [null, Math.random() * window.innerHeight],
                  opacity: [0, 0.1, 0],
                }}
                transition={{ 
                  duration: Math.random() * 10 + 10, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="absolute w-64 h-64 rounded-full bg-foreground/5 blur-[80px]"
              />
            ))}
          </div>

          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-4 z-[2001]">
              <motion.button
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-4 py-2 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-full backdrop-blur-md border border-foreground/10 transition-all"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-[10px] uppercase tracking-widest font-bold">Collapse</span>
                <X size={16} />
              </motion.button>
            </div>

            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute left-4 md:left-12 w-14 h-14 flex items-center justify-center text-foreground/30 hover:text-foreground transition-all z-[2001] bg-foreground/5 hover:bg-foreground/10 rounded-full backdrop-blur-sm border border-foreground/5"
              onClick={onPrev}
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={32} />
            </motion.button>

            <div className="relative w-full h-full flex flex-col items-center justify-center max-w-7xl mx-auto">
              <motion.div
                layoutId={`image-${image.id}`}
                className="relative group"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="max-w-full max-h-[75vh] md:max-h-[80vh] object-contain rounded-sm shadow-[0_80px_150px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Image Reflection/Glow */}
                <div className="absolute -inset-4 bg-foreground/5 blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-10 text-center"
              >
                <h2 className="text-foreground text-3xl md:text-5xl font-serif italic tracking-tight leading-none">{image.title}</h2>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="h-[1px] w-8 bg-foreground/20" />
                  <p className="text-foreground/40 text-[10px] md:text-[12px] uppercase tracking-[0.4em] font-bold">
                    {image.category} — {image.year}
                  </p>
                  <div className="h-[1px] w-8 bg-foreground/20" />
                </div>
              </motion.div>
            </div>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-4 md:right-12 w-14 h-14 flex items-center justify-center text-foreground/30 hover:text-foreground transition-all z-[2001] bg-foreground/5 hover:bg-foreground/10 rounded-full backdrop-blur-sm border border-foreground/5"
              onClick={onNext}
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={32} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
