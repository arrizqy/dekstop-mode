import React, { useState } from 'react';
import {
  Folder,
  FileText,
  Image as ImageIcon,
  Code,
  File,
  Plus,
  Trash2,
  Search,
  Grid,
  List,
  Upload,
  HardDrive,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { FileItem } from '../../types/desktop';

interface FileManagerAppProps {
  files: FileItem[];
  onOpenFile: (file: FileItem) => void;
  onCreateFile: (folderId: string, name: string, type: FileItem['type']) => void;
  onDeleteFile: (fileId: string) => void;
}

export const FileManagerApp: React.FC<FileManagerAppProps> = ({
  files,
  onOpenFile,
  onCreateFile,
  onDeleteFile,
}) => {
  const [currentFolder, setCurrentFolder] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [newFileName, setNewFileName] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const folders = [
    { id: 'all', name: 'Semua Berkas', icon: HardDrive },
    { id: 'doc', name: 'Dokumen', icon: FileText },
    { id: 'pic', name: 'Foto & Gambar', icon: ImageIcon },
    { id: 'code', name: 'Kode & Skrip', icon: Code },
    { id: 'download', name: 'Unduhan', icon: Folder },
  ];

  const filteredFiles = files.filter((f) => {
    const matchesFolder = currentFolder === 'all' || f.parentId === currentFolder;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleDragStart = (e: React.DragEvent, file: FileItem) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        type: 'file-transfer',
        fileId: file.id,
        name: file.name,
        fileType: file.type,
        content: file.content || '',
        imageUrl: file.imageUrl || '',
      })
    );
    e.dataTransfer.effectAllowed = 'copyMove';
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    let type: FileItem['type'] = 'text';
    if (newFileName.endsWith('.jpg') || newFileName.endsWith('.png')) type = 'image';
    if (newFileName.endsWith('.sh') || newFileName.endsWith('.js') || newFileName.endsWith('.py')) type = 'code';

    onCreateFile(currentFolder === 'all' ? 'doc' : currentFolder, newFileName.trim(), type);
    setNewFileName('');
    setShowNewModal(false);
  };

  const getFileIcon = (type: FileItem['type']) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-8 h-8 text-emerald-400" />;
      case 'code':
        return <Code className="w-8 h-8 text-amber-400" />;
      case 'text':
      default:
        return <FileText className="w-8 h-8 text-sky-400" />;
    }
  };

  return (
    <div className="flex h-full w-full bg-slate-900/95 text-slate-100 overflow-hidden select-none">
      {/* Sidebar Folders */}
      <div className="w-56 bg-slate-950/70 border-r border-white/10 p-3 flex flex-col gap-1 shrink-0">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Penyimpanan Pad 6
        </div>
        {folders.map((folder) => {
          const Icon = folder.icon;
          const isActive = currentFolder === folder.id;
          return (
            <button
              key={folder.id}
              onClick={() => setCurrentFolder(folder.id)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                isActive
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30 shadow-sm'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{folder.name}</span>
            </button>
          );
        })}

        <div className="mt-auto p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
          <div className="flex justify-between items-center mb-1 text-slate-400">
            <span>Memori UFS 3.1</span>
            <span className="font-semibold text-slate-200">128 GB</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full w-[42%]" />
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Tersisa 74.2 GB bebas</div>
        </div>
      </div>

      {/* Main Files Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Toolbar */}
        <div className="h-14 border-b border-white/10 px-4 flex items-center justify-between gap-3 bg-slate-900/40 shrink-0">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari berkas di Pad 6..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/80 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Berkas Baru</span>
            </button>

            <div className="flex items-center bg-slate-800 border border-white/10 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Tampilan Kisi"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Tampilan Daftar"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Drag Hint Banner */}
        <div className="px-4 py-2 bg-blue-500/10 border-b border-blue-500/20 text-xs text-blue-300 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            💡 <strong>Dukungan Drag & Drop:</strong> Tarik berkas ini langsung ke jendela Catatan, Galeri, atau Terminal!
          </span>
          <span className="text-slate-400 text-[11px]">{filteredFiles.length} berkas</span>
        </div>

        {/* Files Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {filteredFiles.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center">
              <Folder className="w-12 h-12 stroke-[1.2] mb-2 opacity-50" />
              <p className="text-sm font-medium">Tidak ada berkas di folder ini</p>
              <p className="text-xs text-slate-500 mt-1">Klik "+ Berkas Baru" untuk membuat dokumen</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredFiles.map((file) => {
                const isSelected = selectedFile?.id === file.id;
                return (
                  <div
                    key={file.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, file)}
                    onClick={() => setSelectedFile(file)}
                    onDoubleClick={() => onOpenFile(file)}
                    className={`group relative p-3 rounded-xl border transition-all flex flex-col items-center text-center cursor-grab active:cursor-grabbing ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 shadow-md ring-1 ring-blue-500'
                        : 'bg-slate-800/40 border-white/5 hover:bg-slate-800/80 hover:border-white/20'
                    }`}
                  >
                    {file.imageUrl ? (
                      <div className="w-16 h-16 rounded-lg overflow-hidden mb-2 bg-slate-900 border border-white/10 shrink-0">
                        <img
                          src={file.imageUrl}
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-slate-900/60 mb-2 border border-white/5">
                        {getFileIcon(file.type)}
                      </div>
                    )}

                    <div className="w-full font-medium text-xs text-slate-200 truncate group-hover:text-white">
                      {file.name}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{file.size}</div>

                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenFile(file);
                        }}
                        className="p-1 rounded bg-slate-700/80 hover:bg-blue-600 text-slate-300 hover:text-white"
                        title="Buka Berkas"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteFile(file.id);
                        }}
                        className="p-1 rounded bg-slate-700/80 hover:bg-rose-600 text-slate-300 hover:text-white"
                        title="Hapus"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-white/5 bg-slate-800/30 rounded-xl border border-white/10 overflow-hidden">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, file)}
                  onClick={() => setSelectedFile(file)}
                  onDoubleClick={() => onOpenFile(file)}
                  className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors cursor-grab active:cursor-grabbing text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0">{getFileIcon(file.type)}</div>
                    <div className="truncate">
                      <div className="font-medium text-slate-200 truncate">{file.name}</div>
                      <div className="text-[11px] text-slate-400">{file.updatedAt}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400 shrink-0">
                    <span>{file.size}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteFile(file.id);
                      }}
                      className="p-1.5 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New File Modal */}
      {showNewModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleCreate}
            className="w-80 bg-slate-800 border border-white/20 rounded-2xl p-4 shadow-2xl flex flex-col gap-3"
          >
            <h3 className="text-sm font-bold text-white">Buat Berkas Baru</h3>
            <p className="text-xs text-slate-400">
              Ketik nama berkas (contoh: <code>catatan.txt</code>, <code>skrip.sh</code>)
            </p>
            <input
              type="text"
              autoFocus
              placeholder="nama_berkas.txt"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="bg-slate-900 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
