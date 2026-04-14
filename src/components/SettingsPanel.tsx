import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Settings2, RotateCcw } from 'lucide-react';

export interface ScrollSettings {
  amplitude: number;
  frequency: number;
  spacing: number;
  scrollSensitivity: number;
  dragSensitivity: number;
  inertiaDecay: number;
  disperseRadius: number;
  disperseStrength: number;
  disperseRatio: number;
  pathYOffset: number;
  pathZOffset: number;
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ScrollSettings;
  onSettingsChange: (settings: ScrollSettings) => void;
  onReset: () => void;
  showGrid: boolean;
  onGridToggle: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  onReset,
  showGrid,
  onGridToggle,
}) => {
  const handleChange = (key: keyof ScrollSettings, value: number) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-[100dvh] w-full sm:w-80 bg-background/90 backdrop-blur-3xl border-l border-foreground/10 z-[2000] p-6 md:p-8 flex flex-col gap-8 pointer-events-auto shadow-[-20px_0_50px_rgba(0,0,0,0.2)]"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-foreground text-xs uppercase tracking-[0.3em] font-bold">Gallery Settings</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={onReset}
                className="w-10 h-10 flex items-center justify-center text-foreground/30 hover:text-foreground transition-colors active:scale-90"
                title="Reset to Default"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-foreground/30 hover:text-foreground transition-colors active:scale-90"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-8 overflow-y-auto pr-2 custom-scrollbar pb-24">
            <div className="space-y-6">
              <h3 className="text-foreground/20 text-[8px] uppercase tracking-[0.4em] font-bold border-b border-foreground/5 pb-2">Visuals</h3>
              <div className="flex items-center justify-between">
                <label className="text-foreground/40 text-[9px] uppercase tracking-widest font-bold">Background Grid</label>
                <button 
                  onClick={onGridToggle}
                  className={`w-10 h-5 rounded-full transition-all duration-300 relative ${showGrid ? "bg-foreground" : "bg-foreground/10"}`}
                >
                  <div className={`absolute top-1 w-3 h-3 rounded-full transition-all duration-300 ${showGrid ? "right-1 bg-background" : "left-1 bg-foreground/40"}`} />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-foreground/20 text-[8px] uppercase tracking-[0.4em] font-bold border-b border-foreground/5 pb-2">Movement</h3>
              <SettingSlider
                label="Wave Amplitude"
                value={settings.amplitude}
                min={0}
                max={400}
                step={1}
                onChange={(v) => handleChange('amplitude', v)}
              />
              <SettingSlider
                label="Wave Frequency"
                value={settings.frequency}
                min={0.0001}
                max={0.01}
                step={0.0001}
                onChange={(v) => handleChange('frequency', v)}
              />
              <SettingSlider
                label="Item Spacing"
                value={settings.spacing}
                min={20}
                max={200}
                step={1}
                onChange={(v) => handleChange('spacing', v)}
              />
            </div>

            <div className="space-y-6">
              <h3 className="text-foreground/20 text-[8px] uppercase tracking-[0.4em] font-bold border-b border-foreground/5 pb-2">Physics</h3>
              <SettingSlider
                label="Scroll Sensitivity"
                value={settings.scrollSensitivity}
                min={0.1}
                max={5}
                step={0.1}
                onChange={(v) => handleChange('scrollSensitivity', v)}
              />
              <SettingSlider
                label="Drag Sensitivity"
                value={settings.dragSensitivity}
                min={0.1}
                max={5}
                step={0.1}
                onChange={(v) => handleChange('dragSensitivity', v)}
              />
              <SettingSlider
                label="Inertia Decay"
                value={settings.inertiaDecay}
                min={0.8}
                max={0.99}
                step={0.01}
                onChange={(v) => handleChange('inertiaDecay', v)}
              />
            </div>

            <div className="space-y-6">
              <h3 className="text-foreground/20 text-[8px] uppercase tracking-[0.4em] font-bold border-b border-foreground/5 pb-2">Disperse</h3>
              <SettingSlider
                label="Disperse Radius"
                value={settings.disperseRadius}
                min={50}
                max={800}
                step={10}
                onChange={(v) => handleChange('disperseRadius', v)}
              />
              <SettingSlider
                label="Disperse Strength"
                value={settings.disperseStrength}
                min={0}
                max={600}
                step={10}
                onChange={(v) => handleChange('disperseStrength', v)}
              />
              <SettingSlider
                label="Disperse Ratio"
                value={settings.disperseRatio}
                min={0}
                max={1}
                step={0.01}
                onChange={(v) => handleChange('disperseRatio', v)}
              />
            </div>
            <div className="space-y-6">
              <h3 className="text-foreground/20 text-[8px] uppercase tracking-[0.4em] font-bold border-b border-foreground/5 pb-2">Path Layout</h3>
              <SettingSlider
                label="Path Y Offset (Up/Down)"
                value={settings.pathYOffset}
                min={-500}
                max={500}
                step={1}
                onChange={(v) => handleChange('pathYOffset', v)}
              />
              <SettingSlider
                label="Path Z Offset (In/Out)"
                value={settings.pathZOffset}
                min={-1000}
                max={500}
                step={1}
                onChange={(v) => handleChange('pathZOffset', v)}
              />
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-foreground/5">
            <p className="text-[9px] text-foreground/20 uppercase tracking-widest leading-relaxed">
              Fine-tune the sinusoidal wave system and interaction physics.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface SettingSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

const SettingSlider: React.FC<SettingSliderProps> = ({ label, value, min, max, step, onChange }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <label className="text-foreground/40 text-[9px] uppercase tracking-widest font-bold">{label}</label>
        <span className="text-foreground font-mono text-[10px]">{value.toFixed(label.includes('Frequency') ? 4 : 1)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-foreground/10 rounded-full appearance-none cursor-pointer accent-foreground hover:bg-foreground/20 transition-colors"
      />
    </div>
  );
};
