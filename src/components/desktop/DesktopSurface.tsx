import React, { useState } from 'react';
import {
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
  Plus,
  RefreshCw,
  Sparkles,
  LayoutGrid,
  Monitor,
} from 'lucide-react';
import { AppDefinition, FileItem, SystemSettings } from '../../types/desktop';

interface DesktopSurfaceProps {
  settings: SystemSettings;
  apps: AppDefinition[];
  onOpenApp: (appId: string) => void;
  onOpenSettings: () => void;
  onOpenTaskManager: () => void;
  onOptimizeRam: () => void;
  onCreateNewNote: () => void;
  onDropFileToDesktop: (fileData: any) => void;
  onDesktopClick?: () => void;
  onOpenScanner?: () => void;
  children?: React.ReactNode;
}

export const DesktopSurface: React.FC<DesktopSurfaceProps> = ({
  settings,
  apps,
  onOpenApp,
  onOpenSettings,
  onOpenTaskManager,
  onOptimizeRam,
  onCreateNewNote,
  onDropFileToDesktop,
  onDesktopClick,
  onOpenScanner,
  children,
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

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
        return <SettingsIcon className="w-8 h-8 text-slate-300" />;
      case 'camera':
        return <Camera className="w-8 h-8 text-red-400" />;
      case 'download':
        return <Download className="w-8 h-8 text-cyan-400" />;
      default:
        return <Box className="w-8 h-8 text-blue-400" />;
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        onDropFileToDesktop(JSON.parse(data));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      onClick={() => {
        setSelectedAppId(null);
        closeContextMenu();
        onDesktopClick?.();
      }}
      onContextMenu={handleContextMenu}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="fixed inset-0 select-none overflow-hidden bg-cover bg-center transition-all duration-700"
      style={{
        backgroundImage: `linear-gradient(rgba(10, 15, 30, 0.35), rgba(10, 15, 30, 0.45)), url(${settings.wallpaper})`,
      }}
    >
      {/* Desktop Icons Grid */}
      <div className="absolute top-4 left-4 grid grid-flow-col grid-rows-6 gap-3 z-10 w-fit pointer-events-auto">
        {apps.slice(0, 12).map((app) => {
          const isSelected = selectedAppId === app.id;
          return (
            <div
              key={app.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAppId(app.id);
                closeContextMenu();
              }}
              onDoubleClick={() => onOpenApp(app.id)}
              className={`w-24 h-24 p-2 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all border ${
                isSelected
                  ? 'bg-blue-600/35 border-blue-400/60 shadow-lg ring-1 ring-blue-400'
                  : 'bg-black/15 hover:bg-white/10 border-transparent hover:border-white/15'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900/60 backdrop-blur-xs border border-white/10 flex items-center justify-center shadow-md mb-1.5 transition-transform group-hover:scale-105">
                {getAppIcon(app.icon)}
              </div>
              <span className="text-[11px] font-semibold text-white drop-shadow-md truncate w-full px-1">
                {app.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Right-click Context Menu */}
      {contextMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 w-56 glass-panel rounded-2xl shadow-2xl p-1.5 border border-white/20 flex flex-col gap-0.5 text-xs select-none animate-in fade-in zoom-in-95 duration-100"
          style={{
            left: Math.min(contextMenu.x, window.innerWidth - 230),
            top: Math.min(contextMenu.y, window.innerHeight - 260),
          }}
        >
          <button
            onClick={() => {
              onCreateNewNote();
              closeContextMenu();
            }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-blue-600 text-slate-200 hover:text-white transition-colors text-left"
          >
            <Plus className="w-4 h-4 text-blue-400" />
            <span>Buat Catatan Cepat</span>
          </button>

          <button
            onClick={() => {
              onOptimizeRam();
              closeContextMenu();
            }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-blue-600 text-slate-200 hover:text-white transition-colors text-left"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Optimalkan RAM Pad 6</span>
          </button>

          <button
            onClick={() => {
              onOpenTaskManager();
              closeContextMenu();
            }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-blue-600 text-slate-200 hover:text-white transition-colors text-left"
          >
            <Activity className="w-4 h-4 text-rose-400" />
            <span>Buka Manajer Kinerja</span>
          </button>

          {onOpenScanner && (
            <button
              onClick={() => {
                onOpenScanner();
                closeContextMenu();
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-blue-600 text-slate-200 hover:text-white transition-colors text-left"
            >
              <LayoutGrid className="w-4 h-4 text-emerald-400" />
              <span>📱 Pindai Aplikasi Tablet Pad 6</span>
            </button>
          )}

          <div className="h-px bg-white/10 my-1" />

          <button
            onClick={() => {
              onOpenSettings();
              closeContextMenu();
            }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-blue-600 text-slate-200 hover:text-white transition-colors text-left"
          >
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <span>Ubah Wallpaper Desktop</span>
          </button>

          <button
            onClick={() => {
              onOpenSettings();
              closeContextMenu();
            }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-blue-600 text-slate-200 hover:text-white transition-colors text-left"
          >
            <Monitor className="w-4 h-4 text-sky-400" />
            <span>Pengaturan Layar 144Hz</span>
          </button>
        </div>
      )}

      {/* Render open windows and floating elements */}
      {children}
    </div>
  );
};
