import React from 'react';
import { Settings2, Code } from 'lucide-react';
import { AnimatedThemeToggler } from './AnimatedThemeToggler';
import { AudioPlayer } from './AudioPlayer';

interface NavbarProps {
  onSettingsClick: () => void;
  onExportClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSettingsClick, onExportClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-4 py-4 md:px-12 md:py-10 pointer-events-none">
      <div className="flex items-center gap-4 md:gap-12 pointer-events-auto">
        <a href="#" className="text-foreground font-bold text-lg md:text-xl tracking-tighter">Motion</a>
        <div className="hidden md:flex items-center gap-8 text-foreground/30 text-[10px] uppercase tracking-[0.3em] font-bold">
          <a href="#" className="hover:text-foreground transition-all duration-500">Gallery</a>
          <a href="#" className="hover:text-foreground transition-all duration-500">Pricing</a>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-6 pointer-events-auto">
        <AudioPlayer />
        <AnimatedThemeToggler />
        
        <button 
          onClick={onExportClick}
          className="w-10 h-10 flex items-center justify-center text-foreground/20 hover:text-foreground transition-all duration-500 active:scale-90"
          title="Export Code"
        >
          <Code size={18} />
        </button>

        <button 
          onClick={onSettingsClick}
          className="w-10 h-10 flex items-center justify-center text-foreground/20 hover:text-foreground transition-all duration-500 active:scale-90"
          title="Gallery Settings"
        >
          <Settings2 size={18} />
        </button>
      </div>
    </nav>
  );
};
