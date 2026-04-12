import React, { useState, useCallback, useEffect } from 'react';
import { BackgroundGrid } from './components/BackgroundGrid';
import { Navbar } from './components/Navbar';
import { HeroBackground, HeroForeground } from './components/Hero';
import { WaveSystem } from './components/WaveSystem';
import { Lightbox } from './components/Lightbox';
import { SettingsPanel, ScrollSettings } from './components/SettingsPanel';
import { CodeExportModal } from './components/CodeExportModal';
import { IMAGES, PortfolioImage, WAVE_CONFIG } from './constants';

export default function App() {
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(null);
  const [introFinished, setIntroFinished] = useState(false);
  const [gridVisible, setGridVisible] = useState(false);
  const [waveStart, setWaveStart] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [scrollSettings, setScrollSettings] = useState<ScrollSettings>(WAVE_CONFIG);
  const [showGrid, setShowGrid] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    // Intro Sequence Timing
    const timer1 = setTimeout(() => setGridVisible(true), 500);
    const timer2 = setTimeout(() => setWaveStart(true), 2500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handlePrev = useCallback(() => {
    if (!selectedImage) return;
    const currentIndex = IMAGES.findIndex(img => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + IMAGES.length) % IMAGES.length;
    setSelectedImage(IMAGES[prevIndex]);
  }, [selectedImage]);

  const handleNext = useCallback(() => {
    if (!selectedImage) return;
    const currentIndex = IMAGES.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % IMAGES.length;
    setSelectedImage(IMAGES[nextIndex]);
  }, [selectedImage]);

  return (
    <div className={`relative w-full h-screen overflow-hidden font-sans selection:bg-foreground selection:text-background bg-background text-foreground`}>
      <BackgroundGrid visible={gridVisible && showGrid} />
      <Navbar 
        onSettingsClick={() => setIsSettingsOpen(true)}
        onExportClick={() => setIsExportOpen(true)}
      />
      
      <HeroBackground introFinished={introFinished} />

      <WaveSystem 
        onImageClick={setSelectedImage} 
        onIntroFinish={() => setIntroFinished(true)}
        startIntro={waveStart}
        settings={scrollSettings}
      />
      
      <HeroForeground introFinished={introFinished} />

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(!isSettingsOpen)}
        settings={scrollSettings}
        onSettingsChange={setScrollSettings}
        onReset={() => setScrollSettings(WAVE_CONFIG)}
        showGrid={showGrid}
        onGridToggle={() => setShowGrid(!showGrid)}
      />

      <CodeExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        settings={scrollSettings}
      />
      
      <Lightbox 
        image={selectedImage} 
        onClose={() => setSelectedImage(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      {/* Custom cursor or other subtle UI elements could go here */}
      <div className="fixed bottom-6 left-6 md:bottom-8 md:right-8 md:left-auto z-[1000] flex items-center gap-4 text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-foreground/20 font-bold">
        <span className="hidden sm:inline">Scroll or Drag to Explore</span>
        <div className="hidden sm:block w-12 h-[1px] bg-foreground/10" />
        <span>© 2026 — Motion Wave</span>
      </div>
    </div>
  );
}
