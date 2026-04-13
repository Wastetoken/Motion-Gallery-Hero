import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { IMAGES, PortfolioImage } from '../constants';
import { WaveItem } from './WaveItem';
import { ScrollSettings } from './SettingsPanel';

interface WaveSystemProps {
  onImageClick: (image: PortfolioImage) => void;
  onIntroFinish: () => void;
  startIntro: boolean;
  settings: ScrollSettings;
}

export const WaveSystem: React.FC<WaveSystemProps> = ({ onImageClick, onIntroFinish, startIntro, settings }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [introProgress, setIntroProgress] = useState<number[]>(new Array(IMAGES.length).fill(0));
  const [introFinished, setIntroFinished] = useState(false);
  const [explosionIntensity, setExplosionIntensity] = useState(0);

  const currentPosX = useRef(0);
  const velocity = useRef(0);
  const isDragging = useRef(false);
  const isClickCandidate = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const lastDragX = useRef(0);
  const clickedItemId = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Intro animation
  useEffect(() => {
    if (!startIntro) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setIntroFinished(true);
        onIntroFinish();
      }
    });

    currentPosX.current = 0;

    const progressProxy = { value: new Array(IMAGES.length).fill(0) };
    const half = Math.floor(IMAGES.length / 2);
    
    IMAGES.forEach((_, i) => {
      const visualOrderIndex = (i + half) % IMAGES.length;
      tl.to(progressProxy.value, {
        [visualOrderIndex]: 1,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: () => {
          setIntroProgress([...progressProxy.value]);
        }
      }, i * 0.03 + 0.5); 
    });

    tl.to({}, {
      duration: 1,
      onStart: () => {
        gsap.to({ val: 0 }, {
          val: 1,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: function() {
            setExplosionIntensity(this.targets()[0].val);
          }
        });
      }
    }, 3);
  }, [startIntro]);

  // Main animation loop - DIRECT DOM UPDATES
  useEffect(() => {
    const update = (time: number) => {
      if (!isDragging.current) {
        currentPosX.current += velocity.current;
        velocity.current *= settings.inertiaDecay;
        currentPosX.current += Math.sin(time * 0.0008) * 0.3;
      }

      // 1. Calculate and Render positions
      const totalWidth = IMAGES.length * settings.spacing;
      const halfWidth = window.innerWidth / 2 || 1;

      itemRefs.current.forEach((el, index) => {
        if (!el) return;
        
        const baseX = index * settings.spacing;
        let x = (baseX - currentPosX.current) % totalWidth;
        if (x < -totalWidth / 2) x += totalWidth;
        if (x > totalWidth / 2) x -= totalWidth;

        const angleAtX = settings.frequency * x * Math.PI;
        const basePathY = settings.amplitude * Math.sin(angleAtX);
        const slope = settings.amplitude * settings.frequency * Math.PI * Math.cos(angleAtX);
        const baseRotation = Math.atan(slope) * (180 / Math.PI);
        
        const centerDist = Math.abs(x);
        const explosionRadius = settings.disperseRadius;
        let explosionFactor = 0;
        let offsetX = 0;
        let offsetY = 0;

        if (centerDist < explosionRadius) {
          explosionFactor = Math.pow(1 - (centerDist / explosionRadius), 2) * explosionIntensity * settings.disperseRatio;
          const angle = (index / IMAGES.length) * Math.PI * 2 * 15; 
          const explosionStrength = settings.disperseStrength * explosionFactor;
          offsetX = Math.cos(angle) * explosionStrength;
          offsetY = Math.sin(angle) * explosionStrength;
        }

        const finalX = x + offsetX;
        const finalY = basePathY + offsetY;
        const normalizedCenterDist = Math.abs(x) / halfWidth;
        const safeDist = Math.min(1, Math.max(0, normalizedCenterDist));
        
        const scale = 0.4 + (1.2 * Math.pow(1 - safeDist, 1.5));
        const zIndex = Math.floor((1 - safeDist) * 100);
        const isHovered = hoveredId === IMAGES[index].id;

        const renderScale = isHovered ? scale * 1.6 : scale;
        const rotation = isHovered ? (index % 2 === 0 ? 4 : -4) : (baseRotation + explosionFactor * (index % 2 === 0 ? 45 : -45));
        const blur = isHovered ? 0 : safeDist * 8;

        el.style.transform = `translate3d(calc(-50% + ${finalX}px), calc(-50% + ${finalY}px), 0) scale(${renderScale}) rotate(${rotation}deg)`;
        el.style.filter = blur > 0.5 ? `blur(${blur}px)` : 'none';
        el.style.zIndex = isHovered ? "1000" : zIndex.toString();
      });

      const filter = document.getElementById('liquid-turbulence');
      if (filter) {
        const freq = 0.02 + Math.sin(time * 0.001) * 0.01;
        filter.setAttribute('baseFrequency', `${freq} ${freq * 1.5}`);
      }
    };

    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, [introFinished, explosionIntensity, hoveredId, settings]);

  // Event handlers
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!introFinished) return;
    velocity.current += e.deltaY * settings.scrollSensitivity * 0.05;
  }, [introFinished, settings.scrollSensitivity]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!introFinished) return;
    isDragging.current = true;
    isClickCandidate.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    lastDragX.current = e.clientX;
    velocity.current = 0;
    
    // Identify the item being clicked
    const target = e.target as HTMLElement;
    const itemElement = target.closest('[data-wave-item]');
    clickedItemId.current = itemElement?.getAttribute('data-id') || null;
    
    // On mobile, clear hover if we start dragging
    if (e.pointerType === 'touch') {
      // setHoveredId(null); // Don't clear yet, might be a tap
    }
    
    containerRef.current?.setPointerCapture(e.pointerId);
  }, [introFinished]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dist = Math.hypot(e.clientX - dragStartPos.current.x, e.clientY - dragStartPos.current.y);
    if (dist > 10) isClickCandidate.current = false;
    
    const deltaX = e.clientX - lastDragX.current;
    lastDragX.current = e.clientX;
    currentPosX.current -= deltaX * settings.dragSensitivity;
    velocity.current = -deltaX * settings.dragSensitivity;
  }, [settings.dragSensitivity]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (isClickCandidate.current && clickedItemId.current) {
      const id = clickedItemId.current;
      const img = IMAGES.find(i => i.id === id);
      
      if (img) {
        // On mobile, if it's not hovered, hover it first. If already hovered, open it.
        // This gives a nice "inspect" feel.
        if (e.pointerType === 'touch' && hoveredId !== id) {
          setHoveredId(id);
        } else {
          onImageClick(img);
        }
      }
    } else if (isClickCandidate.current) {
      setHoveredId(null);
    }
    
    clickedItemId.current = null;
    isDragging.current = false;
    isClickCandidate.current = false;
    containerRef.current?.releasePointerCapture(e.pointerId);
  }, [hoveredId, onImageClick]);

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] touch-none select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {IMAGES.map((image, index) => (
        <WaveItem
          key={image.id}
          ref={el => { itemRefs.current[index] = el; }}
          image={image}
          isHovered={hoveredId === image.id}
          onHover={setHoveredId}
          introProgress={introProgress[index]}
        />
      ))}

      {/* Liquid Distortion SVG Filter */}
      <svg className="hidden">
        <defs>
          <filter id="liquid-distortion">
            <feTurbulence
              id="liquid-turbulence"
              type="fractalNoise"
              baseFrequency="0.02 0.02"
              numOctaves="1"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
