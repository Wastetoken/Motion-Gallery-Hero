import React, { forwardRef } from 'react';
import { PortfolioImage } from '../constants';
import { cn } from '../lib/utils';

interface WaveItemProps {
  image: PortfolioImage;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  introProgress: number; 
}

export const WaveItem = forwardRef<HTMLDivElement, WaveItemProps>(({
  image,
  isHovered,
  onHover,
  introProgress,
}, ref) => {
  const blurAmount = (1 - introProgress) * 20;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute top-1/2 left-1/2 cursor-pointer transition-shadow duration-700",
        isHovered ? "z-[1000]" : ""
      )}
      style={{
        opacity: introProgress,
        filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none',
        width: '60px',
        height: '90px',
        willChange: 'transform, opacity',
      }}
      onMouseEnter={() => onHover(image.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div 
        className={cn(
          "relative w-full h-full overflow-hidden rounded-sm shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isHovered ? "shadow-[0_40px_80px_rgba(0,0,0,0.8)] ring-1 ring-foreground/30 scale-105" : "shadow-lg"
        )}
      >
        <img
          src={image.url}
          alt={image.title}
          className={cn(
            "w-full h-full object-cover pointer-events-none transition-all duration-700",
            isHovered ? "scale-110" : "scale-100"
          )}
          style={{
            filter: isHovered ? 'url(#liquid-distortion)' : 'none',
          }}
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
});
