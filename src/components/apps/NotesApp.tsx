import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Bold,
  Italic,
  List,
  CheckSquare,
  Code,
  Download,
  Share2,
  Save,
  FileText,
  Sparkles,
} from 'lucide-react';

interface NoteItem {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  tags?: string[];
}

export const NotesApp: React.FC = () => {
  const [notes, setNotes] = useState<NoteItem[]>([
    {
      id: '1',
      title: 'Multitasking Xiaomi Pad 6',
      content: `# Pengaturan Workstation Xiaomi Pad 6
- Menghubungkan Keyboard magnetik Xiaomi
- Menghubungkan Mouse Bluetooth tanpa lag
- Mode DeX aktif dengan multi-window mengambang
- Optimalkan RAM Snapdragon 870 untuk membuka 5+ aplikasi sekaligus!`,
      updatedAt: 'Baru saja',
      tags: ['Kerja', 'Pad6'],
    },
    {
      id: '2',
      title: 'Daftar Ide Desain',
      content: `Fitur Utama DeX Mode:
1. Drag and drop file antar jendela
2. Taskbar cerdas dengan live preview
3. Optimasi RAM satu sentuhan
4. Dukungan Alt+Tab responsif`,
      updatedAt: 'Kemarin',
      tags: ['Ide'],
    },
  ]);

  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '');
  const [isDragOver, setIsDragOver] = useState(false);

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const handleUpdateContent = (content: string) => {
    if (!activeNote) return;
    setNotes((prev) =>
      prev.map((n) => (n.id === activeNote.id ? { ...n, content, updatedAt: 'Disimpan' } : n))
    );
  };

  const handleUpdateTitle = (title: string) => {
    if (!activeNote) return;
    setNotes((prev) =>
      prev.map((n) => (n.id === activeNote.id ? { ...n, title, updatedAt: 'Disimpan' } : n))
    );
  };

  const handleCreateNote = () => {
    const newNote: NoteItem = {
      id: Date.now().toString(),
      title: 'Catatan Baru ' + (notes.length + 1),
      content: '',
      updatedAt: 'Baru saja',
      tags: ['Baru'],
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    if (activeNoteId === id && updated.length > 0) {
      setActiveNoteId(updated[0].id);
    }
  };

  // Drag-and-drop drop zone handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (dataStr) {
        const fileData = JSON.parse(dataStr);
        let appendText = `\n\n> 📎 **[Berkas Ditautkan: ${fileData.name}]**\n`;
        if (fileData.content) {
          appendText += `\`\`\`\n${fileData.content}\n\`\`\`\n`;
        }
        if (fileData.imageUrl) {
          appendText += `![${fileData.name}](${fileData.imageUrl})\n`;
        }
        handleUpdateContent((activeNote?.content || '') + appendText);
        return;
      }

      // Plain text drop
      const plainText = e.dataTransfer.getData('text/plain');
      if (plainText) {
        handleUpdateContent((activeNote?.content || '') + '\n' + plainText);
      }
    } catch (err) {
      console.error('Failed to parse dropped data', err);
    }
  };

  const insertSnippet = (snippet: string) => {
    if (!activeNote) return;
    handleUpdateContent(activeNote.content + '\n' + snippet);
  };

  return (
    <div className="flex h-full w-full bg-slate-900/95 text-slate-100 overflow-hidden select-none">
      {/* Sidebar Note List */}
      <div className="w-56 bg-slate-950/70 border-r border-white/10 flex flex-col shrink-0">
        <div className="p-3 border-b border-white/10 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Catatan Pad 6</span>
          <button
            onClick={handleCreateNote}
            className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm"
            title="Catatan Baru"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {notes.map((note) => {
            const isActive = note.id === activeNoteId;
            return (
              <div
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`group p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/20 border-blue-500/40 shadow-sm'
                    : 'bg-white/5 border-transparent hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-semibold text-xs text-white truncate">{note.title}</span>
                  <button
                    onClick={(e) => handleDeleteNote(note.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 transition-opacity"
                    title="Hapus"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-2">
                  {note.content || 'Catatan kosong...'}
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{note.updatedAt}</span>
                  {note.tags?.[0] && (
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                      #{note.tags[0]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor Main */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-colors ${
          isDragOver ? 'bg-blue-950/40 ring-2 ring-inset ring-blue-500' : 'bg-slate-900/40'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        {activeNote ? (
          <>
            {/* Top Editor Bar */}
            <div className="h-12 border-b border-white/10 px-4 flex items-center justify-between gap-2 shrink-0 bg-slate-900/60">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => handleUpdateTitle(e.target.value)}
                className="bg-transparent font-bold text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/40 rounded px-1.5 py-1 w-72"
              />

              <div className="flex items-center gap-1 bg-slate-800/80 border border-white/10 rounded-lg p-1">
                <button
                  onClick={() => insertSnippet('**Teks Tebal**')}
                  className="p-1 hover:bg-white/15 rounded text-slate-300 hover:text-white"
                  title="Tebal"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => insertSnippet('*Teks Miring*')}
                  className="p-1 hover:bg-white/15 rounded text-slate-300 hover:text-white"
                  title="Miring"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => insertSnippet('- Butir baru')}
                  className="p-1 hover:bg-white/15 rounded text-slate-300 hover:text-white"
                  title="Daftar"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => insertSnippet('- [ ] Tugas baru')}
                  className="p-1 hover:bg-white/15 rounded text-slate-300 hover:text-white"
                  title="Daftar Centang"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => insertSnippet('```\nkode_di_sini()\n```')}
                  className="p-1 hover:bg-white/15 rounded text-slate-300 hover:text-white"
                  title="Blok Kode"
                >
                  <Code className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <Save className="w-3 h-3" />
                <span>Tersimpan</span>
              </div>
            </div>

            {/* Drag Drop Hint */}
            {isDragOver && (
              <div className="p-3 bg-blue-600/30 border-b border-blue-500 text-xs text-blue-200 text-center font-semibold animate-pulse">
                Lepaskan berkas di sini untuk menyematkan ke dalam catatan!
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 p-4 flex flex-col">
              <textarea
                value={activeNote.content}
                onChange={(e) => handleUpdateContent(e.target.value)}
                placeholder="Mulai menulis atau seret berkas/gambar dari Pengelola Berkas ke sini..."
                className="w-full flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none font-sans leading-relaxed"
              />

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  {activeNote.content.split(/\s+/).filter(Boolean).length} kata •{' '}
                  {activeNote.content.length} karakter
                </span>
                <span className="text-slate-400">
                  Mendukung drag-and-drop berkas dari Pengelola Berkas
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500">
            Pilih catatan atau buat catatan baru
          </div>
        )}
      </div>
    </div>
  );
};
