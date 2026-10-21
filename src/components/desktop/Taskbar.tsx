import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sparkles,
  Wifi,
  Bluetooth,
  Volume2,
  BatteryCharging,
  Bell,
  Cpu,
  Monitor,
  X,
  ChevronUp,
  Folder,
  FileText,
  Globe,
  Image as ImageIcon,
  Activity,
  Terminal,
  Calculator,
  Music,
  Settings as SettingsIcon,
  Camera,
  Download,
  Box,
} from 'lucide-react';
import { WindowInstance, AppDefinition } from '../../types/desktop';
import { RamStats } from '../../utils/ramManager';

interface TaskbarProps {
  windows: WindowInstance[];
  activeWindowId: string | null;
  apps: AppDefinition[];
  ramStats: RamStats;
  unreadNotifsCount: number;
  isStartMenuOpen: boolean;
  isQuickSettingsOpen: boolean;
  isNotificationsOpen: boolean;
  onToggleStartMenu: () => void;
  onToggleQuickSettings: () => void;
  onToggleNotifications: () => void;
  onToggleAppSwitcher: () => void;
  onShowDesktop: () => void;
  onWindowClick: (winId: string) => void;
  onCloseWindow: (winId: string) => void;
  onOpenApp: (appId: string) => void;
  onOptimizeRam: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  activeWindowId,
  apps,
  ramStats,
  unreadNotifsCount,
  isStartMenuOpen,
  isQuickSettingsOpen,
  isNotificationsOpen,
  onToggleStartMenu,
  onToggleQuickSettings,
  onToggleNotifications,
  onToggleAppSwitcher,
  onShowDesktop,
  onWindowClick,
  onCloseWindow,
  onOpenApp,
  onOptimizeRam,
}) => {
  const [hoveredWindowId, setHoveredWindowId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
      );
      setCurrentDate(
        now.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getAppIcon = (iconName: string) => {
    switch (iconName) {
      case 'folder':
        return <Folder className="w-5 h-5 text-sky-400" />;
      case 'file-text':
        return <FileText className="w-5 h-5 text-amber-400" />;
      case 'globe':
        return <Globe className="w-5 h-5 text-blue-400" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-emerald-400" />;
      case 'activity':
        return <Activity className="w-5 h-5 text-rose-400" />;
      case 'terminal':
        return <Terminal className="w-5 h-5 text-emerald-400" />;
      case 'calculator':
        return <Calculator className="w-5 h-5 text-orange-400" />;
      case 'music':
        return <Music className="w-5 h-5 text-violet-400" />;
      case 'settings':
        return <SettingsIcon className="w-5 h-5 text-slate-300" />;
      case 'camera':
        return <Camera className="w-5 h-5 text-red-400" />;
      case 'download':
        return <Download className="w-5 h-5 text-cyan-400" />;
      default:
        return <Box className="w-5 h-5 text-blue-400" />;
    }
  };

  // Pinned default apps for dock
  const pinnedAppIds = ['files', 'browser', 'notes', 'gallery', 'taskmgr'];

  return (
    <nav
      aria-label="Taskbar"
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-0 inset-x-0 h-14 glass-dock z-40 px-3 flex items-center justify-between gap-2 select-none shadow-2xl"
    >
      {/* Left Section: Start Button, Overview, Show Desktop */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Xiaomi HyperOS / DeX Start Button */}
        <button
          onClick={onToggleStartMenu}
          aria-label="Menu Mulai"
          className={`h-10 px-3 rounded-xl flex items-center gap-2 transition-all cursor-pointer font-bold text-xs ${
            isStartMenuOpen
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
              : 'hover:bg-white/10 text-white'
          }`}
        >
          {/* Stylized Xiaomi / DeX logo glyph */}
          <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-xs">
            <div className="w-2.5 h-2.5 border-2 border-white rounded-xs rotate-45" />
          </div>
          <span className="hidden sm:inline-block font-semibold">Mulai</span>
        </button>

        {/* Multi-Window Overview / Exposé Switcher */}
        <button
          onClick={onToggleAppSwitcher}
          aria-label="Pengalih Aplikasi"
          className="h-10 w-10 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all"
          title="Pengalih Jendela (Alt + Tab)"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Show Desktop Button */}
        <button
          onClick={onShowDesktop}
          aria-label="Tampilkan Desktop"
          className="h-10 w-8 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all"
          title="Tampilkan Desktop (Win + D)"
        >
          <div className="w-1.5 h-4 bg-slate-400/80 rounded-full" />
        </button>
      </div>

      {/* Middle Section: Pinned and Running App Windows */}
      <div className="flex-1 min-w-0 flex items-center justify-start gap-1.5 overflow-x-auto py-1 px-2">
        {/* Pinned apps that might not be running */}
        {pinnedAppIds.map((pinnedId) => {
          const appDef = apps.find((a) => a.id === pinnedId);
          if (!appDef) return null;
          const runningInstance = windows.find((w) => w.appId === pinnedId);

          if (runningInstance) return null; // rendered in open windows

          return (
            <button
              key={pinnedId}
              onClick={() => onOpenApp(pinnedId)}
              className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all relative group shrink-0"
              title={appDef.name}
            >
              {getAppIcon(appDef.icon)}
            </button>
          );
        })}

        {/* Running Windows */}
        {windows.map((win) => {
          const isActive = win.id === activeWindowId && !win.isMinimized;
          return (
            <div
              key={win.id}
              className="relative shrink-0"
              onMouseEnter={() => setHoveredWindowId(win.id)}
              onMouseLeave={() => setHoveredWindowId(null)}
            >
              <button
                onClick={() => onWindowClick(win.id)}
                className={`h-10 px-3 rounded-xl flex items-center gap-2 transition-all relative border shrink-0 ${
                  isActive
                    ? 'bg-white/15 border-blue-500/50 text-white shadow-md'
                    : win.isMinimized
                    ? 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                }`}
              >
                {getAppIcon(win.icon)}
                <span className="text-xs font-medium max-w-[110px] truncate hidden md:inline-block">
                  {win.title}
                </span>

                {/* Active status indicator dot */}
                <div
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 rounded-full transition-all ${
                    isActive ? 'w-4 bg-blue-500 shadow-xs' : 'w-1.5 bg-slate-400/60'
                  }`}
                />
              </button>

              {/* Hover Live Thumbnail Preview */}
              {hoveredWindowId === win.id && (
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 p-3 rounded-2xl glass-panel shadow-2xl z-50 flex flex-col gap-2 pointer-events-auto">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span className="truncate pr-1">{win.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseWindow(win.id);
                      }}
                      className="p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 rounded"
                      title="Tutup Jendela"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="h-20 bg-slate-900 rounded-lg border border-white/10 flex items-center justify-center p-2 text-center text-[10px] text-slate-400">
                    <div>
                      <div className="text-blue-400 font-bold mb-0.5">{win.ramUsageMb} MB RAM</div>
                      <span>{win.isFrozen ? 'Dibekukan di Latar' : 'Berjalan Normal'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Right Section: System Tray & Control Center */}
      <div className="flex items-center gap-2 shrink-0">
        {/* RAM Status & Instant Boost Button */}
        <div className="hidden lg:flex items-center bg-slate-900/80 border border-white/10 rounded-xl px-2.5 py-1 gap-2">
          <div className="flex items-center gap-1.5 text-xs">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-300 font-mono text-[11px]">
              {(ramStats.usedMb / 1024).toFixed(1)}/{(ramStats.totalMb / 1024).toFixed(0)} GB
            </span>
          </div>

          <button
            onClick={onOptimizeRam}
            className="p-1 rounded-lg bg-blue-600/30 hover:bg-blue-500 text-blue-300 hover:text-white transition-all text-xs"
            title="Optimalkan & Bersihkan RAM Sekarang"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
          </button>
        </div>

        {/* Quick Settings Pill (Wi-Fi, Volume, Battery) */}
        <button
          onClick={onToggleQuickSettings}
          className={`h-10 px-3 rounded-xl flex items-center gap-2.5 transition-all border ${
            isQuickSettingsOpen
              ? 'bg-blue-600 text-white border-blue-500 shadow-md'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
          }`}
        >
          <Wifi className="w-3.5 h-3.5" />
          <Volume2 className="w-3.5 h-3.5 hidden sm:inline-block" />
          <div className="flex items-center gap-1 text-xs font-semibold">
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline-block">88%</span>
          </div>
        </button>

        {/* Clock & Date */}
        <button
          onClick={onToggleNotifications}
          className={`h-10 px-3 rounded-xl flex items-center gap-2 transition-all border ${
            isNotificationsOpen
              ? 'bg-blue-600 text-white border-blue-500'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
          }`}
        >
          <div className="flex flex-col text-right leading-tight">
            <span className="text-xs font-bold font-mono">{currentTime}</span>
            <span className="text-[10px] text-slate-400 hidden sm:inline-block">{currentDate}</span>
          </div>

          {/* Notification bell badge */}
          <div className="relative ml-1">
            <Bell className="w-3.5 h-3.5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900" />
            )}
          </div>
        </button>
      </div>
    </nav>
  );
};
