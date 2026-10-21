import React from 'react';
import {
  Wifi,
  Bluetooth,
  Zap,
  Volume2,
  Sun,
  Moon,
  Camera,
  BellOff,
  Sparkles,
  Cpu,
  Monitor,
  Check,
} from 'lucide-react';
import { SystemSettings } from '../../types/desktop';
import { RamStats } from '../../utils/ramManager';

interface QuickSettingsProps {
  isOpen: boolean;
  settings: SystemSettings;
  ramStats: RamStats;
  onClose: () => void;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
  onOptimizeRam: () => void;
  onTakeScreenshot: () => void;
}

export const QuickSettings: React.FC<QuickSettingsProps> = ({
  isOpen,
  settings,
  ramStats,
  onClose,
  onUpdateSettings,
  onOptimizeRam,
  onTakeScreenshot,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-16 right-3 w-80 glass-panel rounded-2xl shadow-2xl z-50 p-4 border border-white/20 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-200 select-none"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <span className="text-xs font-bold text-white uppercase tracking-wider">
          Pusat Kontrol Pad 6
        </span>
        <span className="text-[10px] text-blue-400 font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30">
          DeX Workstation
        </span>
      </div>

      {/* Quick Action Tiles */}
      <div className="grid grid-cols-3 gap-2">
        {/* Wi-Fi */}
        <button
          onClick={() => onUpdateSettings({ wifiEnabled: !settings.wifiEnabled })}
          className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
            settings.wifiEnabled
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <Wifi className="w-4 h-4" />
          <span className="text-[10px] font-semibold">Wi-Fi 6</span>
        </button>

        {/* Bluetooth */}
        <button
          onClick={() => onUpdateSettings({ bluetoothEnabled: !settings.bluetoothEnabled })}
          className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
            settings.bluetoothEnabled
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <Bluetooth className="w-4 h-4" />
          <span className="text-[10px] font-semibold">Bluetooth</span>
        </button>

        {/* Performance Mode */}
        <button
          onClick={() =>
            onUpdateSettings({
              performanceMode:
                settings.performanceMode === 'performance' ? 'balanced' : 'performance',
            })
          }
          className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
            settings.performanceMode === 'performance'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span className="text-[10px] font-semibold">
            {settings.performanceMode === 'performance' ? 'Turbo SD870' : 'Seimbang'}
          </span>
        </button>

        {/* Screenshot */}
        <button
          onClick={onTakeScreenshot}
          className="p-3 rounded-xl bg-slate-800/80 hover:bg-white/10 text-slate-300 hover:text-white flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span className="text-[10px] font-semibold">Tangkapan</span>
        </button>

        {/* DND */}
        <button
          onClick={() => onUpdateSettings({ dndEnabled: !settings.dndEnabled })}
          className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
            settings.dndEnabled
              ? 'bg-purple-600 text-white'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <BellOff className="w-4 h-4" />
          <span className="text-[10px] font-semibold">Senyap</span>
        </button>

        {/* Auto Freeze */}
        <button
          onClick={() => onUpdateSettings({ autoFreezeInactive: !settings.autoFreezeInactive })}
          className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
            settings.autoFreezeInactive
              ? 'bg-cyan-600 text-white'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span className="text-[10px] font-semibold">Auto Hemat</span>
        </button>
      </div>

      {/* Sliders */}
      <div className="space-y-3 bg-slate-950/60 p-3 rounded-xl border border-white/5">
        {/* Brightness */}
        <div className="flex items-center gap-3">
          <Sun className="w-4 h-4 text-amber-400 shrink-0" />
          <input
            type="range"
            min="20"
            max="100"
            value={settings.brightness}
            onChange={(e) => onUpdateSettings({ brightness: Number(e.target.value) })}
            className="w-full accent-blue-500 cursor-pointer"
          />
          <span className="text-[10px] font-mono text-slate-400 w-8 text-right">
            {settings.brightness}%
          </span>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-blue-400 shrink-0" />
          <input
            type="range"
            min="0"
            max="100"
            value={settings.soundVolume}
            onChange={(e) => onUpdateSettings({ soundVolume: Number(e.target.value) })}
            className="w-full accent-blue-500 cursor-pointer"
          />
          <span className="text-[10px] font-mono text-slate-400 w-8 text-right">
            {settings.soundVolume}%
          </span>
        </div>
      </div>

      {/* RAM Clean & Boost Button */}
      <button
        onClick={onOptimizeRam}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-98 transition-all cursor-pointer"
      >
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span>Bersihkan & Optimalkan RAM ({ramStats.freeMb} MB Bebas)</span>
      </button>
    </div>
  );
};
