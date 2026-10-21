import React, { useState } from 'react';
import {
  Search,
  Power,
  RotateCcw,
  Lock,
  LogOut,
  Settings,
  Cpu,
  Layers,
  Sparkles,
  Folder,
  FileText,
  Globe,
  Image as ImageIcon,
  Activity,
  Terminal,
  Calculator,
  Music,
  Camera,
  Download,
  Box,
  MessageCircle,
  Video,
  Mail,
  Send,
  ShieldCheck,
  Film,
  Cloud,
  Clock,
  ShoppingBag,
  MapPin,
} from 'lucide-react';
import { AppDefinition } from '../../types/desktop';

interface StartMenuProps {
  isOpen: boolean;
  apps: AppDefinition[];
  onOpenApp: (appId: string) => void;
  onClose: () => void;
  onOpenSettings: () => void;
  onExitDeX: () => void;
  onOpenScanner?: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  apps,
  onOpenApp,
  onClose,
  onOpenSettings,
  onExitDeX,
  onOpenScanner,
}) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');

  if (!isOpen) return null;

  const getAppIcon = (iconName: string) => {
    switch (iconName) {
      case 'folder':
        return <Folder className="w-6 h-6 text-sky-400" />;
      case 'file-text':
        return <FileText className="w-6 h-6 text-amber-400" />;
      case 'globe':
        return <Globe className="w-6 h-6 text-blue-400" />;
      case 'image':
        return <ImageIcon className="w-6 h-6 text-emerald-400" />;
      case 'activity':
        return <Activity className="w-6 h-6 text-rose-400" />;
      case 'terminal':
        return <Terminal className="w-6 h-6 text-emerald-400" />;
      case 'calculator':
        return <Calculator className="w-6 h-6 text-orange-400" />;
      case 'music':
        return <Music className="w-6 h-6 text-violet-400" />;
      case 'settings':
        return <Settings className="w-6 h-6 text-slate-300" />;
      case 'camera':
        return <Camera className="w-6 h-6 text-red-400" />;
      case 'download':
        return <Download className="w-6 h-6 text-cyan-400" />;
      case 'message-circle':
        return <MessageCircle className="w-6 h-6 text-emerald-400" />;
      case 'video':
        return <Video className="w-6 h-6 text-rose-500" />;
      case 'mail':
        return <Mail className="w-6 h-6 text-amber-500" />;
      case 'send':
        return <Send className="w-6 h-6 text-sky-400" />;
      case 'shield-check':
        return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      case 'film':
        return <Film className="w-6 h-6 text-rose-600" />;
      case 'cloud':
        return <Cloud className="w-6 h-6 text-blue-400" />;
      case 'clock':
        return <Clock className="w-6 h-6 text-orange-400" />;
      case 'shopping-bag':
        return <ShoppingBag className="w-6 h-6 text-emerald-500" />;
      case 'map-pin':
        return <MapPin className="w-6 h-6 text-green-400" />;
      default:
        return <Box className="w-6 h-6 text-blue-400" />;
    }
  };

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase()) ||
      (app.packageName && app.packageName.toLowerCase().includes(search.toLowerCase()));
    
    if (category === 'device') {
      return matchesSearch && app.isInstalledOnDevice;
    }
    const matchesCat = category === 'all' || app.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-16 left-3 w-96 max-h-[590px] glass-panel rounded-2xl shadow-2xl z-50 flex flex-col border border-white/20 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      {/* Search Header */}
      <div className="p-3.5 border-b border-white/10 bg-slate-900/60">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari aplikasi terinstall, berkas, atau paket..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800/80 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            autoFocus
          />
        </div>
      </div>

      {/* Device App Sync Quick Banner */}
      <div className="px-3.5 py-2 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/30 border-b border-blue-500/20 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-blue-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="font-semibold text-[11px]">Aplikasi Pad 6 Terbaca ({apps.filter((a) => a.isInstalledOnDevice).length})</span>
        </div>
        {onOpenScanner && (
          <button
            onClick={() => {
              onOpenScanner();
              onClose();
            }}
            className="px-2 py-0.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] shadow-xs cursor-pointer"
          >
            Pindai / Tambah
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="px-3.5 py-2 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        {[
          { id: 'all', name: 'Semua' },
          { id: 'device', name: '📱 Terpasang Pad 6' },
          { id: 'social', name: 'Sosial & Chat' },
          { id: 'productivity', name: 'Produktivitas' },
          { id: 'multimedia', name: 'Multimedia' },
          { id: 'system', name: 'Sistem' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 ${
              category === cat.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Apps Grid */}
      <div className="flex-1 p-3.5 overflow-y-auto max-h-80">
        <div className="grid grid-cols-4 gap-2.5">
          {filteredApps.map((app) => (
            <button
              key={app.id}
              onClick={() => {
                onOpenApp(app.id);
                onClose();
              }}
              className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/10 transition-all text-center group cursor-pointer active:scale-95"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center mb-1.5 group-hover:scale-105 group-hover:border-white/25 transition-all shadow-sm">
                {getAppIcon(app.icon)}
              </div>
              <span className="text-[11px] font-medium text-slate-200 line-clamp-2 leading-tight group-hover:text-white">
                {app.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* User profile & Power footer */}
      <div className="p-3 bg-slate-950/80 border-t border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            XP
          </div>
          <div>
            <div className="font-bold text-white leading-none">Xiaomi Pad 6</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Mode Workstation DeX</div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
            title="Pengaturan"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={onExitDeX}
            className="p-1.5 rounded-lg hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
            title="Kunci / Keluar Mode Desktop"
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
