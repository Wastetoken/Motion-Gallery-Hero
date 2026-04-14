import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Using a subtle ambient track
  const AUDIO_URL = "https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3";

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log("Audio play blocked by browser", err));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center gap-3">
      <audio ref={audioRef} src={AUDIO_URL} loop />
      <button
        onClick={togglePlay}
        className="w-10 h-10 flex items-center justify-center text-foreground/20 hover:text-foreground transition-all duration-500 active:scale-90"
        title={isPlaying ? "Mute Ambient" : "Play Ambient"}
      >
        {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>
    </div>
  );
};
