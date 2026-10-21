import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music as MusicIcon, Shuffle, Repeat } from 'lucide-react';

export const MusicApp: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [progress, setProgress] = useState(30);

  const playlist = [
    { title: 'HyperOS Ambient Motion', artist: 'Xiaomi Sound Lab', duration: '3:45' },
    { title: 'Midnight Lo-Fi Coding', artist: 'Chilled Cow', duration: '2:50' },
    { title: 'Snapdragon Turbo Wave', artist: 'Adreno Synth', duration: '4:12' },
    { title: 'DeX Multitasking Beats', artist: 'Workstation FM', duration: '3:15' },
  ];

  const currentTrack = playlist[currentTrackIdx];

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((p) => (p >= 100 ? 0 : p + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 overflow-hidden select-none p-5">
      {/* Album Artwork & Visualizer */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-36 h-36 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-xl border border-white/20 relative group overflow-hidden">
          <MusicIcon className={`w-14 h-14 text-white/90 ${isPlaying ? 'scale-110' : ''} transition-transform duration-500`} />

          {/* Animated visualizer overlay */}
          {isPlaying && (
            <div className="absolute inset-x-0 bottom-2 flex items-end justify-center gap-1.5 h-8 px-4">
              {[40, 80, 50, 100, 70, 90, 60, 85].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-white/80 rounded-full animate-bounce"
                  style={{
                    height: `${h}%`,
                    animationDuration: `${0.4 + (i % 4) * 0.2}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <h3 className="font-bold text-sm text-white mt-4">{currentTrack.title}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{currentTrack.artist}</p>
        <span className="mt-1 text-[10px] text-cyan-400 font-medium">Dolby Atmos • 4 Speaker Stereo</span>
      </div>

      {/* Progress scrub */}
      <div className="w-full space-y-1 mb-3">
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden cursor-pointer">
          <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>01:15</span>
          <span>{currentTrack.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-2">
        <button className="text-slate-400 hover:text-white transition-colors">
          <Shuffle className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setCurrentTrackIdx((idx) => (idx === 0 ? playlist.length - 1 : idx - 1));
            setProgress(0);
          }}
          className="text-slate-300 hover:text-white transition-colors"
        >
          <SkipBack className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <button
          onClick={() => {
            setCurrentTrackIdx((idx) => (idx + 1) % playlist.length);
            setProgress(0);
          }}
          className="text-slate-300 hover:text-white transition-colors"
        >
          <SkipForward className="w-5 h-5" />
        </button>
        <button className="text-slate-400 hover:text-white transition-colors">
          <Repeat className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
