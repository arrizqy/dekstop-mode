import React from 'react';
import {
  Cpu,
  Zap,
  RefreshCw,
  Sparkles,
  Layers,
  Power,
  Snowflake,
  Play,
  XCircle,
  HardDrive,
  Info,
} from 'lucide-react';
import { WindowInstance, SystemSettings } from '../../types/desktop';
import { RamStats } from '../../utils/ramManager';

interface TaskManagerAppProps {
  windows: WindowInstance[];
  ramStats: RamStats;
  settings: SystemSettings;
  onOptimizeRam: () => void;
  onToggleFreezeWindow: (windowId: string) => void;
  onCloseWindow: (windowId: string) => void;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
}

export const TaskManagerApp: React.FC<TaskManagerAppProps> = ({
  windows,
  ramStats,
  settings,
  onOptimizeRam,
  onToggleFreezeWindow,
  onCloseWindow,
  onUpdateSettings,
}) => {
  return (
    <div className="flex flex-col h-full w-full bg-slate-900/95 text-slate-100 overflow-hidden select-none">
      {/* Top RAM Overview Card */}
      <div className="p-4 bg-slate-950/70 border-b border-white/10 shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-blue-400" />
                Manajemen Memori Xiaomi Pad 6
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Snapdragon 870 5G
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              RAM Fisik 8GB LPDDR5 + Ekstensi Memori Virtual 3GB (Total 11.2 GB)
            </p>
          </div>

          <button
            onClick={onOptimizeRam}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Optimalkan RAM Sekarang</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-4 bg-slate-800/80 rounded-xl p-3 border border-white/5">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-300 font-medium">
              Penggunaan RAM: <strong className="text-white">{ramStats.usedMb} MB</strong> / {ramStats.totalMb} MB
            </span>
            <span
              className={`font-bold ${
                ramStats.percentage > 80 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {ramStats.percentage}% Digunakan ({ramStats.freeMb} MB Bebas)
            </span>
          </div>

          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-white/10 flex">
            {/* System bar */}
            <div
              className="bg-slate-500 h-full rounded-l-full transition-all duration-500"
              style={{ width: `${(ramStats.systemReservedMb / ramStats.totalMb) * 100}%` }}
              title={`Sistem HyperOS: ${ramStats.systemReservedMb} MB`}
            />
            {/* Apps bar */}
            <div
              className={`h-full transition-all duration-500 ${
                ramStats.percentage > 80 ? 'bg-amber-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
              }`}
              style={{ width: `${(ramStats.appsUsedMb / ramStats.totalMb) * 100}%` }}
              title={`Aplikasi Aktif: ${ramStats.appsUsedMb} MB`}
            />
          </div>

          <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-500 inline-block" />
              Sistem ({ramStats.systemReservedMb} MB)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />
              Aplikasi Multitasking ({ramStats.appsUsedMb} MB)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-950 border border-emerald-500/50 inline-block" />
              RAM Tersedia ({ramStats.freeMb} MB)
            </span>
          </div>
        </div>
      </div>

      {/* Performance Profile Toggles */}
      <div className="px-4 py-2.5 bg-slate-900/60 border-b border-white/10 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">Profil Kinerja Snapdragon:</span>
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg border border-white/10">
          {(['balanced', 'performance', 'battery-saver'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onUpdateSettings({ performanceMode: mode })}
              className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all ${
                settings.performanceMode === mode
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
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

      {/* Running Applications List */}
      <div className="flex-1 flex flex-col min-h-0 p-4 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Aplikasi Multitasking Terbuka ({windows.length})
          </span>
          <span className="text-[11px] text-slate-400">
            Bekukan aplikasi latar untuk menghemat hingga 75% RAM
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {windows.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-slate-500 text-center">
              <Layers className="w-10 h-10 mb-2 opacity-40 stroke-[1.5]" />
              <p className="text-xs font-medium">Tidak ada aplikasi yang sedang berjalan</p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Buka aplikasi dari Taskbar atau Menu Mulai
              </p>
            </div>
          ) : (
            windows.map((win) => {
              const effectiveRam = win.isFrozen ? Math.round(win.ramUsageMb * 0.25) : win.ramUsageMb;
              return (
                <div
                  key={win.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    win.isFrozen
                      ? 'bg-slate-900/40 border-cyan-500/30'
                      : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                        win.isFrozen
                          ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/40'
                          : 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {win.isFrozen ? <Snowflake className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </div>

                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-white truncate">{win.title}</span>
                        {win.isFrozen && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium">
                            Dibekukan (Hemat RAM)
                          </span>
                        )}
                        {win.isMinimized && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-700 text-slate-300">
                            Di latar belakang
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Alokasi RAM:{' '}
                        <strong className="text-slate-200">{effectiveRam} MB</strong>{' '}
                        {win.isFrozen && (
                          <span className="text-emerald-400 line-through ml-1">
                            {win.ramUsageMb} MB
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onToggleFreezeWindow(win.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        win.isFrozen
                          ? 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                      title={win.isFrozen ? 'Lanjutkan aplikasi' : 'Bekukan di memori'}
                    >
                      {win.isFrozen ? (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Lanjutkan</span>
                        </>
                      ) : (
                        <>
                          <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Bekukan</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onCloseWindow(win.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Hentikan Proses"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
