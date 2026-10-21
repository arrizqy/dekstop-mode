import React, { useState, useRef, useEffect } from 'react';
import {
  Minus,
  Square,
  Copy,
  X,
  Layout,
  Snowflake,
  Play,
  Maximize2,
  Folder,
  FileText,
  Globe,
  Image,
  Activity,
  Terminal,
  Calculator,
  Music,
  Settings,
  Camera,
  Download,
  Box,
  MessageCircle,
  Video,
  Mail,
  Send,
  ShieldCheck,
  Film,
  Cloud,
  Clock,
  ShoppingBag,
  MapPin,
} from 'lucide-react';
import { WindowInstance, SnapType } from '../../types/desktop';
import { calculateSnapBounds, clampWindowPosition, TASKBAR_HEIGHT } from '../../utils/windowManager';

interface WindowFrameProps {
  window: WindowInstance;
  isActive: boolean;
  screenWidth: number;
  screenHeight: number;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onSnap: (snapType: SnapType) => void;
  onUpdatePosition: (newPos: WindowInstance['position']) => void;
  onToggleFreeze: () => void;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  window: win,
  isActive,
  screenWidth,
  screenHeight,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onSnap,
  onUpdatePosition,
  onToggleFreeze,
  children,
}) => {
  const [showSnapMenu, setShowSnapMenu] = useState(false);
  const snapMenuTimeoutRef = useRef<any>(null);

  // Dragging state
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, winX: 0, winY: 0 });

  // Resizing state
  const isResizingRef = useRef<string | null>(null);
  const resizeStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });

  const getAppIcon = (iconName: string) => {
    switch (iconName) {
      case 'folder':
        return <Folder className="w-4 h-4 text-sky-400" />;
      case 'file-text':
        return <FileText className="w-4 h-4 text-amber-400" />;
      case 'globe':
        return <Globe className="w-4 h-4 text-blue-400" />;
      case 'image':
        return <Image className="w-4 h-4 text-emerald-400" />;
      case 'activity':
        return <Activity className="w-4 h-4 text-rose-400" />;
      case 'terminal':
        return <Terminal className="w-4 h-4 text-emerald-400" />;
      case 'calculator':
        return <Calculator className="w-4 h-4 text-orange-400" />;
      case 'music':
        return <Music className="w-4 h-4 text-violet-400" />;
      case 'settings':
        return <Settings className="w-4 h-4 text-slate-300" />;
      case 'camera':
        return <Camera className="w-4 h-4 text-red-400" />;
      case 'download':
        return <Download className="w-4 h-4 text-cyan-400" />;
      case 'message-circle':
        return <MessageCircle className="w-4 h-4 text-emerald-400" />;
      case 'video':
        return <Video className="w-4 h-4 text-rose-500" />;
      case 'mail':
        return <Mail className="w-4 h-4 text-amber-500" />;
      case 'send':
        return <Send className="w-4 h-4 text-sky-400" />;
      case 'shield-check':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'film':
        return <Film className="w-4 h-4 text-rose-600" />;
      case 'cloud':
        return <Cloud className="w-4 h-4 text-blue-400" />;
      case 'clock':
        return <Clock className="w-4 h-4 text-orange-400" />;
      case 'shopping-bag':
        return <ShoppingBag className="w-4 h-4 text-emerald-500" />;
      case 'map-pin':
        return <MapPin className="w-4 h-4 text-green-400" />;
      default:
        return <Box className="w-4 h-4 text-blue-400" />;
    }
  };

  // Drag start
  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // only left click
    if ((e.target as HTMLElement).closest('.window-control-btn')) return;

    onFocus();

    // If maximized or snapped, dragging restores to previous position
    let startX = win.position.x;
    let startY = win.position.y;

    if (win.isMaximized || win.snapType !== 'none') {
      const restored = calculateSnapBounds('none', screenWidth, screenHeight, TASKBAR_HEIGHT);
      startX = Math.max(0, e.clientX - restored.w / 2);
      startY = Math.max(0, e.clientY - 18);
      onSnap('none');
      onUpdatePosition({ ...restored, x: startX, y: startY });
    }

    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      winX: startX,
      winY: startY,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = moveEvent.clientX - dragStartRef.current.mouseX;
      const dy = moveEvent.clientY - dragStartRef.current.mouseY;

      const newPos = clampWindowPosition(
        {
          x: dragStartRef.current.winX + dx,
          y: dragStartRef.current.winY + dy,
          w: win.position.w,
          h: win.position.h,
        },
        screenWidth,
        screenHeight,
        TASKBAR_HEIGHT
      );

      onUpdatePosition(newPos);
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      // Snap on drag to edges!
      if (upEvent.clientX <= 10) {
        onSnap('left');
      } else if (upEvent.clientX >= screenWidth - 10) {
        onSnap('right');
      } else if (upEvent.clientY <= 10) {
        onSnap('fullscreen');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Resize start
  const handleResizeMouseDown = (handle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onFocus();

    isResizingRef.current = handle;
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      x: win.position.x,
      y: win.position.y,
      w: win.position.w,
      h: win.position.h,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizingRef.current) return;
      const dx = moveEvent.clientX - resizeStartRef.current.mouseX;
      const dy = moveEvent.clientY - resizeStartRef.current.mouseY;

      let { x, y, w, h } = resizeStartRef.current;

      if (isResizingRef.current.includes('e')) w += dx;
      if (isResizingRef.current.includes('s')) h += dy;
      if (isResizingRef.current.includes('w')) {
        w -= dx;
        x += dx;
      }
      if (isResizingRef.current.includes('n')) {
        h -= dy;
        y += dy;
      }

      onUpdatePosition(
        clampWindowPosition({ x, y, w, h }, screenWidth, screenHeight, TASKBAR_HEIGHT)
      );
    };

    const handleMouseUp = () => {
      isResizingRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  if (win.isMinimized) {
    return null;
  }

  const bounds =
    win.snapType !== 'none'
      ? calculateSnapBounds(win.snapType, screenWidth, screenHeight, TASKBAR_HEIGHT)
      : win.position;

  return (
    <div
      onMouseDown={onFocus}
      className={`fixed flex flex-col rounded-2xl overflow-hidden transition-shadow select-none ${
        isActive ? 'window-shadow ring-1 ring-blue-500/50' : 'window-shadow-inactive ring-1 ring-white/10'
      } ${win.isFrozen ? 'opacity-85' : 'opacity-100'}`}
      style={{
        left: bounds.x,
        top: bounds.y,
        width: bounds.w,
        height: bounds.h,
        zIndex: win.zIndex,
      }}
    >
      {/* Window Header / Title Bar */}
      <div
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={onToggleMaximize}
        className={`h-11 px-3 flex items-center justify-between gap-2 border-b cursor-default shrink-0 transition-colors ${
          isActive
            ? 'bg-slate-900/95 border-white/15 text-white'
            : 'bg-slate-950/90 border-white/5 text-slate-400'
        }`}
      >
        {/* Left: Icon & Title */}
        <div className="flex items-center gap-2.5 min-w-0 pointer-events-none">
          <div className="shrink-0">{getAppIcon(win.icon)}</div>
          <span className="text-xs font-bold truncate tracking-wide">{win.title}</span>

          {win.isFrozen && (
            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Snowflake className="w-2.5 h-2.5" />
              <span>Hemat RAM</span>
            </span>
          )}
        </div>

        {/* Right: Window Controls */}
        <div className="flex items-center gap-1 shrink-0 window-control-btn">
          {/* Quick freeze RAM toggle button */}
          <button
            onClick={onToggleFreeze}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              win.isFrozen
                ? 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title={win.isFrozen ? 'Lanjutkan aplikasi' : 'Bekukan di RAM (Hemat 75%)'}
          >
            {win.isFrozen ? <Play className="w-3.5 h-3.5 text-cyan-300" /> : <Snowflake className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {/* Minimize button */}
          <button
            onClick={onMinimize}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Minimalkan ke Taskbar"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Maximize & Snap Layout Menu Button */}
          <div
            className="relative"
            onMouseEnter={() => {
              clearTimeout(snapMenuTimeoutRef.current);
              setShowSnapMenu(true);
            }}
            onMouseLeave={() => {
              snapMenuTimeoutRef.current = setTimeout(() => setShowSnapMenu(false), 300);
            }}
          >
            <button
              onClick={onToggleMaximize}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Maksimalkan / Tata Letak Jendela"
            >
              {win.isMaximized || win.snapType === 'fullscreen' ? (
                <Copy className="w-3 h-3" />
              ) : (
                <Square className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Snap Layout Flyout Menu (Windows 11 / DeX style) */}
            {showSnapMenu && (
              <div className="absolute right-0 top-full mt-1 w-52 p-2 bg-slate-900 border border-white/20 rounded-xl shadow-2xl z-50 flex flex-col gap-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  Tata Letak Jendela (DeX Snap)
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {/* Left 50% */}
                  <button
                    onClick={() => {
                      onSnap('left');
                      setShowSnapMenu(false);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600/30 border border-white/10 flex gap-1 h-10 items-center transition-all group"
                  >
                    <div className="w-1/2 h-full bg-blue-500/70 rounded group-hover:bg-blue-400" />
                    <div className="w-1/2 h-full bg-white/10 rounded" />
                  </button>

                  {/* Right 50% */}
                  <button
                    onClick={() => {
                      onSnap('right');
                      setShowSnapMenu(false);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600/30 border border-white/10 flex gap-1 h-10 items-center transition-all group"
                  >
                    <div className="w-1/2 h-full bg-white/10 rounded" />
                    <div className="w-1/2 h-full bg-blue-500/70 rounded group-hover:bg-blue-400" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-1">
                  {/* Top-Left */}
                  <button
                    onClick={() => {
                      onSnap('top-left');
                      setShowSnapMenu(false);
                    }}
                    className="p-1 rounded bg-slate-800 hover:bg-blue-600/30 border border-white/10 h-8 flex flex-col justify-start"
                    title="Sudut Kiri Atas"
                  >
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-xs" />
                  </button>
                  {/* Top-Right */}
                  <button
                    onClick={() => {
                      onSnap('top-right');
                      setShowSnapMenu(false);
                    }}
                    className="p-1 rounded bg-slate-800 hover:bg-blue-600/30 border border-white/10 h-8 flex flex-col items-end"
                    title="Sudut Kanan Atas"
                  >
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-xs" />
                  </button>
                  {/* Bottom-Left */}
                  <button
                    onClick={() => {
                      onSnap('bottom-left');
                      setShowSnapMenu(false);
                    }}
                    className="p-1 rounded bg-slate-800 hover:bg-blue-600/30 border border-white/10 h-8 flex flex-col justify-end"
                    title="Sudut Kiri Bawah"
                  >
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-xs" />
                  </button>
                  {/* Bottom-Right */}
                  <button
                    onClick={() => {
                      onSnap('bottom-right');
                      setShowSnapMenu(false);
                    }}
                    className="p-1 rounded bg-slate-800 hover:bg-blue-600/30 border border-white/10 h-8 flex flex-col items-end justify-end"
                    title="Sudut Kanan Bawah"
                  >
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-xs" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    onSnap('fullscreen');
                    setShowSnapMenu(false);
                  }}
                  className="px-2 py-1 text-[11px] text-center rounded bg-slate-800 hover:bg-blue-600 text-white font-medium transition-colors"
                >
                  Layar Penuh (100%)
                </button>
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-rose-600 text-slate-400 hover:text-white transition-colors"
            title="Tutup Jendela"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 bg-slate-900 overflow-hidden relative flex flex-col">
        {children}
      </div>

      {/* 8 Resize Handles (only active when not maximized or snapped) */}
      {!win.isMaximized && win.snapType === 'none' && (
        <>
          <div
            onMouseDown={(e) => handleResizeMouseDown('n', e)}
            className="absolute top-0 inset-x-2 h-1.5 cursor-ns-resize"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown('s', e)}
            className="absolute bottom-0 inset-x-2 h-1.5 cursor-ns-resize"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown('w', e)}
            className="absolute inset-y-2 left-0 w-1.5 cursor-ew-resize"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown('e', e)}
            className="absolute inset-y-2 right-0 w-1.5 cursor-ew-resize"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown('nw', e)}
            className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown('ne', e)}
            className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown('sw', e)}
            className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize"
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown('se', e)}
            className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize"
          />
        </>
      )}
    </div>
  );
};
