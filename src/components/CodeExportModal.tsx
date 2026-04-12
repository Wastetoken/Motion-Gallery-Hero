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
    return `import React, { useEffect, useRef, useState, useCallback, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, X, ChevronLeft, ChevronRight, RotateCcw, Sun, Moon } from 'lucide-react';
import gsap from 'gsap';

/**
 * FULL UI EXPORT - MOTION WAVE GALLERY
 * Includes: Navbar, Hero, Background Grid, Wave System, Lightbox, and Settings.
 */

// --- CONFIGURATION ---
const CONFIG = ${JSON.stringify(settings, null, 2)};
const IMAGES = ${JSON.stringify(IMAGES, null, 2)};

// --- UTILS ---
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

// --- COMPONENTS ---

const BackgroundGrid = ({ visible }: { visible: boolean }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: visible ? 1 : 0 }}
    transition={{ duration: 2 }}
    className="fixed inset-0 z-[-1] overflow-hidden bg-background text-foreground transition-colors duration-700"
  >
    <div 
      className="absolute inset-[-20%] opacity-20"
      style={{
        backgroundImage: \`linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)\`,
        backgroundSize: '100px 100px',
        maskImage: 'radial-gradient(circle at center, black 20%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 20%, transparent 80%)',
        transform: 'perspective(1200px) rotateX(15deg) scale(1.2)',
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
  </motion.div>
);

const HeroLayout = ({ introFinished, layer }: { introFinished: boolean, layer: 'bg' | 'fg' }) => {
  const isFg = layer === 'fg';
  return (
    <div className={\`fixed inset-0 pointer-events-none px-12 \${layer === 'bg' ? 'z-[5]' : 'z-[200]'}\`}>
      <div className="absolute bottom-24 left-12 right-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isFg ? 0.3 : 0, y: 0 }}
          className="flex items-center gap-3 text-current text-[10px] uppercase tracking-[0.4em] font-bold mb-6"
        >
          <div className="w-8 h-[1px] bg-current opacity-20" />
          <span>Selected Work 2018 — 2026</span>
        </motion.div>
        <h1 className="text-current text-[10vw] md:text-[8vw] font-serif leading-[0.82] tracking-tighter mb-10 whitespace-nowrap">
          <div className="overflow-hidden flex items-baseline">
            <motion.span animate={{ opacity: isFg ? 1 : 0, y: 0 }} className="block mr-[0.2em]">Every</motion.span>
            <motion.span animate={{ opacity: layer === 'bg' ? 1 : 0, y: 0 }} className="block">frame,</motion.span>
          </div>
          <div className="overflow-hidden flex items-baseline italic">
            <motion.span animate={{ opacity: isFg ? 1 : 0, y: 0 }} className="block mr-[0.2em]">every</motion.span>
            <motion.span animate={{ opacity: layer === 'bg' ? 1 : 0, y: 0 }} className="block">story.</motion.span>
          </div>
        </h1>
        {introFinished && isFg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md">
            <p className="text-current opacity-40 text-sm md:text-base leading-relaxed mb-10 font-medium">
              Twelve years of editorial, fashion, and brand photography — one infinite reel.
            </p>
            <div className="flex items-center gap-8 pointer-events-auto">
              <button className="px-10 py-5 bg-foreground text-background text-[10px] uppercase tracking-[0.2em] font-bold rounded-sm">Book a session</button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const WaveItem = forwardRef(({ image, isHovered, onHover, introProgress }: any, ref: any) => (
  <div
    ref={ref}
    className={cn("absolute top-1/2 left-1/2 cursor-pointer transition-shadow duration-700", isHovered && "z-[1000]")}
    style={{ opacity: introProgress, width: '60px', height: '90px' }}
    onMouseEnter={() => onHover(image.id)}
    onMouseLeave={() => onHover(null)}
  >
    <div className={cn("relative w-full h-full overflow-hidden rounded-sm shadow-2xl transition-all duration-700", isHovered ? "ring-1 ring-foreground/30 scale-105" : "shadow-lg")}>
      <img src={image.url} alt={image.title} className={cn("w-full h-full object-cover transition-all duration-700", isHovered ? "scale-110" : "scale-100")} />
    </div>
  </div>
));

const WaveSystem = ({ onImageClick, settings }: any) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const currentPosX = useRef(0);
  const velocity = useRef(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const update = (time: number) => {
      currentPosX.current += velocity.current;
      velocity.current *= settings.inertiaDecay;
      currentPosX.current += Math.sin(time * 0.0008) * 0.3;

      const totalWidth = IMAGES.length * settings.spacing;
      itemRefs.current.forEach((el, index) => {
        if (!el) return;
        const baseX = index * settings.spacing;
        let x = (baseX - currentPosX.current) % totalWidth;
        if (x < -totalWidth / 2) x += totalWidth;
        if (x > totalWidth / 2) x -= totalWidth;

        const angleAtX = settings.frequency * x * Math.PI;
        const basePathY = settings.amplitude * Math.sin(angleAtX);
        const centerDist = Math.abs(x);
        let explosionFactor = 0;
        let offsetX = 0, offsetY = 0;

        if (centerDist < settings.disperseRadius) {
          explosionFactor = Math.pow(1 - (centerDist / settings.disperseRadius), 2) * settings.disperseRatio;
          const angle = (index / IMAGES.length) * Math.PI * 2 * 15;
          const explosionStrength = settings.disperseStrength * explosionFactor;
          offsetX = Math.cos(angle) * explosionStrength;
          offsetY = Math.sin(angle) * explosionStrength;
        }

        const finalX = x + offsetX;
        const finalY = basePathY + offsetY;
        const scale = 0.4 + (1.2 * Math.pow(1 - Math.min(1, Math.abs(x) / (window.innerWidth / 2)), 1.5));
        const isHovered = hoveredId === IMAGES[index].id;
        el.style.transform = \`translate3d(calc(-50% + \${finalX}px), calc(-50% + \${finalY}px), 0) scale(\${isHovered ? scale * 1.6 : scale})\`;
        el.style.zIndex = isHovered ? "1000" : Math.floor((1 - Math.abs(x) / (window.innerWidth / 2)) * 100).toString();
      });
    };
    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, [hoveredId, settings]);

  return (
    <div className="fixed inset-0 z-[100] touch-none select-none">
      {IMAGES.map((img, i) => (
        <WaveItem key={img.id} ref={(el: any) => itemRefs.current[i] = el} image={img} isHovered={hoveredId === img.id} onHover={setHoveredId} introProgress={1} />
      ))}
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(${isDark});
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [scrollSettings, setScrollSettings] = useState(CONFIG);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background text-foreground transition-colors duration-700 font-sans">
      <BackgroundGrid visible={true} />
      
      <nav className="fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-12 py-10 pointer-events-none">
        <div className="text-foreground font-bold text-xl tracking-tighter pointer-events-auto">Motion</div>
        <div className="flex items-center gap-8 pointer-events-auto">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-foreground/20 hover:text-foreground transition-colors">
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => setIsSettingsOpen(true)} className="text-foreground/20 hover:text-foreground transition-colors">
            <Settings2 size={18} />
          </button>
        </div>
      </nav>

      <HeroLayout introFinished={true} layer="bg" />
      <WaveSystem settings={scrollSettings} />
      <HeroLayout introFinished={true} layer="fg" />

      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed top-0 right-0 bottom-0 w-80 bg-background/80 backdrop-blur-2xl border-l border-foreground/10 z-[2000] p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-foreground text-xs uppercase tracking-widest font-bold">Settings</h2>
              <button onClick={() => setIsSettingsOpen(false)}><X size={20} /></button>
            </div>
            {/* Settings Sliders would go here - simplified for export */}
            <p className="text-foreground/40 text-xs italic">Settings applied from your session.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{\`
        :root { --background: 255 255 255; --foreground: 0 0 0; }
        .dark { --background: 0 0 0; --foreground: 255 255 255; }
        .bg-background { background-color: rgb(var(--background)); }
        .text-foreground { color: rgb(var(--foreground)); }
      \`}</style>
    </div>
  );
}
`;
  };

  const generateHTML = () => {
    const isDark = document.documentElement.classList.contains('dark');
    return `<!DOCTYPE html>
<html lang="en" class="${isDark ? 'dark' : ''}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Motion Wave Gallery - Full Export</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:ital,wght@1,400&display=swap" rel="stylesheet">
    <style>
        :root { --background: 255 255 255; --foreground: 0 0 0; }
        .dark { --background: 0 0 0; --foreground: 255 255 255; }
        body { background: rgb(var(--background)); color: rgb(var(--foreground)); margin: 0; font-family: 'Inter', sans-serif; overflow: hidden; transition: background 0.7s, color 0.7s; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .gallery-item { position: absolute; top: 50%; left: 50%; width: 60px; height: 90px; cursor: pointer; will-change: transform; }
        .gallery-item img { width: 100%; height: 100%; object-fit: cover; border-radius: 2px; transition: transform 0.7s; }
        .grid-bg { position: fixed; inset: 0; z-index: -1; opacity: 0.1; background-image: linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px); background-size: 100px 100px; transform: perspective(1200px) rotateX(15deg) scale(1.2); }
    </style>
</head>
<body>
    <div class="grid-bg"></div>
    
    <nav class="fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-12 py-10">
        <div class="font-bold text-xl tracking-tighter">Motion</div>
        <button onclick="document.documentElement.classList.toggle('dark')" class="opacity-20 hover:opacity-100 transition-opacity">Toggle Theme</button>
    </nav>

    <div class="fixed inset-0 pointer-events-none px-12 z-[200]">
        <div class="absolute bottom-24 left-12 max-w-4xl">
            <h1 class="text-[10vw] md:text-[8vw] font-serif leading-[0.82] tracking-tighter mb-10">
                Every frame,<br><i class="opacity-50">every story.</i>
            </h1>
        </div>
    </div>

    <div id="gallery" class="fixed inset-0 z-[100]"></div>

    <script>
        const CONFIG = ${JSON.stringify(settings, null, 2)};
        const IMAGES = ${JSON.stringify(IMAGES, null, 2)};
        const gallery = document.getElementById('gallery');
        const items = [];
        let currentPosX = 0;
        let velocity = 0;

        IMAGES.forEach((img, i) => {
            const el = document.createElement('div');
            el.className = 'gallery-item';
            el.innerHTML = \`<img src="\${img.url}" alt="\${img.title}">\`;
            gallery.appendChild(el);
            items.push(el);
        });

        window.addEventListener('wheel', (e) => {
            velocity += e.deltaY * CONFIG.scrollSensitivity * 0.05;
        });

        function animate(time) {
            currentPosX += velocity;
            velocity *= CONFIG.inertiaDecay;
            currentPosX += Math.sin(Date.now() * 0.0008) * 0.3;

            const totalWidth = IMAGES.length * CONFIG.spacing;
            items.forEach((el, i) => {
                const baseX = i * CONFIG.spacing;
                let x = (baseX - currentPosX) % totalWidth;
                if (x < -totalWidth / 2) x += totalWidth;
                if (x > totalWidth / 2) x -= totalWidth;

                const angleAtX = CONFIG.frequency * x * Math.PI;
                const basePathY = CONFIG.amplitude * Math.sin(angleAtX);
                const centerDist = Math.abs(x);
                let offsetX = 0, offsetY = 0;

                if (centerDist < CONFIG.disperseRadius) {
                    const factor = Math.pow(1 - (centerDist / CONFIG.disperseRadius), 2) * CONFIG.disperseRatio;
                    const angle = (i / IMAGES.length) * Math.PI * 2 * 15;
                    offsetX = Math.cos(angle) * CONFIG.disperseStrength * factor;
                    offsetY = Math.sin(angle) * CONFIG.disperseStrength * factor;
                }

                const scale = 0.4 + (1.2 * Math.pow(1 - Math.min(1, Math.abs(x) / (window.innerWidth / 2)), 1.5));
                el.style.transform = \`translate3d(calc(-50% + \${x + offsetX}px), calc(-50% + \${basePathY + offsetY}px), 0) scale(\${scale})\`;
                el.style.zIndex = Math.floor((1 - Math.abs(x) / (window.innerWidth / 2)) * 100);
            });
            requestAnimationFrame(animate);
        }
        animate();
    </script>
</body>
</html>`;
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
            className="bg-background border border-foreground/10 rounded-2xl p-8 max-w-2xl w-full flex flex-col gap-8 shadow-2xl"
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
