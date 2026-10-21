import React, { useState } from 'react';
import { Camera, SwitchCamera, Sparkles, Circle, CheckCircle2 } from 'lucide-react';

interface CameraAppProps {
  onCapturePhoto?: (photoUrl: string) => void;
}

export const CameraApp: React.FC<CameraAppProps> = ({ onCapturePhoto }) => {
  const [lens, setLens] = useState<'back' | 'front'>('back');
  const [filter, setFilter] = useState<'normal' | 'vivid' | 'cinema' | 'mono'>('vivid');
  const [isShutterActive, setIsShutterActive] = useState(false);
  const [lastShot, setLastShot] = useState<string | null>(null);

  const sampleImages = {
    back: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    front: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
  };

  const handleCapture = () => {
    setIsShutterActive(true);
    const photoUrl = sampleImages[lens];
    setLastShot(photoUrl);
    setTimeout(() => {
      setIsShutterActive(false);
      onCapturePhoto?.(photoUrl);
    }, 250);
  };

  return (
    <div className="flex flex-col h-full w-full bg-black text-white overflow-hidden select-none relative">
      {/* Viewfinder area */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <img
          src={sampleImages[lens]}
          alt="Viewfinder"
          className={`w-full h-full object-cover transition-all duration-300 ${
            filter === 'mono'
              ? 'grayscale contrast-125'
              : filter === 'cinema'
              ? 'sepia-20 contrast-110 saturate-125'
              : filter === 'vivid'
              ? 'saturate-150 contrast-105'
              : ''
          }`}
        />

        {/* Shutter flash animation */}
        {isShutterActive && <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-200" />}

        {/* Tablet camera frame overlay */}
        <div className="absolute inset-4 border border-white/20 rounded-2xl pointer-events-none flex flex-col justify-between p-4">
          <div className="flex justify-between items-center text-[11px] font-mono text-white/80 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full w-fit">
            <span>{lens === 'back' ? 'Kamera Belakang 13 MP HDR' : 'Kamera Depan 8 MP FocusFrame'}</span>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-12 h-12 border border-white/40 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
            </div>
          </div>

          <div className="text-[10px] text-white/70 text-right">
            2.8K 30 FPS • Auto Focus
          </div>
        </div>
      </div>

      {/* Camera bottom controls bar */}
      <div className="h-20 bg-black/90 border-t border-white/10 px-6 flex items-center justify-between shrink-0">
        <button
          onClick={() => setLens((l) => (l === 'back' ? 'front' : 'back'))}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white"
          title="Beralih Kamera Depan / Belakang"
        >
          <SwitchCamera className="w-5 h-5" />
        </button>

        {/* Shutter Button */}
        <button
          onClick={handleCapture}
          className="w-14 h-14 rounded-full border-4 border-white p-1 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          <div className="w-full h-full rounded-full bg-white active:bg-slate-300" />
        </button>

        {/* Filter selector */}
        <div className="flex items-center gap-1.5">
          {(['normal', 'vivid', 'cinema', 'mono'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-1 rounded-md text-[10px] font-bold capitalize transition-colors ${
                filter === f ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/60 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
