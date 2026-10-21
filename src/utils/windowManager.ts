import { SnapType, WindowPosition, WindowInstance } from '../types/desktop';

export const TASKBAR_HEIGHT = 56;

export function calculateSnapBounds(
  snapType: SnapType,
  screenWidth: number,
  screenHeight: number,
  taskbarHeight: number = TASKBAR_HEIGHT
): WindowPosition {
  const usableHeight = screenHeight - taskbarHeight;
  const halfW = Math.floor(screenWidth / 2);
  const halfH = Math.floor(usableHeight / 2);

  switch (snapType) {
    case 'left':
      return { x: 0, y: 0, w: halfW, h: usableHeight };
    case 'right':
      return { x: halfW, y: 0, w: halfW, h: usableHeight };
    case 'top':
    case 'fullscreen':
      return { x: 0, y: 0, w: screenWidth, h: usableHeight };
    case 'bottom':
      return { x: 0, y: halfH, w: screenWidth, h: halfH };
    case 'top-left':
      return { x: 0, y: 0, w: halfW, h: halfH };
    case 'top-right':
      return { x: halfW, y: 0, w: halfW, h: halfH };
    case 'bottom-left':
      return { x: 0, y: halfH, w: halfW, h: halfH };
    case 'bottom-right':
      return { x: halfW, y: halfH, w: halfW, h: halfH };
    case 'none':
    default:
      return {
        x: Math.max(20, Math.floor((screenWidth - 800) / 2)),
        y: Math.max(20, Math.floor((usableHeight - 560) / 2)),
        w: Math.min(800, screenWidth - 40),
        h: Math.min(560, usableHeight - 40),
      };
  }
}

export function clampWindowPosition(
  pos: WindowPosition,
  screenWidth: number,
  screenHeight: number,
  taskbarHeight: number = TASKBAR_HEIGHT
): WindowPosition {
  const usableHeight = screenHeight - taskbarHeight;
  const minW = 280;
  const minH = 180;

  const w = Math.max(minW, Math.min(pos.w, screenWidth));
  const h = Math.max(minH, Math.min(pos.h, usableHeight));

  // Must keep title bar reachable (at least 60px visible on screen)
  const x = Math.max(-w + 80, Math.min(pos.x, screenWidth - 80));
  const y = Math.max(0, Math.min(pos.y, usableHeight - 40));

  return { x, y, w, h };
}

export function bringToTop(windows: WindowInstance[], targetId: string): WindowInstance[] {
  const target = windows.find((w) => w.id === targetId);
  if (!target) return windows;

  const maxZ = windows.reduce((max, w) => Math.max(max, w.zIndex), 10);
  if (target.zIndex === maxZ && !target.isMinimized) {
    return windows;
  }

  return windows.map((w) => {
    if (w.id === targetId) {
      return { ...w, zIndex: maxZ + 1, isMinimized: false };
    }
    return w;
  });
}

export function getNextCascadePosition(
  existingWindows: WindowInstance[],
  defaultWidth: number,
  defaultHeight: number,
  screenWidth: number,
  screenHeight: number,
  taskbarHeight: number = TASKBAR_HEIGHT
): WindowPosition {
  const usableHeight = screenHeight - taskbarHeight;
  const activeCount = existingWindows.filter((w) => !w.isMinimized).length;
  const offset = (activeCount % 7) * 32;

  const initialX = Math.max(24, Math.min(100 + offset, screenWidth - defaultWidth - 30));
  const initialY = Math.max(24, Math.min(60 + offset, usableHeight - defaultHeight - 30));

  return {
    x: initialX,
    y: initialY,
    w: Math.min(defaultWidth, screenWidth - 40),
    h: Math.min(defaultHeight, usableHeight - 40),
  };
}
