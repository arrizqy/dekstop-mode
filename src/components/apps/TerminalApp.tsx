import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Sparkles } from 'lucide-react';
import { RamStats } from '../../utils/ramManager';
import { WindowInstance } from '../../types/desktop';

interface TerminalAppProps {
  ramStats: RamStats;
  windows: WindowInstance[];
  onOptimizeRam: () => void;
}

export const TerminalApp: React.FC<TerminalAppProps> = ({
  ramStats,
  windows,
  onOptimizeRam,
}) => {
  const [history, setHistory] = useState<string[]>([
    'Xiaomi HyperOS Linux Kernel 5.15.78-qgki-xiaomi-pad6 (aarch64)',
    'Snapdragon 870 5G Octa-core (1x3.2 GHz & 3x2.42 GHz & 4x1.80 GHz)',
    'DeX Workstation Compositor active on /dev/dri/card0 [2880x1800 @ 144Hz]',
    'Ketik "help" atau "neofetch" untuk memulai.\n',
  ]);
  const [command, setCommand] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = command.trim();
    if (!cmd) return;

    const newHistory = [...history, `root@xiaomi-pad6:~# ${cmd}`];
    const parts = cmd.toLowerCase().split(' ');
    const base = parts[0];

    switch (base) {
      case 'help':
        newHistory.push(
          'Perintah tersedia:',
          '  neofetch    - Informasi sistem Xiaomi Pad 6',
          '  free -m     - Tampilkan alokasi memori RAM',
          '  ps / top    - Daftar proses & jendela multitasking aktif',
          '  boost-ram   - Bersihkan cache RAM dan optimalkan kecepatan',
          '  uname -a    - Informasi kernel Android',
          '  clear       - Bersihkan layar terminal',
          '  date        - Tanggal & waktu lokal saat ini'
        );
        break;

      case 'neofetch':
        newHistory.push(
          '   .---.           root@xiaomi-pad6',
          '  /     \\          ----------------',
          ' | () () |         OS: Xiaomi HyperOS Pad 1.0 (Android 14)',
          '  \\  _  /          Host: Xiaomi Pad 6 (pipa)',
          '   `---\'           Kernel: Linux 5.15.78-android14-arm64',
          '                   Uptime: 4 days, 11 hours',
          '                   Shell: bash 5.2.15',
          '                   Display: 11" WQHD+ (2880x1800) 144Hz HDR10',
          '                   WM: Xiaomi DeX Multi-Window Compositor',
          '                   CPU: Qualcomm Snapdragon 870 (8) @ 3.20GHz',
          '                   GPU: Adreno 650',
          `                   Memory: ${ramStats.usedMb}MB / ${ramStats.totalMb}MB (${ramStats.percentage}%)`,
          '                   Audio: Quad stereo speakers Dolby Atmos'
        );
        break;

      case 'free':
      case 'free -m':
        newHistory.push(
          '              total        used        free      shared  buff/cache   available',
          `Mem:          ${ramStats.totalMb}        ${ramStats.usedMb}        ${ramStats.freeMb}           0         312        ${ramStats.freeMb + 312}`,
          `Swap:         3072         248        2824`
        );
        break;

      case 'ps':
      case 'top':
        newHistory.push('PID   USER     %CPU  %MEM    TIME+  COMMAND');
        newHistory.push('  1   root      0.8   3.1   0:14.21  init [hyperos]');
        newHistory.push(' 42   system    1.5   8.4   1:23.08  surfaceflinger (144Hz)');
        windows.forEach((w, idx) => {
          const memPct = ((w.ramUsageMb / ramStats.totalMb) * 100).toFixed(1);
          newHistory.push(
            ` ${100 + idx * 12}   pad6      ${w.isFrozen ? '0.0' : '2.1'}   ${memPct}   0:0${idx + 2}.14  ${w.appId} [${w.title}]`
          );
        });
        break;

      case 'boost-ram':
        onOptimizeRam();
        newHistory.push(
          '[*] Membebaskan page cache dan buffer RAM...',
          '[*] Membekukan aplikasi latar belakang non-aktif...',
          `[+] Sukses: RAM dibebaskan! Status saat ini: ${ramStats.freeMb} MB tersedia.`
        );
        break;

      case 'clear':
        setHistory([]);
        setCommand('');
        return;

      case 'uname':
      case 'uname -a':
        newHistory.push(
          'Linux xiaomi-pad6 5.15.78-qgki-xiaomi-pipa #1 SMP PREEMPT aarch64 GNU/Linux'
        );
        break;

      case 'date':
        newHistory.push(new Date().toString());
        break;

      default:
        newHistory.push(`bash: ${cmd}: perintah tidak ditemukan. Ketik 'help' untuk daftar perintah.`);
    }

    setHistory(newHistory);
    setCommand('');
  };

  // Drag and drop onto terminal
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (dataStr) {
        const file = JSON.parse(dataStr);
        setHistory((prev) => [
          ...prev,
          `root@xiaomi-pad6:~# cat ${file.name}`,
          file.content || `[Berkas biner: ${file.name} - ${file.fileType}]`,
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="flex flex-col h-full w-full bg-slate-950 font-mono text-xs text-emerald-400 p-4 select-text overflow-hidden"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="flex-1 overflow-y-auto space-y-1 pr-1 font-mono leading-relaxed">
        {history.map((line, idx) => (
          <div key={idx} className="whitespace-pre-wrap break-all text-slate-200">
            {line.startsWith('root@xiaomi-pad6:~#') ? (
              <span className="text-amber-400 font-bold">{line}</span>
            ) : line.includes('error') || line.includes('tidak ditemukan') ? (
              <span className="text-rose-400">{line}</span>
            ) : line.includes('[+]') || line.includes('Sukses') ? (
              <span className="text-emerald-400">{line}</span>
            ) : (
              line
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleCommand} className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2 shrink-0">
        <span className="text-amber-400 font-bold shrink-0">root@xiaomi-pad6:~#</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Ketik perintah (contoh: neofetch, boost-ram, free -m)..."
          className="flex-1 bg-transparent text-emerald-400 focus:outline-none font-mono"
          autoFocus
        />
      </form>
    </div>
  );
};
