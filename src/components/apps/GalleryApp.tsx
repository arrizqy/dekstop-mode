import React, { useState } from 'react';
import { Image, Maximize2, ZoomIn, ZoomOut, RotateCw, Download, Heart } from 'lucide-react';

interface GalleryAppProps {
  onDragStartPhoto?: (photo: any) => void;
}

export const GalleryApp: React.FC<GalleryAppProps> = () => {
  const photos = [
    {
      id: 'p1',
      title: 'Xiaomi HyperOS Wallpaper Cosmic',
      category: 'Wallpaper',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      resolution: '2880 x 1800',
    },
    {
      id: 'p2',
      title: 'Galaxy Nebula Night',
      category: 'Kamera',
      url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
      resolution: '3840 x 2160',
    },
    {
      id: 'p3',
      title: 'Minimal Geometric Studio Glass',
      category: 'Wallpaper',
      url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
      resolution: '2560 x 1600',
    },
    {
      id: 'p4',
      title: 'Cyberpunk Tablet Workspace',
      category: 'Tangkapan Layar',
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      resolution: '1920 x 1080',
    },
    {
      id: 'p5',
      title: 'Stealth Matrix Dark Wave',
      category: 'Wallpaper',
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      resolution: '2880 x 1800',
    },
  ];

  const [activePhoto, setActivePhoto] = useState(photos[0]);
  const [filter, setFilter] = useState('Semua');

  const filtered = filter === 'Semua' ? photos : photos.filter((p) => p.category === filter);

  const handleDragStart = (e: React.DragEvent, photo: typeof photos[0]) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        type: 'image-transfer',
        name: photo.title + '.jpg',
        imageUrl: photo.url,
      })
    );
  };

  return (
    <div className="flex h-full w-full bg-slate-900 text-slate-100 overflow-hidden select-none">
      {/* Photo Grid */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-12 border-b border-white/10 px-4 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2">
            {['Semua', 'Wallpaper', 'Kamera', 'Tangkapan Layar'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  filter === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-slate-400">
            Tarik foto ke <strong>Catatan</strong> untuk menyisipkan
          </span>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filtered.map((photo) => (
              <div
                key={photo.id}
                draggable
                onDragStart={(e) => handleDragStart(e, photo)}
                onClick={() => setActivePhoto(photo)}
                className={`group relative rounded-xl overflow-hidden aspect-4/3 border cursor-pointer transition-all ${
                  activePhoto.id === photo.id
                    ? 'ring-2 ring-blue-500 border-transparent shadow-lg'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="text-xs font-semibold text-white truncate">{photo.title}</div>
                  <div className="text-[10px] text-slate-300">{photo.resolution}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inspector / Preview Pane */}
      <div className="w-72 bg-slate-950/80 border-l border-white/10 p-4 flex flex-col shrink-0">
        <div className="aspect-16/10 w-full rounded-xl overflow-hidden border border-white/10 bg-slate-900 mb-3 shadow-md">
          <img
            src={activePhoto.url}
            alt={activePhoto.title}
            className="w-full h-full object-cover"
          />
        </div>

        <h3 className="font-bold text-sm text-white">{activePhoto.title}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{activePhoto.category}</p>

        <div className="mt-4 space-y-2 text-xs border-t border-white/10 pt-3">
          <div className="flex justify-between text-slate-400">
            <span>Resolusi</span>
            <span className="text-white font-mono">{activePhoto.resolution}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Kedalaman Warna</span>
            <span className="text-white font-mono">10-bit HDR</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Format</span>
            <span className="text-white font-mono">JPEG High-Res</span>
          </div>
        </div>

        <div className="mt-auto pt-3 flex flex-col gap-2">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
            💡 <strong>Multitasking Tip:</strong> Kamu bisa menyeret foto ini langsung ke dokumen Catatan Pad 6 yang sedang terbuka!
          </div>
        </div>
      </div>
    </div>
  );
};
