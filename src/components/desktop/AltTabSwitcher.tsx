import React from 'react';
import { WindowInstance } from '../../types/desktop';
import {
  Folder,
  FileText,
  Globe,
  Image as ImageIcon,
  Activity,
  Terminal,
  Calculator,
  Music,
  Settings,
  Camera,
  Download,
  Box,
  X,
} from 'lucide-react';

interface AltTabSwitcherProps {
  isOpen: boolean;
  windows: WindowInstance[];
  activeWindowId: string | null;
  onSelectWindow: (winId: string) => void;
  onClose: () => void;
}

export const AltTabSwitcher: React.FC<AltTabSwitcherProps> = ({
  isOpen,
  windows,
  activeWindowId,
  onSelectWindow,
  onClose,
}) => {
  if (!isOpen || windows.length === 0) return null;

  const getAppIcon = (iconName: string) => {
    switch (iconName) {
      case 'folder':
        return <Folder className="w-8 h-8 text-sky-400" />;
      case 'file-text':
        return <FileText className="w-8 h-8 text-amber-400" />;
      case 'globe':
        return <Globe className="w-8 h-8 text-blue-400" />;
      case 'image':
        return <ImageIcon className="w-8 h-8 text-emerald-400" />;
      case 'activity':
        return <Activity className="w-8 h-8 text-rose-400" />;
      case 'terminal':
        return <Terminal className="w-8 h-8 text-emerald-400" />;
      case 'calculator':
        return <Calculator className="w-8 h-8 text-orange-400" />;
      case 'music':
        return <Music className="w-8 h-8 text-violet-400" />;
      case 'settings':
        return <Settings className="w-8 h-8 text-slate-300" />;
      case 'camera':
        return <Camera className="w-8 h-8 text-red-400" />;
      case 'download':
        return <Download className="w-8 h-8 text-cyan-400" />;
      default:
        return <Box className="w-8 h-8 text-blue-400" />;
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6 select-none animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-panel max-w-4xl w-full p-6 rounded-3xl border border-white/20 shadow-2xl flex flex-col gap-4"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white">Pengalih Jendela Multitasking (Alt + Tab)</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pilih jendela untuk langsung membawa ke depan
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto p-1">
          {windows.map((win) => {
            const isCurrent = win.id === activeWindowId;
            return (
              <div
                key={win.id}
                onClick={() => {
                  onSelectWindow(win.id);
                  onClose();
                }}
                className={`group p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center ${
                  isCurrent
                    ? 'bg-blue-600/30 border-blue-500 ring-2 ring-blue-500 shadow-xl scale-102'
                    : 'bg-slate-900/60 border-white/10 hover:bg-slate-800 hover:border-white/25 hover:scale-102'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-white/10 flex items-center justify-center mb-3 shadow-inner group-hover:scale-105 transition-transform">
                  {getAppIcon(win.icon)}
                </div>

                <div className="font-bold text-xs text-white truncate w-full mb-1">
                  {win.title}
                </div>

                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="text-slate-400 font-mono">{win.ramUsageMb} MB RAM</span>
                  {win.isFrozen && (
                    <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
                      Dibekukan
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
