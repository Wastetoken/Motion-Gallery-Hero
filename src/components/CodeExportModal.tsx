import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, FileCode, Globe } from 'lucide-react';
import { ScrollSettings } from './SettingsPanel';
import { IMAGES } from '../constants';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ScrollSettings;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ isOpen, onClose, settings }) => {
  const [copiedType, setCopiedType] = useState<'tsx' | 'html' | null>(null);

  const generateTSX = () => {
    const isDark = document.documentElement.classList.contains('dark');
    return `import React, { useEffect, useRef, useState, useCallback, forwardRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import gsap from 'gsap';

/**
 * FULL UI EXPORT - MOTION WAVE GALLERY
 * This file contains the entire application UI, including:
 * - Navbar with Theme Toggler & Export
 * - Hero Section with staggered animations
 * - Background Perspective Grid
 * - Wave System with Sinusoidal Physics & Dispersion
 * - Full Settings Panel
 * - Lightbox System
 */

// --- CONFIGURATION ---
const IMAGES = ${JSON.stringify(IMAGES, null, 2)};

// --- UTILS ---
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

const Icon = ({ name, size = 20, className = "" }: { name: string, size?: number, className?: string }) => {
  const iconRef = useRef<HTMLElement>(null);
  useEffect(() => {
    // @ts-ignore
    if (typeof lucide !== 'undefined' && iconRef.current) {
      // @ts-ignore
      lucide.createIcons({
        attrs: { 'stroke-width': 2, 'width': size, 'height': size, 'class': className },
        nameAttr: 'data-lucide'
      });
    }
  }, [name, size, className]);

  // Fallback for React environment where lucide-react is imported
  const LucideIcon = (Icons as any)[name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')];
  if (LucideIcon) return <LucideIcon size={size} className={className} />;

  return <i data-lucide={name} ref={iconRef} className={className} style={{ width: size, height: size, display: 'inline-block' }}></i>;
};

// --- COMPONENTS ---

const Navbar = ({ onSettingsClick, onExportClick }: any) => (
  <nav className="fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-4 py-4 md:px-12 md:py-10 pointer-events-none">
    <div className="flex items-center gap-4 md:gap-12 pointer-events-auto">
      <a href="#" className="text-foreground font-bold text-lg md:text-xl tracking-tighter">Motion</a>
    </div>
    <div className="flex items-center gap-4 md:gap-8 pointer-events-auto">
      <AnimatedThemeToggler />
      {onExportClick && (
        <button onClick={onExportClick} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-foreground/20 hover:text-foreground transition-all active:scale-90">
          <Icon name="code" size={18} />
        </button>
      )}
      <button onClick={onSettingsClick} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-foreground/20 hover:text-foreground transition-all active:scale-90">
        <Icon name="settings-2" size={18} />
      </button>
    </div>
  </nav>
);

const AnimatedThemeToggler = ({ className }: any) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return true;
  });

  useEffect(() => {
    const syncTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      if (isDark !== darkMode) setDarkMode(isDark);
    };
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [darkMode]);

  const onToggle = async () => {
    if (!buttonRef.current) return;
    const toggle = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const next = !isDark;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      setDarkMode(next);
    };
    // @ts-ignore
    if (!document.startViewTransition) {
      toggle();
      return;
    }
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const maxDistance = Math.hypot(Math.max(centerX, window.innerWidth - centerX), Math.max(centerY, window.innerHeight - centerY));
    // @ts-ignore
    const transition = document.startViewTransition(() => {
      toggle();
    });
    await transition.ready;
    document.documentElement.animate({
      clipPath: [\`circle(0px at \${centerX}px \${centerY}px)\`, \`circle(\${maxDistance}px at \${centerX}px \${centerY}px)\`]
    }, {
      duration: 700,
      easing: "ease-in-out",
      pseudoElement: "::view-transition-new(root)"
    });
  };

  return (
    <button ref={buttonRef} onClick={onToggle} className={cn("flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full outline-none active:scale-90 transition-all duration-300", darkMode ? "bg-white/5 text-white/40 hover:text-white" : "bg-black/5 text-black/40 hover:text-black", className)}>
      <AnimatePresence mode="wait" initial={false}>
        {darkMode ? (
          <motion.span key="sun" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}><Icon name="sun" size={18} /></motion.span>
        ) : (
          <motion.span key="moon" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}><Icon name="moon" size={18} /></motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

const BackgroundGrid = ({ visible }: { visible: boolean }) => (
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
        backgroundImage: \`linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)\`,
        backgroundSize: '40px 40px',
        transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
        color: 'rgb(var(--foreground))',
      }}
    />
    {/* Secondary Bold Grid Lines */}
    <div 
      className="absolute inset-[-50%] opacity-[0.05] dark:opacity-[0.1]"
      style={{
        backgroundImage: \`linear-gradient(to right, currentColor 2px, transparent 2px), linear-gradient(to bottom, currentColor 2px, transparent 2px)\`,
        backgroundSize: '200px 200px',
        transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
        color: 'rgb(var(--foreground))',
      }}
    />
    {/* Ambient Glows */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-foreground/5 blur-[120px] rounded-full pointer-events-none" />
  </motion.div>
);

const HeroLayout = ({ introFinished, layer }: { introFinished: boolean, layer: 'bg' | 'fg' }) => {
  const isBg = layer === 'bg';
  const isFg = layer === 'fg';
  return (
    <div className={\`fixed inset-0 pointer-events-none px-6 md:px-12 \${isBg ? 'z-[5]' : 'z-[200]'}\`}>
      <div className="absolute bottom-[12dvh] md:bottom-24 left-6 right-6 md:left-12 md:right-12 max-w-4xl">
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
        <h1 className="text-current text-[14vw] md:text-[8vw] font-serif leading-[0.85] md:leading-[0.82] tracking-tighter mb-4 md:mb-10 whitespace-nowrap">
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
                </p>
                <div className="flex items-center gap-4 md:gap-8 pointer-events-auto">
                  <button className="px-6 py-4 md:px-10 md:py-5 bg-foreground text-background text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-bold rounded-sm">Book a session</button>
                  <button className="text-foreground opacity-40 hover:opacity-100 text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-bold transition-all underline underline-offset-8">View Archive</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const WaveItem = forwardRef(({ image, isHovered, onHover, introProgress }: any, ref: any) => {
  const blurAmount = (1 - introProgress) * 20;
  return (
    <div
      ref={ref}
      data-wave-item
      data-id={image.id}
      className={cn("absolute top-1/2 left-1/2 cursor-pointer transition-shadow duration-700", isHovered && "z-[1000]")}
      style={{ 
        opacity: introProgress, 
        filter: blurAmount > 0 ? \`blur(\${blurAmount}px)\` : 'none',
        width: '60px', 
        height: '90px',
        willChange: 'transform, opacity'
      }}
      onMouseEnter={() => onHover(image.id)}
      onMouseLeave={() => onHover(null)}
    >
        <motion.div 
          layoutId={\`image-\${image.id}\`}
          className={cn("relative w-full h-full overflow-hidden rounded-sm shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]", isHovered ? "shadow-[0_40px_80px_rgba(0,0,0,0.8)] ring-1 ring-foreground/30 scale-105" : "shadow-lg")}
        >
        <img 
          src={image.url} 
          alt={image.title} 
          className={cn("w-full h-full object-cover pointer-events-none transition-all duration-700", isHovered ? "scale-110" : "scale-100")} 
          style={{ filter: isHovered ? 'url(#liquid-distortion)' : 'none' }}
        />
        <div className={cn("absolute inset-0 bg-foreground/5 transition-opacity duration-700", isHovered ? "opacity-0" : "opacity-100")} />
      </motion.div>
    </div>
  );
});

const Lightbox = ({ image, isOpen, onClose, onPrev, onNext }: any) => {
  useEffect(() => {
    if (!isOpen) return;
    let lastScrollTime = 0;
    const scrollThreshold = 500;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastScrollTime < scrollThreshold) return;
      if (Math.abs(e.deltaY) > 10) {
        if (e.deltaY > 0) onNext();
        else onPrev();
        lastScrollTime = now;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!image) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[5000] flex items-center justify-center overflow-hidden"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ 
                  x: [Math.random() * 1000, Math.random() * 1000],
                  y: [Math.random() * 1000, Math.random() * 1000],
                  opacity: [0, 0.1, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute w-64 h-64 rounded-full bg-foreground/5 blur-[80px]"
              />
            ))}
          </div>
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-4 z-[5001]">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={onClose} 
                className="flex items-center gap-2 px-4 py-2 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-full backdrop-blur-md border border-foreground/10 transition-all"
              >
                <span className="text-[10px] uppercase tracking-widest font-bold">Collapse</span>
                <Icon name="x" size={16} />
              </motion.button>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1, x: -5 }} whileTap={{ scale: 0.9 }}
              onClick={onPrev} 
              className="absolute left-4 md:left-12 w-14 h-14 flex items-center justify-center text-foreground/30 hover:text-foreground transition-all z-[5001] bg-foreground/5 hover:bg-foreground/10 rounded-full backdrop-blur-sm border border-foreground/5"
            >
              <Icon name="chevron-left" size={32} />
            </motion.button>
            <div className="relative w-full h-full flex flex-col items-center justify-center max-w-7xl mx-auto">
              <motion.div 
                layoutId={\`image-\${image.id}\`} 
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="relative group"
              >
                <img src={image.url} alt={image.title} className="max-w-full max-h-[75vh] md:max-h-[80vh] object-contain rounded-sm shadow-[0_80px_150px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:scale-[1.02]" />
                <div className="absolute -inset-4 bg-foreground/5 blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-10 text-center">
                <h2 className="text-foreground text-3xl md:text-5xl font-serif italic tracking-tight leading-none">{image.title}</h2>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="h-[1px] w-8 bg-foreground/20" />
                  <p className="text-foreground/40 text-[10px] md:text-[12px] uppercase tracking-[0.4em] font-bold">{image.category} — {image.year}</p>
                  <div className="h-[1px] w-8 bg-foreground/20" />
                </div>
              </motion.div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1, x: 5 }} whileTap={{ scale: 0.9 }}
              onClick={onNext} 
              className="absolute right-4 md:right-12 w-14 h-14 flex items-center justify-center text-foreground/30 hover:text-foreground transition-all z-[5001] bg-foreground/5 hover:bg-foreground/10 rounded-full backdrop-blur-sm border border-foreground/5"
            >
              <Icon name="chevron-right" size={32} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SettingSlider = ({ label, value, min, max, step, onChange }: any) => (
  <div className="flex flex-col gap-3">
    <div className="flex justify-between items-center">
      <label className="text-foreground/40 text-[9px] uppercase tracking-widest font-bold">{label}</label>
      <span className="text-foreground font-mono text-[10px]">{value.toFixed(label.includes('Frequency') ? 4 : 1)}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full h-1 bg-foreground/10 rounded-full appearance-none cursor-pointer accent-foreground" />
  </div>
);

const SettingsPanel = ({ isOpen, onClose, settings, onSettingsChange, onReset, showGrid, onGridToggle }: any) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed top-0 right-0 h-[100dvh] w-full sm:w-80 bg-background/90 backdrop-blur-3xl border-l border-foreground/10 z-[2000] p-6 md:p-8 flex flex-col gap-8 shadow-[-20px_0_50px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground text-xs uppercase tracking-[0.3em] font-bold">Settings</h2>
          <div className="flex items-center gap-4">
            <button onClick={onReset} className="w-10 h-10 flex items-center justify-center text-foreground/30 hover:text-foreground active:scale-90"><Icon name="rotate-ccw" size={16} /></button>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-foreground/30 hover:text-foreground active:scale-90"><Icon name="x" size={20} /></button>
          </div>
        </div>
        <div className="flex flex-col gap-8 overflow-y-auto pr-2 custom-scrollbar pb-24">
          <div className="space-y-6">
            <h3 className="text-foreground/20 text-[8px] uppercase tracking-[0.4em] font-bold border-b border-foreground/5 pb-2">Visuals</h3>
            <div className="flex items-center justify-between">
              <label className="text-foreground/40 text-[9px] uppercase tracking-widest font-bold">Background Grid</label>
              <button 
                onClick={onGridToggle}
                className={\`w-10 h-5 rounded-full transition-all duration-300 relative \${showGrid ? "bg-foreground" : "bg-foreground/10"}\`}
              >
                <div className={\`absolute top-1 w-3 h-3 rounded-full transition-all duration-300 \${showGrid ? "right-1 bg-background" : "left-1 bg-foreground/40"}\`} />
              </button>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-foreground/20 text-[8px] uppercase tracking-[0.4em] font-bold border-b border-foreground/5 pb-2">Movement</h3>
            <SettingSlider label="Wave Amplitude" value={settings.amplitude} min={0} max={400} step={1} onChange={(v: any) => onSettingsChange({...settings, amplitude: v})} />
            <SettingSlider label="Wave Frequency" value={settings.frequency} min={0.0001} max={0.01} step={0.0001} onChange={(v: any) => onSettingsChange({...settings, frequency: v})} />
            <SettingSlider label="Item Spacing" value={settings.spacing} min={20} max={200} step={1} onChange={(v: any) => onSettingsChange({...settings, spacing: v})} />
          </div>
          <div className="space-y-6">
            <h3 className="text-foreground/20 text-[8px] uppercase tracking-[0.4em] font-bold border-b border-foreground/5 pb-2">Physics</h3>
            <SettingSlider label="Scroll Sensitivity" value={settings.scrollSensitivity} min={0.1} max={5} step={0.1} onChange={(v: any) => onSettingsChange({...settings, scrollSensitivity: v})} />
            <SettingSlider label="Drag Sensitivity" value={settings.dragSensitivity} min={0.1} max={5} step={0.1} onChange={(v: any) => onSettingsChange({...settings, dragSensitivity: v})} />
            <SettingSlider label="Inertia Decay" value={settings.inertiaDecay} min={0.8} max={0.99} step={0.01} onChange={(v: any) => onSettingsChange({...settings, inertiaDecay: v})} />
          </div>
          <div className="space-y-6">
            <h3 className="text-foreground/20 text-[8px] uppercase tracking-[0.4em] font-bold border-b border-foreground/5 pb-2">Disperse</h3>
            <SettingSlider label="Disperse Radius" value={settings.disperseRadius} min={50} max={800} step={10} onChange={(v: any) => onSettingsChange({...settings, disperseRadius: v})} />
            <SettingSlider label="Disperse Strength" value={settings.disperseStrength} min={0} max={600} step={10} onChange={(v: any) => onSettingsChange({...settings, disperseStrength: v})} />
            <SettingSlider label="Disperse Ratio" value={settings.disperseRatio} min={0} max={1} step={0.01} onChange={(v: any) => onSettingsChange({...settings, disperseRatio: v})} />
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const WaveSystem = ({ onImageClick, settings, hoveredId, setHoveredId }: any) => {
  const [introProgress, setIntroProgress] = useState(0);
  const currentPosX = useRef(0);
  const velocity = useRef(0);
  const isDragging = useRef(false);
  const isClickCandidate = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const lastDragX = useRef(0);
  const clickedItemId = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.to({ val: 0 }, { val: 1, duration: 2.5, delay: 1, ease: "power4.out", onUpdate: function() { setIntroProgress(this.targets()[0].val); } });
  }, []);

  const handlePointerDown = (e: any) => {
    isDragging.current = true;
    isClickCandidate.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    lastDragX.current = e.clientX;
    velocity.current = 0;
    
    const target = e.target as HTMLElement;
    const itemElement = target.closest('[data-wave-item]');
    clickedItemId.current = itemElement?.getAttribute('data-id') || null;
    
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging.current) return;
    const dist = Math.hypot(e.clientX - dragStartPos.current.x, e.clientY - dragStartPos.current.y);
    if (dist > 10) isClickCandidate.current = false;
    const deltaX = e.clientX - lastDragX.current;
    lastDragX.current = e.clientX;
    currentPosX.current -= deltaX * settings.dragSensitivity;
    velocity.current = -deltaX * settings.dragSensitivity;
  };

  const handlePointerUp = (e: any) => {
    if (isClickCandidate.current && clickedItemId.current) {
      const id = clickedItemId.current;
      const img = IMAGES.find(i => i.id === id);
      if (img) {
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
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => { velocity.current += e.deltaY * settings.scrollSensitivity * 0.05; };
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [settings]);

  useEffect(() => {
    const update = (time: number) => {
      if (!isDragging.current) {
        currentPosX.current += velocity.current;
        velocity.current *= settings.inertiaDecay;
        currentPosX.current += Math.sin(time * 0.0008) * 0.3;
      }

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
        const centerDist = Math.abs(x);
        let offsetX = 0, offsetY = 0;

        if (centerDist < settings.disperseRadius) {
          const factor = Math.pow(1 - (centerDist / settings.disperseRadius), 2) * settings.disperseRatio;
          const angle = (index / IMAGES.length) * Math.PI * 2 * 15;
          const strength = settings.disperseStrength * factor;
          offsetX = Math.cos(angle) * strength;
          offsetY = Math.sin(angle) * strength;
        }

        const normalizedCenterDist = Math.abs(x) / halfWidth;
        const safeDist = Math.min(1, Math.max(0, normalizedCenterDist));
        const scale = 0.4 + (1.2 * Math.pow(1 - safeDist, 1.5));
        const isHovered = hoveredId === IMAGES[index].id;
        
        const renderScale = isHovered ? scale * 1.6 : scale;
        const blur = isHovered ? 0 : safeDist * 8;
        const zIndex = Math.floor((1 - safeDist) * 100);

        el.style.transform = \`translate3d(calc(-50% + \${x + offsetX}px), calc(-50% + \${basePathY + offsetY}px), 0) scale(\${renderScale})\`;
        el.style.filter = blur > 0.5 ? \`blur(\${blur}px)\` : 'none';
        el.style.zIndex = isHovered ? "1000" : zIndex.toString();
      });
    };
    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, [hoveredId, settings]);

  return (
    <div ref={containerRef} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} className="fixed inset-0 z-[100] touch-none select-none">
      {IMAGES.map((img, i) => (
        <WaveItem key={img.id} ref={(el: any) => itemRefs.current[i] = el} image={img} isHovered={hoveredId === img.id} onHover={setHoveredId} introProgress={introProgress} />
      ))}
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [scrollSettings, setScrollSettings] = useState(${JSON.stringify(settings, null, 2)});
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [introFinished, setIntroFinished] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [gridVisible, setGridVisible] = useState(false);
  const [waveStart, setWaveStart] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const timer1 = setTimeout(() => setGridVisible(true), 500);
    const timer2 = setTimeout(() => setWaveStart(true), 2500);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  const handlePrev = () => {
    const idx = IMAGES.findIndex(i => i.id === selectedImage.id);
    setSelectedImage(IMAGES[(idx - 1 + IMAGES.length) % IMAGES.length]);
  };

  const handleNext = () => {
    const idx = IMAGES.findIndex(i => i.id === selectedImage.id);
    setSelectedImage(IMAGES[(idx + 1) % IMAGES.length]);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background text-foreground font-sans selection:bg-foreground selection:text-background">
      <motion.div
        animate={{
          filter: selectedImage ? 'blur(8px)' : 'blur(0px)',
          scale: selectedImage ? 0.98 : 1,
        }}
        transition={{ duration: 0.5, ease: "circOut" }}
        className="w-full h-full"
      >
        <BackgroundGrid visible={gridVisible && showGrid} />
        <Navbar onSettingsClick={() => setIsSettingsOpen(true)} />
        <HeroLayout introFinished={introFinished} layer="bg" />
        <WaveSystem 
          settings={scrollSettings} 
          onImageClick={setSelectedImage} 
          hoveredId={hoveredId} 
          setHoveredId={setHoveredId}
          onIntroFinish={() => setIntroFinished(true)}
          startIntro={waveStart}
        />
        <HeroLayout introFinished={introFinished} layer="fg" />
      </motion.div>
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} settings={scrollSettings} onSettingsChange={setScrollSettings} onReset={() => setScrollSettings(${JSON.stringify(settings, null, 2)})} showGrid={showGrid} onGridToggle={() => setShowGrid(!showGrid)} />
      <Lightbox image={selectedImage} isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} onPrev={handlePrev} onNext={handleNext} />
      <div className="fixed bottom-6 left-6 md:bottom-8 md:right-8 md:left-auto z-[1000] flex items-center gap-4 text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-foreground/20 font-bold">
        <span className="hidden sm:inline">Scroll or Drag to Explore</span>
        <div className="hidden sm:block w-12 h-[1px] bg-foreground/10" />
        <span>© 2026 — Motion Wave</span>
      </div>
      <style>{\`
        :root { --background: 255 255 255; --foreground: 0 0 0; }
        .dark { --background: 0 0 0; --foreground: 255 255 255; }
        .bg-background { background-color: rgb(var(--background)); }
        .text-foreground { color: rgb(var(--foreground)); }
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(var(--foreground), 0.1); border-radius: 10px; }
        
        /* View Transitions */
        html { view-transition-name: none; }
        ::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
        ::view-transition-old(root) { z-index: 1; }
        ::view-transition-new(root) { z-index: 2147483647; }
        ::view-transition-group(root) { animation-duration: 0.7s; }
      \`}</style>
    </div>
  );
}
`;
  };

  const generateHTML = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const tsxCode = generateTSX();
    
    // Clean up the TSX code for HTML environment
    const cleanedCode = tsxCode
      .replace(/import\s+type\s+.*?;/g, '')
      .replace(/import\s+.*?;/g, '')
      .replace(/export\s+default\s+function\s+App/, 'function App')
      .replace(/export\s+const\s+/g, 'const ')
      .replace(/export\s+interface\s+/g, 'interface ')
      .replace(/export\s+type\s+/g, 'type ');

    const parts = [
      '<!DOCTYPE html>',
      '<html lang="en" class="' + (isDark ? 'dark' : '') + '">',
      '<head>',
      '    <meta charset="UTF-8">',
      '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '    <title>Motion Wave Gallery - Full Export</title>',
      '    <script src="https://cdn.tailwindcss.com"></script>',
      '    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>',
      '    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>',
      '    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>',
      '    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>',
      '    <script src="https://unpkg.com/framer-motion@10.16.4/dist/framer-motion.js"></script>',
      '    <script src="https://unpkg.com/lucide@latest"></script>',
      '    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;1,400&display=swap" rel="stylesheet">',
      '    <style>',
      '        :root { --background: 255 255 255; --foreground: 0 0 0; }',
      '        .dark { --background: 0 0 0; --foreground: 255 255 255; }',
      '        body { background-color: rgb(var(--background)); color: rgb(var(--foreground)); margin: 0; font-family: \'Inter\', sans-serif; overflow: hidden; }',
      '        .font-serif { font-family: \'Playfair Display\', serif; }',
      '        .custom-scrollbar::-webkit-scrollbar { width: 2px; }',
      '        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }',
      '        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(var(--foreground), 0.1); border-radius: 10px; }',
      '    </style>',
      '</head>',
      '<body>',
      '    <div id="root"></div>',
      '    <script type="text/babel" data-presets="typescript,react">',
      '        const { useEffect, useRef, useState, useCallback, forwardRef, useMemo } = React;',
      '        const { motion, AnimatePresence } = window.Motion || window.FramerMotion || {};',
      '        const Icons = {};',
      '        ',
      '        const cn = (...classes) => classes.filter(Boolean).join(\' \');',
      '',
      '        const Icon = ({ name, size = 20, className = "" }) => {',
      '            const iconRef = useRef(null);',
      '            useEffect(() => {',
      '                if (typeof lucide !== "undefined" && iconRef.current) {',
      '                    lucide.createIcons({',
      '                        attrs: { "stroke-width": 2, "width": size, "height": size, "class": className },',
      '                        nameAttr: "data-lucide"',
      '                    });',
      '                }',
      '            }, [name, size, className]);',
      '            return <i data-lucide={name} ref={iconRef} className={className} style={{ width: size, height: size, display: "inline-block" }}></i>;',
      '        };',
      cleanedCode,
      '        const root = ReactDOM.createRoot(document.getElementById(\'root\'));',
      '        root.render(<App />);',
      '    </script>',
      '</body>',
      '</html>'
    ];

    return parts.join('\n');
  };

  const copyToClipboard = async (type: 'tsx' | 'html') => {
    const code = type === 'tsx' ? generateTSX() : generateHTML();
    try {
      await navigator.clipboard.writeText(code);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[3000] flex items-center justify-center bg-background/80 backdrop-blur-xl p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-background border border-foreground/10 rounded-2xl p-6 md:p-8 max-w-2xl w-full flex flex-col gap-6 md:gap-8 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="text-foreground text-lg font-serif italic">Export Full Application</h2>
                <p className="text-foreground/40 text-[10px] uppercase tracking-widest font-bold">Navbar, Hero, Gallery & Settings included</p>
              </div>
              <button onClick={onClose} className="text-foreground/30 hover:text-foreground transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group relative bg-foreground/5 border border-foreground/10 rounded-xl p-6 flex flex-col gap-4 hover:border-foreground/30 transition-all duration-500">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <FileCode size={20} />
                  </div>
                  <div>
                    <h3 className="text-foreground font-bold text-sm">Full React App</h3>
                    <p className="text-foreground/40 text-[10px]">TSX + Framer + GSAP</p>
                  </div>
                </div>
                <p className="text-foreground/60 text-xs leading-relaxed">
                  A complete React application file including all UI components, animations, and your current settings.
                </p>
                <button
                  onClick={() => copyToClipboard('tsx')}
                  className="mt-4 w-full py-3 bg-foreground text-background rounded-lg text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                >
                  {copiedType === 'tsx' ? <Check size={14} /> : <Copy size={14} />}
                  {copiedType === 'tsx' ? 'Copied Full App!' : 'Copy Full TSX App'}
                </button>
              </div>

              <div className="group relative bg-foreground/5 border border-foreground/10 rounded-xl p-6 flex flex-col gap-4 hover:border-foreground/30 transition-all duration-500">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h3 className="text-foreground font-bold text-sm">Full HTML Site</h3>
                    <p className="text-foreground/40 text-[10px]">Single File + CDNs</p>
                  </div>
                </div>
                <p className="text-foreground/60 text-xs leading-relaxed">
                  A standalone HTML file containing the entire UI, styles, and logic. Works instantly in any browser.
                </p>
                <button
                  onClick={() => copyToClipboard('html')}
                  className="mt-4 w-full py-3 bg-foreground text-background rounded-lg text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                >
                  {copiedType === 'html' ? <Check size={14} /> : <Copy size={14} />}
                  {copiedType === 'html' ? 'Copied Full Site!' : 'Copy Full HTML Site'}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-foreground/5">
              <p className="text-[9px] text-foreground/20 uppercase tracking-[0.2em] text-center">
                The generated code mirrors the current theme and all active gallery settings.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
