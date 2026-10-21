import React, { useState } from 'react';
import { Download, Plus, Check, Sparkles, Smartphone, Layers, Search } from 'lucide-react';
import { AppDefinition } from '../../types/desktop';

interface AppStoreAppProps {
  installedApps: AppDefinition[];
  onInstallApp: (app: AppDefinition) => void;
  onOpenApp: (appId: string) => void;
}

export const AppStoreApp: React.FC<AppStoreAppProps> = ({
  installedApps,
  onInstallApp,
  onOpenApp,
}) => {
  const [search, setSearch] = useState('');
  const [customAppName, setCustomAppName] = useState('');
  const [customAppDesc, setCustomAppDesc] = useState('');
  const [customCategory, setCustomCategory] = useState<AppDefinition['category']>('tools');
  const [showAddCustom, setShowAddCustom] = useState(false);

  const availableCatalog: AppDefinition[] = [
    {
      id: 'vscode',
      name: 'Visual Studio Code',
      icon: 'code',
      category: 'productivity',
      defaultWidth: 920,
      defaultHeight: 600,
      minWidth: 500,
      minHeight: 400,
      baseRamMb: 210,
      description: 'Editor kode profesional dengan dukungan terminal dan ekstensi',
    },
    {
      id: 'discord',
      name: 'Discord Workstation',
      icon: 'message-circle',
      category: 'productivity',
      defaultWidth: 840,
      defaultHeight: 560,
      minWidth: 480,
      minHeight: 380,
      baseRamMb: 190,
      description: 'Komunikasi suara, video, dan chat komunitas developer',
    },
    {
      id: 'spotify',
      name: 'Spotify Music',
      icon: 'music',
      category: 'multimedia',
      defaultWidth: 780,
      defaultHeight: 520,
      minWidth: 440,
      minHeight: 360,
      baseRamMb: 160,
      description: 'Streaming musik dan podcast kualitas tinggi',
    },
    {
      id: 'figma',
      name: 'Figma Design',
      icon: 'layout',
      category: 'productivity',
      defaultWidth: 960,
      defaultHeight: 620,
      minWidth: 520,
      minHeight: 400,
      baseRamMb: 260,
      description: 'Desain antarmuka kolaboratif berbasis vektor untuk tablet',
    },
    {
      id: 'telegram',
      name: 'Telegram Desktop',
      icon: 'send',
      category: 'productivity',
      defaultWidth: 760,
      defaultHeight: 540,
      minWidth: 420,
      minHeight: 360,
      baseRamMb: 140,
      description: 'Pengiriman pesan instan cepat, aman, dan tanpa batas berkas',
    },
    {
      id: 'youtube',
      name: 'YouTube Multitasking',
      icon: 'video',
      category: 'multimedia',
      defaultWidth: 820,
      defaultHeight: 540,
      minWidth: 460,
      minHeight: 360,
      baseRamMb: 230,
      description: 'Tonton video tutorial sembari mengetik di jendela sebelah',
    },
  ];

  const isInstalled = (id: string) => installedApps.some((a) => a.id === id);

  const handleInstallCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAppName.trim()) return;

    const id = `custom-${Date.now()}`;
    const newApp: AppDefinition = {
      id,
      name: customAppName.trim(),
      icon: 'box',
      category: customCategory,
      defaultWidth: 740,
      defaultHeight: 500,
      minWidth: 400,
      minHeight: 300,
      baseRamMb: 120,
      description: customAppDesc.trim() || 'Aplikasi Android kustom dibuka dalam jendela terpisah',
      canMultiInstance: true,
    };

    onInstallApp(newApp);
    setCustomAppName('');
    setCustomAppDesc('');
    setShowAddCustom(false);
  };

  const filteredCatalog = availableCatalog.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 overflow-hidden select-none">
      {/* Header bar */}
      <div className="p-4 bg-slate-950/70 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Download className="w-4 h-4 text-blue-400" />
            Manajer Aplikasi & Ekosistem Multi-Jendela
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Jalankan aplikasi tablet Android dalam mode jendela terpisah secara simultan
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddCustom(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pasang Aplikasi Baru (APK/Web)</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-2.5 bg-slate-900/40 border-b border-white/5 flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari katalog aplikasi produktivitas tablet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800/80 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Aplikasi Siap Dipasang Untuk Xiaomi Pad 6
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredCatalog.map((app) => {
            const installed = isInstalled(app.id);
            return (
              <div
                key={app.id}
                className="p-3.5 rounded-xl bg-slate-800/40 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white truncate">{app.name}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-white/10 text-slate-300">
                      ~{app.baseRamMb} MB RAM
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{app.description}</p>
                </div>

                <div className="shrink-0">
                  {installed ? (
                    <button
                      onClick={() => onOpenApp(app.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold hover:bg-emerald-500/30 transition-all flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Buka Jendela</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onInstallApp(app)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Pasang</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sideload Custom App Modal */}
      {showAddCustom && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleInstallCustom}
            className="w-96 bg-slate-800 border border-white/20 rounded-2xl p-5 shadow-2xl flex flex-col gap-3"
          >
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Pasang Aplikasi Tablet Tambahan
            </h3>
            <p className="text-xs text-slate-400">
              Tambahkan aplikasi apa pun yang terpasang di perangkat Anda untuk dapat dibuka dalam mode jendela terpisah.
            </p>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Nama Aplikasi</label>
              <input
                type="text"
                required
                placeholder="Contoh: Canva, Notion, Zoom, WhatsApp"
                value={customAppName}
                onChange={(e) => setCustomAppName(e.target.value)}
                className="w-full bg-slate-900 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Deskripsi Singkat</label>
              <input
                type="text"
                placeholder="Contoh: Aplikasi produktivitas harian"
                value={customAppDesc}
                onChange={(e) => setCustomAppDesc(e.target.value)}
                className="w-full bg-slate-900 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Kategori</label>
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value as any)}
                className="w-full bg-slate-900 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="productivity">Produktivitas & Kerja</option>
                <option value="multimedia">Multimedia & Hiburan</option>
                <option value="tools">Alat & Utilitas</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowAddCustom(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md"
              >
                Pasang & Buka Jendela
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
