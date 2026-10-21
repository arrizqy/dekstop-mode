import React, { useState } from 'react';
import {
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  RefreshCw,
  Cpu,
  Layers,
  Send,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Search,
  MessageCircle,
  Video,
  CheckCheck,
  Smile,
  Paperclip,
  Share2,
  Download,
  Info,
} from 'lucide-react';
import { AppDefinition } from '../../types/desktop';

interface GenericInstalledAppProps {
  app: AppDefinition;
  onOpenAppInWindow?: (appId: string) => void;
}

export const GenericInstalledApp: React.FC<GenericInstalledAppProps> = ({ app }) => {
  const [viewMode, setViewMode] = useState<'tablet' | 'phone' | 'desktop'>('tablet');

  // WhatsApp simulation state
  const [waMessages, setWaMessages] = useState([
    { from: 'them', text: 'Halo! Mode desktop di Xiaomi Pad 6 sudah aktif?', time: '20:10' },
    { from: 'me', text: 'Sudah! Semua aplikasi terinstall sekarang bisa dibuka dalam multi-window berdampingan.', time: '20:11' },
    { from: 'them', text: 'Keren banget, drag and drop berkas juga lancar?', time: '20:12' },
    { from: 'me', text: 'Sangat lancar! Bisa seret berkas langsung ke catatan dan multitasking tanpa lag.', time: '20:12' },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  // YouTube simulation state
  const [isYtPlaying, setIsYtPlaying] = useState(true);

  // WPS Office state
  const [wpsTab, setWpsTab] = useState<'doc' | 'sheet' | 'ppt'>('doc');
  const [docText, setDocText] = useState(
    'LAPORAN MULTITASKING XIAOMI PAD 6\n\n1. Spesifikasi: Qualcomm Snapdragon 870 5G\n2. RAM: 8GB LPDDR5 + 3GB Virtual RAM HyperOS\n3. Layar: 11 Inci 2.8K 144Hz WQHD+\n4. Status: Semua aplikasi perangkat terintegrasi dalam mode multi-jendela secara bersamaan.'
  );

  const handleSendWa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setWaMessages((prev) => [
      ...prev,
      {
        from: 'me',
        text: inputMsg.trim(),
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputMsg('');
  };

  const handleLaunchNative = () => {
    if (app.nativeDeepLink) {
      window.location.href = app.nativeDeepLink;
    } else if (app.webUrl) {
      window.open(app.webUrl, '_blank');
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Top App Control Bar */}
      <div className="h-10 bg-slate-900 border-b border-white/10 px-3 flex items-center justify-between gap-2 shrink-0 text-xs">
        {/* Left: Package info badge */}
        <div className="flex items-center gap-2 truncate">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: app.color || '#3b82f6' }}
          />
          <span className="font-bold text-white truncate">{app.name}</span>
          {app.packageName && (
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline-block truncate">
              ({app.packageName})
            </span>
          )}
          {app.version && (
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-white/10 text-slate-300 font-mono hidden md:inline-block">
              v{app.version}
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* View mode toggle */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-white/10">
            <button
              onClick={() => setViewMode('phone')}
              className={`p-1 rounded transition-colors ${
                viewMode === 'phone' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Mode Tampilan Ponsel (Portrait)"
            >
              <Smartphone className="w-3 h-3" />
            </button>
            <button
              onClick={() => setViewMode('tablet')}
              className={`p-1 rounded transition-colors ${
                viewMode === 'tablet' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Mode Tampilan Tablet (Landscape)"
            >
              <Tablet className="w-3 h-3" />
            </button>
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-1 rounded transition-colors ${
                viewMode === 'desktop' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Mode Web Workstation"
            >
              <Monitor className="w-3 h-3" />
            </button>
          </div>

          {/* Open Native Device App button */}
          {(app.nativeDeepLink || app.webUrl) && (
            <button
              onClick={handleLaunchNative}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition-all shadow-xs"
              title="Buka Aplikasi Asli di Tablet Android"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="hidden sm:inline">Buka Asli</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Body with selected aspect ratio */}
      <div className="flex-1 bg-slate-900/40 overflow-hidden flex items-center justify-center p-0">
        <div
          className={`h-full w-full transition-all flex flex-col overflow-hidden ${
            viewMode === 'phone'
              ? 'max-w-md mx-auto border-x border-white/10 shadow-2xl bg-slate-950'
              : 'bg-slate-950'
          }`}
        >
          {/* CUSTOM APP VIEW: WHATSAPP */}
          {app.id === 'whatsapp' ? (
            <div className="flex flex-col h-full bg-[#0b141a] text-slate-100">
              {/* WhatsApp header */}
              <div className="h-12 bg-[#202c33] px-3 flex items-center justify-between border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                    RP
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Rizqi Pad 6 (Workstation)</div>
                    <div className="text-[10px] text-emerald-400">online</div>
                  </div>
                </div>
                <button
                  onClick={handleLaunchNative}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Buka di Tablet</span>
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
                {waMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-[80%] rounded-xl px-3 py-1.5 text-xs ${
                      msg.from === 'me'
                        ? 'ml-auto bg-[#005c4b] text-white rounded-tr-none'
                        : 'mr-auto bg-[#202c33] text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <span>{msg.text}</span>
                    <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 mt-0.5">
                      <span>{msg.time}</span>
                      {msg.from === 'me' && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat input */}
              <form
                onSubmit={handleSendWa}
                className="h-12 bg-[#202c33] px-3 flex items-center gap-2 shrink-0 border-t border-white/10"
              >
                <input
                  type="text"
                  placeholder="Ketik pesan WhatsApp..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="flex-1 bg-[#2a3942] border border-transparent rounded-full px-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-transform active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          ) : app.id === 'youtube' ? (
            /* CUSTOM APP VIEW: YOUTUBE */
            <div className="flex flex-col h-full bg-black text-white">
              <div className="aspect-16/9 bg-slate-900 relative flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80"
                  alt="Video thumbnail"
                  className="w-full h-full object-cover opacity-75"
                />
                <button
                  onClick={() => setIsYtPlaying(!isYtPlaying)}
                  className="absolute w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl active:scale-95 transition-all"
                >
                  {isYtPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-white/90">
                  <span className="font-semibold">Review Xiaomi Pad 6: Tablet Multitasking Terbaik</span>
                  <span className="font-mono text-[10px] bg-black/60 px-2 py-0.5 rounded">144Hz WQHD+</span>
                </div>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-xs text-white">
                      Tutorial Mengubah Xiaomi Pad 6 Menjadi Samsung DeX PC Desktop Mode
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      1.2M x ditonton • 2 hari yang lalu • Xiaomi Official
                    </p>
                  </div>
                  <button
                    onClick={handleLaunchNative}
                    className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold shrink-0"
                  >
                    Buka di YouTube
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                  {[
                    { title: 'Keyboard & Mouse Bluetooth Setup', duration: '10:24', views: '450K' },
                    { title: 'Snapdragon 870 Gaming & RAM Test', duration: '14:10', views: '820K' },
                    { title: 'HyperOS Workstation Tips & Tricks', duration: '08:45', views: '310K' },
                    { title: 'Multi-Window 4 Layar Bersamaan', duration: '12:30', views: '610K' },
                  ].map((vid, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-slate-900 border border-white/5 flex flex-col gap-1">
                      <div className="font-bold text-xs text-slate-200 line-clamp-1">{vid.title}</div>
                      <div className="text-[10px] text-slate-400">{vid.views} x • {vid.duration}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : app.id === 'wpsoffice' ? (
            /* CUSTOM APP VIEW: WPS OFFICE */
            <div className="flex flex-col h-full bg-slate-900 text-slate-100">
              <div className="h-10 bg-slate-950 px-3 flex items-center gap-2 border-b border-white/10 shrink-0">
                <button
                  onClick={() => setWpsTab('doc')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold ${
                    wpsTab === 'doc' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Word Dokumen (.docx)
                </button>
                <button
                  onClick={() => setWpsTab('sheet')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold ${
                    wpsTab === 'sheet' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Excel Spreadsheet (.xlsx)
                </button>
                <button
                  onClick={() => setWpsTab('ppt')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold ${
                    wpsTab === 'ppt' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  PowerPoint Slide (.pptx)
                </button>
              </div>

              <div className="flex-1 p-4 bg-slate-950 overflow-y-auto">
                <textarea
                  value={docText}
                  onChange={(e) => setDocText(e.target.value)}
                  className="w-full h-full bg-slate-900/60 p-4 rounded-xl border border-white/10 font-mono text-xs text-white focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          ) : (
            /* STANDARD ADAPTIVE WORKSTATION CONTAINER FOR ANY INSTALLED APP */
            <div className="flex-1 flex flex-col p-5 bg-slate-950 overflow-y-auto">
              <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-900 to-slate-800 border border-white/10 flex flex-col items-center text-center max-w-lg mx-auto shadow-xl">
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4 shadow-lg border border-white/20"
                  style={{ backgroundColor: app.color || '#3b82f6' }}
                >
                  <Layers className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-lg font-bold text-white">{app.name}</h2>
                <p className="text-xs text-slate-300 mt-1 max-w-md leading-relaxed">
                  {app.description}
                </p>

                {/* Package details */}
                <div className="mt-4 w-full bg-slate-950/80 rounded-xl p-3 border border-white/10 text-xs space-y-1.5 text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nama Paket Android:</span>
                    <span className="font-mono text-blue-400">{app.packageName || `com.xiaomi.${app.id}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status Perangkat:</span>
                    <span className="text-emerald-400 font-semibold">Terinstall di Xiaomi Pad 6</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Akselerasi Grafis:</span>
                    <span className="text-white font-mono">Qualcomm Adreno 650 (Vulkan 1.1)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Alokasi RAM Workstation:</span>
                    <span className="text-white font-mono">{app.baseRamMb} MB</span>
                  </div>
                </div>

                {/* Launch options */}
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  {(app.nativeDeepLink || app.webUrl) && (
                    <button
                      onClick={handleLaunchNative}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Buka Aplikasi Asli di Tablet Pad 6</span>
                    </button>
                  )}

                  <button
                    onClick={() => setViewMode((m) => (m === 'phone' ? 'tablet' : 'phone'))}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold transition-all"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Ubah Orientasi Jendela</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
