import React, { useState } from 'react';
import {
  Monitor,
  Image as ImageIcon,
  Cpu,
  MousePointer,
  Volume2,
  Info,
  ShieldCheck,
  Check,
  Zap,
} from 'lucide-react';
import { SystemSettings } from '../../types/desktop';
import { INITIAL_WALLPAPERS } from '../../utils/initialData';

interface SettingsAppProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [activeSection, setActiveSection] = useState<'wallpaper' | 'display' | 'ram' | 'mouse' | 'about'>('wallpaper');

  const navItems = [
    { id: 'wallpaper', name: 'Wallpaper Desktop', icon: ImageIcon },
    { id: 'display', name: 'Layar & Tampilan (144Hz)', icon: Monitor },
    { id: 'ram', name: 'RAM & Kinerja Pad 6', icon: Cpu },
    { id: 'mouse', name: 'Mouse & Keyboard Eksternal', icon: MousePointer },
    { id: 'about', name: 'Tentang Xiaomi Pad 6', icon: Info },
  ] as const;

  return (
    <div className="flex h-full w-full bg-slate-900 text-slate-100 overflow-hidden select-none">
      {/* Sidebar navigation */}
      <div className="w-56 bg-slate-950/70 border-r border-white/10 p-3 flex flex-col gap-1 shrink-0">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Pengaturan DeX
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                isActive
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30 shadow-sm'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main settings content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeSection === 'wallpaper' && (
          <div className="max-w-2xl space-y-4">
            <div>
              <h2 className="text-base font-bold text-white">Latar Belakang Desktop</h2>
              <p className="text-xs text-slate-400 mt-1">
                Pilih tema visual untuk tampilan desktop Xiaomi Pad 6
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {INITIAL_WALLPAPERS.map((wp) => {
                const isSelected = settings.wallpaper === wp.url;
                return (
                  <div
                    key={wp.id}
                    onClick={() => onUpdateSettings({ wallpaper: wp.url })}
                    className={`relative rounded-xl overflow-hidden aspect-16/10 border cursor-pointer transition-all ${
                      isSelected
                        ? 'ring-2 ring-blue-500 border-transparent shadow-lg'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-3">
                      <span className="text-xs font-semibold text-white">{wp.name}</span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeSection === 'display' && (
          <div className="max-w-2xl space-y-5">
            <div>
              <h2 className="text-base font-bold text-white">Layar & Resolusi WQHD+</h2>
              <p className="text-xs text-slate-400 mt-1">
                Kustomisasi refresh rate dan skala tampilan workstation
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Refresh Rate 144Hz Dinamis</div>
                  <div className="text-slate-400 text-[11px]">
                    Animasi jendela dan scrolling mouse ekstra mulus
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  144 Hz Aktif
                </span>
              </div>

              <div className="border-t border-white/5 pt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-white">Tingkat Kecerahan Layar</span>
                  <span className="text-slate-300">{settings.brightness}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={settings.brightness}
                  onChange={(e) => onUpdateSettings({ brightness: Number(e.target.value) })}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="border-t border-white/5 pt-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Tampilkan Indikator FPS & RAM di Taskbar</div>
                  <div className="text-slate-400 text-[11px]">
                    Status beban real-time di bilah tugas bawah
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showFps}
                  onChange={(e) => onUpdateSettings({ showFps: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'ram' && (
          <div className="max-w-2xl space-y-5">
            <div>
              <h2 className="text-base font-bold text-white">Optimasi Memori & Kinerja RAM</h2>
              <p className="text-xs text-slate-400 mt-1">
                Konfigurasi Snapdragon 870 dan RAM LPDDR5 Xiaomi Pad 6
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">
                    Ekstensi Memori Virtual HyperOS (+3 GB)
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Mengubah penyimpanan flash UFS 3.1 menjadi RAM virtual tambahan
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                  +3 GB Aktif (Total 11 GB)
                </span>
              </div>

              <div className="border-t border-white/5 pt-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">
                    Bekukan Aplikasi Latar Secara Otomatis
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Aplikasi yang diminimalkan atau tidak aktif dihemat hingga 75% RAM
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoFreezeInactive}
                  onChange={(e) => onUpdateSettings({ autoFreezeInactive: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="border-t border-white/5 pt-3">
                <div className="font-semibold text-white mb-2">Mode Performa Snapdragon 870</div>
                <div className="grid grid-cols-3 gap-2">
                  {(['balanced', 'performance', 'battery-saver'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => onUpdateSettings({ performanceMode: mode })}
                      className={`p-2.5 rounded-lg border text-center transition-all ${
                        settings.performanceMode === mode
                          ? 'bg-blue-600/30 border-blue-500 text-white font-bold'
                          : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {mode === 'balanced'
                        ? 'Seimbang'
                        : mode === 'performance'
                        ? 'Performa Ekstrem'
                        : 'Hemat Daya'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'mouse' && (
          <div className="max-w-2xl space-y-5">
            <div>
              <h2 className="text-base font-bold text-white">Mouse & Keyboard Eksternal</h2>
              <p className="text-xs text-slate-400 mt-1">
                Sensitivitas kursor mouse bluetooth dan pintasan papan ketik
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-4 text-xs">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-white">Kecepatan Kursor Pointer</span>
                  <span className="text-slate-300 font-mono">
                    {Math.round(settings.pointerSpeed * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.pointerSpeed}
                  onChange={(e) => onUpdateSettings({ pointerSpeed: Number(e.target.value) })}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="border-t border-white/5 pt-3">
                <div className="font-semibold text-white mb-2">Daftar Pintasan Keyboard Cepat:</div>
                <ul className="space-y-1.5 text-slate-300">
                  <li className="flex justify-between">
                    <span>Ganti Jendela Aktif</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">Alt + Tab</kbd>
                  </li>
                  <li className="flex justify-between">
                    <span>Menu Mulai / App Drawer</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">Win / Meta</kbd>
                  </li>
                  <li className="flex justify-between">
                    <span>Minimalkan Semua (Tampilkan Desktop)</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">Win + D</kbd>
                  </li>
                  <li className="flex justify-between">
                    <span>Tutup Jendela Aktif</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">Alt + F4 / Ctrl + W</kbd>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'about' && (
          <div className="max-w-2xl space-y-4">
            <div>
              <h2 className="text-base font-bold text-white">Spesifikasi Xiaomi Pad 6</h2>
              <p className="text-xs text-slate-400 mt-1">
                Informasi perangkat keras dan versi workstation
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Nama Perangkat</span>
                <span className="font-bold text-white">Xiaomi Pad 6 (Workstation Edition)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Prosesor</span>
                <span className="font-bold text-white">Qualcomm Snapdragon® 870 (7nm, 3.2GHz)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Memori RAM</span>
                <span className="font-bold text-white">8GB LPDDR5 + 3GB Virtual RAM</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Penyimpanan</span>
                <span className="font-bold text-white">128GB UFS 3.1</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Layar</span>
                <span className="font-bold text-white">11.0" WQHD+ (2880 x 1800) 144Hz, 16:10</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Baterai</span>
                <span className="font-bold text-white">8840 mAh (Tipikal) • Pengisian Cepat 33W</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Sistem Antarmuka</span>
                <span className="font-bold text-blue-400">Xiaomi HyperOS 1.0 DeX Desktop Compositor</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
