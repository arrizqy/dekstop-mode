import React, { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { WindowInstance, AppDefinition, FileItem, SystemNotification, SystemSettings, SnapType } from './types/desktop';
import {
  INITIAL_APPS,
  INITIAL_FILES,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS,
} from './utils/initialData';
import {
  calculateSnapBounds,
  bringToTop,
  getNextCascadePosition,
  TASKBAR_HEIGHT,
} from './utils/windowManager';
import { calculateRamStats, optimizeMemory } from './utils/ramManager';

// Desktop & Window Frame Components
import { DesktopSurface } from './components/desktop/DesktopSurface';
import { WindowFrame } from './components/desktop/WindowFrame';
import { Taskbar } from './components/desktop/Taskbar';
import { StartMenu } from './components/desktop/StartMenu';
import { QuickSettings } from './components/desktop/QuickSettings';
import { NotificationCenter } from './components/desktop/NotificationCenter';
import { AltTabSwitcher } from './components/desktop/AltTabSwitcher';
import { SnapPreview } from './components/desktop/SnapPreview';

// Apps
import { FileManagerApp } from './components/apps/FileManagerApp';
import { NotesApp } from './components/apps/NotesApp';
import { TaskManagerApp } from './components/apps/TaskManagerApp';
import { BrowserApp } from './components/apps/BrowserApp';
import { GalleryApp } from './components/apps/GalleryApp';
import { TerminalApp } from './components/apps/TerminalApp';
import { CalculatorApp } from './components/apps/CalculatorApp';
import { MusicApp } from './components/apps/MusicApp';
import { SettingsApp } from './components/apps/SettingsApp';
import { CameraApp } from './components/apps/CameraApp';
import { AppStoreApp } from './components/apps/AppStoreApp';
import { GenericInstalledApp } from './components/apps/GenericInstalledApp';
import { DeviceAppScannerModal } from './components/desktop/DeviceAppScannerModal';
import { loadStoredDeviceApps, saveStoredDeviceApps } from './utils/deviceAppScanner';

export default function App() {
  const [apps, setApps] = useState<AppDefinition[]>(() => loadStoredDeviceApps(INITIAL_APPS));
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);

  // Screen size tracking
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Windows initial state: Open 2 windows to showcase multitasking right away!
  const [windows, setWindows] = useState<WindowInstance[]>([
    {
      id: 'win-files-1',
      appId: 'files',
      title: 'Pengelola Berkas',
      icon: 'folder',
      isMinimized: false,
      isMaximized: false,
      snapType: 'none',
      zIndex: 10,
      position: { x: 36, y: 36, w: 680, h: 480 },
      prevPosition: { x: 36, y: 36, w: 680, h: 480 },
      isFrozen: false,
      ramUsageMb: 110,
    },
    {
      id: 'win-notes-1',
      appId: 'notes',
      title: 'Catatan Pad 6',
      icon: 'file-text',
      isMinimized: false,
      isMaximized: false,
      snapType: 'none',
      zIndex: 12,
      position: { x: 520, y: 70, w: 640, h: 500 },
      prevPosition: { x: 520, y: 70, w: 640, h: 500 },
      isFrozen: false,
      ramUsageMb: 95,
    },
  ]);

  const [activeWindowId, setActiveWindowId] = useState<string | null>('win-notes-1');

  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAltTabOpen, setIsAltTabOpen] = useState(false);
  const [isDeviceScannerOpen, setIsDeviceScannerOpen] = useState(false);
  const [activeSnapPreview, setActiveSnapPreview] = useState<SnapType>('none');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSyncDeviceApps = useCallback((syncedApps: AppDefinition[]) => {
    setApps((prev) => {
      const merged = [...prev];
      syncedApps.forEach((sa) => {
        const idx = merged.findIndex((m) => m.id === sa.id);
        if (idx >= 0) {
          merged[idx] = { ...merged[idx], ...sa };
        } else {
          merged.push(sa);
        }
      });
      saveStoredDeviceApps(merged);
      return merged;
    });
    showToast(`Berhasil menyinkronkan ${syncedApps.length} aplikasi dari tablet Xiaomi Pad 6!`);
  }, []);

  // RAM calculations
  const ramStats = useMemo(() => {
    return calculateRamStats(windows, settings.totalRamGb, settings.memoryExtensionGb);
  }, [windows, settings.totalRamGb, settings.memoryExtensionGb]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3500);
  }, []);

  // Focus Window
  const handleFocusWindow = useCallback((id: string) => {
    setActiveWindowId(id);
    setWindows((prev) => bringToTop(prev, id));
  }, []);

  // Launch App
  const handleOpenApp = useCallback(
    (appId: string) => {
      // Check if already open and not multi-instance
      const appDef = apps.find((a) => a.id === appId);
      if (!appDef) return;

      const existing = windows.find((w) => w.appId === appId);
      if (existing && !appDef.canMultiInstance) {
        handleFocusWindow(existing.id);
        return;
      }

      const initialPos = getNextCascadePosition(
        windows,
        appDef.defaultWidth,
        appDef.defaultHeight,
        screenSize.width,
        screenSize.height,
        TASKBAR_HEIGHT
      );

      const maxZ = windows.reduce((m, w) => Math.max(m, w.zIndex), 10);
      const newWin: WindowInstance = {
        id: `win-${appId}-${Date.now()}`,
        appId,
        title: appDef.name,
        icon: appDef.icon,
        isMinimized: false,
        isMaximized: false,
        snapType: 'none',
        zIndex: maxZ + 1,
        position: initialPos,
        prevPosition: initialPos,
        isFrozen: false,
        ramUsageMb: appDef.baseRamMb,
      };

      setWindows((prev) => [...prev, newWin]);
      setActiveWindowId(newWin.id);
    },
    [apps, windows, screenSize, handleFocusWindow]
  );

  // Close Window
  const handleCloseWindow = useCallback(
    (id: string) => {
      setWindows((prev) => {
        const remaining = prev.filter((w) => w.id !== id);
        if (activeWindowId === id) {
          const topWindow = remaining
            .filter((w) => !w.isMinimized)
            .sort((a, b) => b.zIndex - a.zIndex)[0];
          setActiveWindowId(topWindow ? topWindow.id : null);
        }
        return remaining;
      });
    },
    [activeWindowId]
  );

  // Minimize Window
  const handleMinimizeWindow = useCallback(
    (id: string) => {
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id === id) {
            // If autoFreezeInactive is enabled, freeze it on minimize!
            return {
              ...w,
              isMinimized: true,
              isFrozen: settings.autoFreezeInactive ? true : w.isFrozen,
            };
          }
          return w;
        })
      );

      if (activeWindowId === id) {
        const remaining = windows
          .filter((w) => w.id !== id && !w.isMinimized)
          .sort((a, b) => b.zIndex - a.zIndex)[0];
        setActiveWindowId(remaining ? remaining.id : null);
      }
    },
    [activeWindowId, windows, settings.autoFreezeInactive]
  );

  // Toggle Maximize Window
  const handleToggleMaximize = useCallback(
    (id: string) => {
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id === id) {
            if (w.isMaximized || w.snapType !== 'none') {
              return {
                ...w,
                isMaximized: false,
                snapType: 'none',
                position: w.prevPosition,
              };
            } else {
              const fullBounds = calculateSnapBounds(
                'fullscreen',
                screenSize.width,
                screenSize.height,
                TASKBAR_HEIGHT
              );
              return {
                ...w,
                isMaximized: true,
                snapType: 'fullscreen',
                prevPosition: w.position,
                position: fullBounds,
              };
            }
          }
          return w;
        })
      );
    },
    [screenSize]
  );

  // Snap Window
  const handleSnapWindow = useCallback(
    (id: string, snapType: SnapType) => {
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id === id) {
            const newBounds = calculateSnapBounds(
              snapType,
              screenSize.width,
              screenSize.height,
              TASKBAR_HEIGHT
            );
            return {
              ...w,
              snapType,
              isMaximized: snapType === 'fullscreen',
              prevPosition: w.snapType === 'none' ? w.position : w.prevPosition,
              position: newBounds,
            };
          }
          return w;
        })
      );
    },
    [screenSize]
  );

  // Update window position
  const handleUpdatePosition = useCallback((id: string, newPos: WindowInstance['position']) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, position: newPos } : w)));
  }, []);

  // Toggle Freeze (RAM optimization)
  const handleToggleFreeze = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isFrozen: !w.isFrozen } : w))
    );
  }, []);

  // Optimize RAM Now
  const handleOptimizeRam = useCallback(() => {
    const { freedMb, updatedWindows } = optimizeMemory(windows, activeWindowId);
    setWindows(updatedWindows);

    // Confetti effect for RAM Boost
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.9, x: 0.9 },
        colors: ['#3b82f6', '#06b6d4', '#10b981'],
      });
    } catch {}

    showToast(`⚡ RAM Dioptimalkan: Berhasil membebaskan ${freedMb} MB RAM! Kinerja Pad 6 maksimal.`);

    // Add notification
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title: 'RAM Berhasil Dibersihkan',
      message: `${freedMb} MB memori dibebaskan. Aplikasi latar dibekukan agar multitasking tetap lancar.`,
      time: 'Baru saja',
      source: 'Pembersih RAM HyperOS',
      icon: 'sparkles',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, [windows, activeWindowId, showToast]);

  // Show Desktop (Minimize all or restore)
  const handleShowDesktop = useCallback(() => {
    const allMinimized = windows.every((w) => w.isMinimized);
    setWindows((prev) =>
      prev.map((w) => ({
        ...w,
        isMinimized: !allMinimized,
      }))
    );
  }, [windows]);

  // Taskbar Window Click
  const handleTaskbarWindowClick = useCallback(
    (id: string) => {
      const win = windows.find((w) => w.id === id);
      if (!win) return;

      if (win.isMinimized) {
        handleFocusWindow(id);
      } else if (activeWindowId === id) {
        handleMinimizeWindow(id);
      } else {
        handleFocusWindow(id);
      }
    },
    [windows, activeWindowId, handleFocusWindow, handleMinimizeWindow]
  );

  // Keyboard Shortcuts (DeX External Keyboard support!)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + Tab -> Toggle App Switcher
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        setIsAltTabOpen((prev) => !prev);
        return;
      }

      // Windows / Meta key -> Toggle Start Menu
      if (e.key === 'Meta') {
        e.preventDefault();
        setIsStartMenuOpen((prev) => !prev);
        return;
      }

      // Win + D -> Show Desktop
      if (e.metaKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        handleShowDesktop();
        return;
      }

      // Ctrl + Shift + Esc -> Open Task Manager
      if (e.ctrlKey && e.shiftKey && e.key === 'Escape') {
        e.preventDefault();
        handleOpenApp('taskmgr');
        return;
      }

      // Alt + F4 or Ctrl + W -> Close active window
      if ((e.altKey && e.key === 'F4') || (e.ctrlKey && (e.key === 'w' || e.key === 'W'))) {
        if (activeWindowId) {
          e.preventDefault();
          handleCloseWindow(activeWindowId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeWindowId, handleShowDesktop, handleOpenApp, handleCloseWindow]);

  // File system interactions
  const handleOpenFile = (file: FileItem) => {
    if (file.type === 'text') {
      handleOpenApp('notes');
    } else if (file.type === 'image') {
      handleOpenApp('gallery');
    } else if (file.type === 'code') {
      handleOpenApp('terminal');
    }
  };

  const handleCreateFile = (folderId: string, name: string, type: FileItem['type']) => {
    const newFile: FileItem = {
      id: `file-${Date.now()}`,
      name,
      type,
      size: '1.2 KB',
      sizeBytes: 1200,
      updatedAt: 'Baru saja',
      parentId: folderId,
      content: `# ${name}\nBerkas baru dibuat pada Xiaomi Pad 6 DeX Workstation.`,
    };
    setFiles((prev) => [newFile, ...prev]);
    showToast(`Dokumen "${name}" berhasil dibuat di Pengelola Berkas.`);
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    showToast('Berkas berhasil dihapus dari penyimpanan.');
  };

  // Render content of each window
  const renderAppContent = (win: WindowInstance) => {
    switch (win.appId) {
      case 'files':
        return (
          <FileManagerApp
            files={files}
            onOpenFile={handleOpenFile}
            onCreateFile={handleCreateFile}
            onDeleteFile={handleDeleteFile}
          />
        );
      case 'notes':
        return <NotesApp />;
      case 'taskmgr':
        return (
          <TaskManagerApp
            windows={windows}
            ramStats={ramStats}
            settings={settings}
            onOptimizeRam={handleOptimizeRam}
            onToggleFreezeWindow={handleToggleFreeze}
            onCloseWindow={handleCloseWindow}
            onUpdateSettings={(s) => setSettings((prev) => ({ ...prev, ...s }))}
          />
        );
      case 'browser':
        return <BrowserApp />;
      case 'gallery':
        return <GalleryApp />;
      case 'terminal':
        return (
          <TerminalApp
            ramStats={ramStats}
            windows={windows}
            onOptimizeRam={handleOptimizeRam}
          />
        );
      case 'calculator':
        return <CalculatorApp />;
      case 'music':
        return <MusicApp />;
      case 'settings':
        return (
          <SettingsApp
            settings={settings}
            onUpdateSettings={(s) => setSettings((prev) => ({ ...prev, ...s }))}
          />
        );
      case 'camera':
        return (
          <CameraApp
            onCapturePhoto={(photoUrl) => {
              const newPhotoFile: FileItem = {
                id: `shot-${Date.now()}`,
                name: `IMG_${Date.now()}.jpg`,
                type: 'image',
                size: '3.4 MB',
                sizeBytes: 3500000,
                updatedAt: 'Baru saja',
                parentId: 'pic',
                imageUrl: photoUrl,
              };
              setFiles((prev) => [newPhotoFile, ...prev]);
              showToast('Foto tersimpan di Galeri & Pengelola Berkas!');
            }}
          />
        );
      case 'appstore':
        return (
          <AppStoreApp
            installedApps={apps}
            onInstallApp={(newApp) => {
              setApps((prev) => [...prev, newApp]);
              showToast(`Aplikasi "${newApp.name}" berhasil dipasang ke mode multi-jendela!`);
            }}
            onOpenApp={(id) => handleOpenApp(id)}
          />
        );
      default: {
        const foundApp = apps.find((a) => a.id === win.appId);
        if (foundApp) {
          return <GenericInstalledApp app={foundApp} onOpenAppInWindow={handleOpenApp} />;
        }
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-300">
            <h3 className="font-bold text-base text-white mb-2">{win.title}</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Aplikasi berjalan dalam jendela mengambang terpisah dengan akselerasi penuh Snapdragon 870.
            </p>
          </div>
        );
      }
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans select-none">
      {/* Desktop Background & Desktop Icons */}
      <DesktopSurface
        settings={settings}
        apps={apps}
        onOpenApp={handleOpenApp}
        onOpenSettings={() => handleOpenApp('settings')}
        onOpenTaskManager={() => handleOpenApp('taskmgr')}
        onOptimizeRam={handleOptimizeRam}
        onCreateNewNote={() => handleOpenApp('notes')}
        onDropFileToDesktop={(file) => {
          showToast(`Pintasan "${file.name}" ditambahkan ke desktop!`);
        }}
        onDesktopClick={() => {
          setIsStartMenuOpen(false);
          setIsQuickSettingsOpen(false);
          setIsNotificationsOpen(false);
        }}
        onOpenScanner={() => setIsDeviceScannerOpen(true)}
      >
        {/* Floating Windows Stack */}
        {windows.map((win) => (
          <WindowFrame
            key={win.id}
            window={win}
            isActive={activeWindowId === win.id}
            screenWidth={screenSize.width}
            screenHeight={screenSize.height}
            onFocus={() => handleFocusWindow(win.id)}
            onClose={() => handleCloseWindow(win.id)}
            onMinimize={() => handleMinimizeWindow(win.id)}
            onToggleMaximize={() => handleToggleMaximize(win.id)}
            onSnap={(snapType) => handleSnapWindow(win.id, snapType)}
            onUpdatePosition={(pos) => handleUpdatePosition(win.id, pos)}
            onToggleFreeze={() => handleToggleFreeze(win.id)}
          >
            {renderAppContent(win)}
          </WindowFrame>
        ))}

        {/* Snap Preview visual guide */}
        <SnapPreview
          snapType={activeSnapPreview}
          screenWidth={screenSize.width}
          screenHeight={screenSize.height}
        />
      </DesktopSurface>

      {/* Start Menu Flyout */}
      <StartMenu
        isOpen={isStartMenuOpen}
        apps={apps}
        onOpenApp={handleOpenApp}
        onClose={() => setIsStartMenuOpen(false)}
        onOpenSettings={() => handleOpenApp('settings')}
        onExitDeX={() => showToast('Mode Workstation DeX tetap aktif untuk produktivitas!')}
        onOpenScanner={() => setIsDeviceScannerOpen(true)}
      />

      {/* Device App Scanner Modal */}
      <DeviceAppScannerModal
        isOpen={isDeviceScannerOpen}
        onClose={() => setIsDeviceScannerOpen(false)}
        onSyncApps={handleSyncDeviceApps}
        onOpenAppInWindow={handleOpenApp}
      />

      {/* Quick Settings Flyout */}
      <QuickSettings
        isOpen={isQuickSettingsOpen}
        settings={settings}
        ramStats={ramStats}
        onClose={() => setIsQuickSettingsOpen(false)}
        onUpdateSettings={(s) => setSettings((prev) => ({ ...prev, ...s }))}
        onOptimizeRam={handleOptimizeRam}
        onTakeScreenshot={() => showToast('📸 Tangkapan layar tersimpan di Galeri Pad 6!')}
      />

      {/* Notifications Flyout */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        notifications={notifications}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkAllAsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onClearAll={() => setNotifications([])}
      />

      {/* Alt + Tab Switcher Overlay */}
      <AltTabSwitcher
        isOpen={isAltTabOpen}
        windows={windows}
        activeWindowId={activeWindowId}
        onSelectWindow={handleFocusWindow}
        onClose={() => setIsAltTabOpen(false)}
      />

      {/* Responsive Taskbar at Bottom */}
      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        apps={apps}
        ramStats={ramStats}
        unreadNotifsCount={notifications.filter((n) => !n.read).length}
        isStartMenuOpen={isStartMenuOpen}
        isQuickSettingsOpen={isQuickSettingsOpen}
        isNotificationsOpen={isNotificationsOpen}
        onToggleStartMenu={() => setIsStartMenuOpen((prev) => !prev)}
        onToggleQuickSettings={() => setIsQuickSettingsOpen((prev) => !prev)}
        onToggleNotifications={() => setIsNotificationsOpen((prev) => !prev)}
        onToggleAppSwitcher={() => setIsAltTabOpen(true)}
        onShowDesktop={handleShowDesktop}
        onWindowClick={handleTaskbarWindowClick}
        onCloseWindow={handleCloseWindow}
        onOpenApp={handleOpenApp}
        onOptimizeRam={handleOptimizeRam}
      />

      {/* System Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl glass-panel text-white text-xs font-semibold shadow-2xl border border-white/20 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
