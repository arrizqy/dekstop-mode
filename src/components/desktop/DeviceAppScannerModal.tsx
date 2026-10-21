import React, { useState } from 'react';
import {
  Smartphone,
  RefreshCw,
  CheckCircle2,
  Download,
  Plus,
  X,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { AppDefinition } from '../../types/desktop';
import { DEVICE_INSTALLED_APPS } from '../../utils/deviceAppScanner';

interface DeviceAppScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncApps: (apps: AppDefinition[]) => void;
  onOpenAppInWindow: (appId: string) => void;
}

export const DeviceAppScannerModal: React.FC<DeviceAppScannerModalProps> = ({
  isOpen,
  onClose,
  onSyncApps,
  onOpenAppInWindow,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedApps, setScannedApps] = useState<AppDefinition[]>(DEVICE_INSTALLED_APPS);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(['whatsapp', 'youtube', 'wpsoffice', 'spotify']);
  const [customPackage, setCustomPackage] = useState('');

  if (!isOpen) return null;

  const handleStartScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedApps(DEVICE_INSTALLED_APPS);
      onSyncApps(DEVICE_INSTALLED_APPS);
    }, 1200);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOpenSelected = () => {
    selectedIds.forEach((id) => {
      onOpenAppInWindow(id);
    });
    onClose();
  };

  const handleAddManualPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPackage.trim()) return;

    const pkg = customPackage.trim();
    const name = pkg.split('.').pop() || 'Aplikasi Baru';
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

    const newApp: AppDefinition = {
      id: `app-${Date.now()}`,
      name: formattedName,
      icon: 'box',
      category: 'productivity',
      packageName: pkg,
      isInstalledOnDevice: true,
      appType: 'native',
      version: '1.0',
      defaultWidth: 800,
      defaultHeight: 540,
      minWidth: 420,
      minHeight: 360,
      baseRamMb: 140,
      description: `Aplikasi terpasang di perangkat dengan nama paket ${pkg}`,
      canMultiInstance: true,
    };

    const updated = [newApp, ...scannedApps];
    setScannedApps(updated);
    onSyncApps(updated);
    setCustomPackage('');
  };

  const filtered = scannedApps.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.packageName && a.packageName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-panel max-w-3xl w-full rounded-3xl border border-white/20 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-slate-900/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Pemindai Aplikasi Xiaomi Pad 6
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Android 14 • HyperOS
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Membaca dan menyinkronkan seluruh aplikasi yang terinstall pada tablet Anda untuk dibuka dalam mode multi-window
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Scan Trigger */}
        <div className="p-4 bg-slate-950/60 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama aplikasi atau nama paket..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleStartScan}
              disabled={isScanning}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Memindai Pad 6...' : 'Pindai Ulang Tablet'}</span>
            </button>
          </div>
        </div>

        {/* Apps List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 px-1">
            <span>Ditemukan {filtered.length} aplikasi terpasang di perangkat:</span>
            <span>{selectedIds.length} dipilih untuk multi-window</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filtered.map((app) => {
              const isSelected = selectedIds.includes(app.id);
              return (
                <div
                  key={app.id}
                  onClick={() => handleToggleSelect(app.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 ring-1 ring-blue-500/50 shadow-md'
                      : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: app.color || '#3b82f6' }}
                    >
                      <Layers className="w-4 h-4" />
                    </div>

                    <div className="truncate">
                      <div className="font-bold text-xs text-white truncate">{app.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        {app.packageName || app.id}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenAppInWindow(app.id);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-blue-600 text-white text-[11px] font-semibold transition-colors"
                      title="Buka Langsung dalam Jendela Terpisah"
                    >
                      Buka Jendela
                    </button>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'border-white/30 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add custom package bar */}
          <form
            onSubmit={handleAddManualPackage}
            className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Tambahkan nama paket Android kustom (contoh: com.miHoYo.GenshinImpact)..."
              value={customPackage}
              onChange={(e) => setCustomPackage(e.target.value)}
              className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Daftarkan</span>
            </button>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950/80 border-t border-white/10 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            Aplikasi yang dipilih dapat dibuka secara bersamaan di layar multitasking
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Tutup
            </button>
            <button
              onClick={handleOpenSelected}
              disabled={selectedIds.length === 0}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg active:scale-95"
            >
              Buka {selectedIds.length} Jendela Terpisah Sekaligus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
