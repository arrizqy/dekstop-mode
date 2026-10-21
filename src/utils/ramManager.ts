import { WindowInstance } from '../types/desktop';

export interface RamStats {
  totalMb: number;
  usedMb: number;
  freeMb: number;
  systemReservedMb: number;
  appsUsedMb: number;
  percentage: number;
  isPressureHigh: boolean;
}

export const XIAOMI_PAD6_BASE_RAM_MB = 8192; // 8GB RAM
export const MEMORY_EXTENSION_MB = 3072; // +3GB MIUI Memory Extension
export const SYSTEM_BASE_LOAD_MB = 2240; // Android + HyperOS desktop compositor

export function calculateRamStats(
  windows: WindowInstance[],
  totalRamGb: number = 8,
  memoryExtensionGb: number = 3
): RamStats {
  const totalMb = totalRamGb * 1024 + memoryExtensionGb * 1024;
  const systemReservedMb = SYSTEM_BASE_LOAD_MB;

  const appsUsedMb = windows.reduce((sum, win) => {
    // If window is frozen/suspended, its memory footprint drops by 75%
    const effectiveRam = win.isFrozen ? Math.round(win.ramUsageMb * 0.25) : win.ramUsageMb;
    return sum + effectiveRam;
  }, 0);

  const usedMb = Math.min(totalMb, systemReservedMb + appsUsedMb);
  const freeMb = Math.max(0, totalMb - usedMb);
  const percentage = Math.round((usedMb / totalMb) * 100);

  return {
    totalMb,
    usedMb,
    freeMb,
    systemReservedMb,
    appsUsedMb,
    percentage,
    isPressureHigh: percentage > 82,
  };
}

export function optimizeMemory(
  windows: WindowInstance[],
  activeWindowId: string | null
): {
  freedMb: number;
  updatedWindows: WindowInstance[];
} {
  let freed = 0;

  const updatedWindows = windows.map((w) => {
    // We do not freeze active window
    const isActive = w.id === activeWindowId;
    if (isActive) {
      return { ...w, isFrozen: false };
    }

    // If app is not frozen, freeze it and free up cache
    if (!w.isFrozen) {
      const memorySaved = Math.round(w.ramUsageMb * 0.75);
      freed += memorySaved;
      return { ...w, isFrozen: true };
    }

    return w;
  });

  // Base cache reclaim
  freed += 185;

  return {
    freedMb: freed,
    updatedWindows,
  };
}
