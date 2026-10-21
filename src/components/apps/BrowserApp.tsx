import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Search,
  Plus,
  X,
  Globe,
  Bookmark,
  ExternalLink,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

interface TabItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export const BrowserApp: React.FC = () => {
  const [tabs, setTabs] = useState<TabItem[]>([
    {
      id: 'tab-1',
      title: 'Xiaomi Pad 6 - Spesifikasi & DeX',
      url: 'https://mi.com/id/product/xiaomi-pad-6',
    },
    {
      id: 'tab-2',
      title: 'Panduan Multitasking HyperOS',
      url: 'https://developer.android.com/guide/topics/ui/multi-window',
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [addressInput, setAddressInput] = useState('https://mi.com/id/product/xiaomi-pad-6');
  const [searchQuery, setSearchQuery] = useState('');

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const handleSelectTab = (tab: TabItem) => {
    setActiveTabId(tab.id);
    setAddressInput(tab.url);
  };

  const handleNewTab = () => {
    const newId = `tab-${Date.now()}`;
    const newTab: TabItem = {
      id: newId,
      title: 'Tab Baru',
      url: 'https://google.com/search',
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
    setAddressInput(newTab.url);
  };

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const filtered = tabs.filter((t) => t.id !== id);
    setTabs(filtered);
    if (activeTabId === id) {
      setActiveTabId(filtered[0].id);
      setAddressInput(filtered[0].url);
    }
  };

  const handleSubmitUrl = (e: React.FormEvent) => {
    e.preventDefault();
    let url = addressInput.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
    }
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, url, title: url.replace(/^https?:\/\//, '') } : t))
    );
  };

  const bookmarks = [
    { name: 'Xiaomi ID', url: 'https://mi.com/id' },
    { name: 'Wikipedia', url: 'https://id.wikipedia.org' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'Android Docs', url: 'https://developer.android.com' },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 overflow-hidden select-none">
      {/* Tab bar */}
      <div className="h-10 bg-slate-950/80 px-2 flex items-center gap-1.5 border-b border-white/10 shrink-0 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => handleSelectTab(tab)}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-lg max-w-[200px] text-xs transition-all cursor-pointer border-t border-x ${
                isActive
                  ? 'bg-slate-800 text-white border-white/15 font-medium'
                  : 'bg-transparent text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">{tab.title}</span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => handleCloseTab(tab.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/20 rounded text-slate-400 hover:text-white transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        <button
          onClick={handleNewTab}
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          title="Buka Tab Baru"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation & Address Bar */}
      <div className="h-12 bg-slate-900/90 border-b border-white/10 px-3 flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1 text-slate-400">
          <button className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors disabled:opacity-40">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors disabled:opacity-40">
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Address Input */}
        <form onSubmit={handleSubmitUrl} className="flex-1 max-w-2xl">
          <div className="relative flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 absolute left-3" />
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 rounded-full pl-9 pr-8 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3" />
          </div>
        </form>

        <div className="flex items-center gap-2">
          {bookmarks.map((bm) => (
            <button
              key={bm.name}
              onClick={() => {
                setAddressInput(bm.url);
                setTabs((prev) =>
                  prev.map((t) => (t.id === activeTabId ? { ...t, url: bm.url, title: bm.name } : t))
                );
              }}
              className="px-2 py-1 rounded text-[11px] font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors hidden sm:inline-block"
            >
              {bm.name}
            </button>
          ))}
        </div>
      </div>

      {/* Rendered Web Content */}
      <div className="flex-1 bg-slate-950 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header banner */}
          <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/30 border border-blue-500/30 relative overflow-hidden">
            <div className="relative z-10">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                Xiaomi Pad 6 • HyperOS Workstation DeX Mode
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-2">
                Produktivitas Tablet Level Desktop
              </h1>
              <p className="text-xs text-slate-300 mt-2 max-w-xl leading-relaxed">
                Menghadirkan pengalaman multitasking penuh seperti Samsung DeX pada Xiaomi Pad 6. Buka
                jendela tak terbatas, geser dan sesuaikan ukuran, serta manfaatkan performa optimal RAM
                8GB Snapdragon 870.
              </p>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-white/10">
              <div className="text-sky-400 font-bold text-sm mb-1">Layar 11" 2.8K 144Hz</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tampilan jernih 309 ppi dengan rasio 16:10, sempurna untuk multitasking 3 hingga 4
                jendela berdampingan tanpa terpotong.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-white/10">
              <div className="text-emerald-400 font-bold text-sm mb-1">Dukungan Mouse & Keyboard</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gunakan kursor mouse presisi, klik kanan konteks menu, pintasan Alt+Tab, dan navigasi
                keyboard eksternal penuh.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-white/10">
              <div className="text-purple-400 font-bold text-sm mb-1">Drag & Drop Lintas Jendela</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tarik berkas dari Pengelola Berkas langsung ke Catatan atau Terminal layaknya komputer desktop
                profesional.
              </p>
            </div>
          </div>

          {/* Multitasking Shortcuts Table */}
          <div className="rounded-xl bg-slate-900 border border-white/10 p-5">
            <h2 className="text-sm font-bold text-white mb-3">Pintasan Keyboard Desktop (DeX Mode)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60 border border-white/5">
                <span className="text-slate-400">Pengalih Aplikasi</span>
                <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[11px]">Alt + Tab</kbd>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60 border border-white/5">
                <span className="text-slate-400">Buka Menu Mulai</span>
                <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[11px]">Windows / Meta</kbd>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60 border border-white/5">
                <span className="text-slate-400">Tampilkan Desktop</span>
                <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[11px]">Win + D</kbd>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60 border border-white/5">
                <span className="text-slate-400">Buka Manajer Tugas</span>
                <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[11px]">Ctrl + Shift + Esc</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
