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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-background/95 backdrop-blur-xl"
          onClick={onClose}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12" onClick={(e) => e.stopPropagation()}>
            <motion.button
              className="absolute top-6 right-6 md:top-8 md:right-8 w-12 h-12 flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors z-[2001] bg-foreground/5 rounded-full backdrop-blur-md"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={24} />
            </motion.button>

            <motion.button
              className="absolute left-2 md:left-8 w-12 h-24 flex items-center justify-center text-foreground/20 hover:text-foreground transition-colors z-[2001]"
              onClick={onPrev}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={32} />
            </motion.button>

            <div
              className="relative w-full h-full flex flex-col items-center justify-center"
            >
              <img
                src={image.url}
                alt={image.title}
                className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-[0_50px_100px_rgba(0,0,0,0.9)]"
                referrerPolicy="no-referrer"
              />
              
              <motion.div 
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                className="mt-8 text-center"
              >
                <h2 className="text-foreground text-2xl md:text-3xl font-serif italic tracking-tight">{image.title}</h2>
                <p className="text-foreground/40 text-[9px] md:text-[10px] uppercase tracking-[0.3em] mt-2 font-bold">
                  {image.category} — {image.year}
                </p>
              </motion.div>
            </div>

            <motion.button
              className="absolute right-2 md:right-8 w-12 h-24 flex items-center justify-center text-foreground/20 hover:text-foreground transition-colors z-[2001]"
              onClick={onNext}
              whileHover={{ scale: 1.1 }}
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
