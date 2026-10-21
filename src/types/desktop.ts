export type SnapType =
  | 'none'
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'fullscreen';

export interface WindowPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WindowInstance {
  id: string;
  appId: string;
  title: string;
  icon: string;
  isMinimized: boolean;
  isMaximized: boolean;
  snapType: SnapType;
  zIndex: number;
  position: WindowPosition;
  prevPosition: WindowPosition;
  isFrozen: boolean; // RAM optimization state
  ramUsageMb: number;
  customData?: any;
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  category: 'productivity' | 'multimedia' | 'tools' | 'system' | 'custom' | 'social';
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
  baseRamMb: number;
  description: string;
  badge?: string;
  canMultiInstance?: boolean;
  packageName?: string;
  isInstalledOnDevice?: boolean;
  appType?: 'native' | 'system' | 'custom';
  nativeDeepLink?: string;
  webUrl?: string;
  version?: string;
  color?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'image' | 'text' | 'code' | 'archive' | 'music';
  size: string;
  sizeBytes: number;
  updatedAt: string;
  parentId: string | null;
  content?: string;
  imageUrl?: string;
  tags?: string[];
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  source: string;
  icon: string;
  read: boolean;
  priority?: 'normal' | 'high';
}

export interface SystemSettings {
  wallpaper: string;
  performanceMode: 'balanced' | 'performance' | 'battery-saver';
  totalRamGb: number;
  memoryExtensionGb: number;
  autoFreezeInactive: boolean;
  showFps: boolean;
  dockPosition: 'bottom';
  soundVolume: number;
  brightness: number;
  wifiEnabled: boolean;
  bluetoothEnabled: boolean;
  dndEnabled: boolean;
  pointerSpeed: number;
}
