import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRamStats, optimizeMemory } from './ramManager';
import { WindowInstance } from '../types/desktop';

test('calculateRamStats sums system load and active windows correctly', () => {
  const windows: WindowInstance[] = [
    {
      id: 'w1',
      appId: 'browser',
      title: 'Browser',
      icon: 'globe',
      isMinimized: false,
      isMaximized: false,
      snapType: 'none',
      zIndex: 1,
      position: { x: 0, y: 0, w: 600, h: 400 },
      prevPosition: { x: 0, y: 0, w: 600, h: 400 },
      isFrozen: false,
      ramUsageMb: 400,
    },
    {
      id: 'w2',
      appId: 'notes',
      title: 'Notes',
      icon: 'file',
      isMinimized: false,
      isMaximized: false,
      snapType: 'none',
      zIndex: 2,
      position: { x: 0, y: 0, w: 600, h: 400 },
      prevPosition: { x: 0, y: 0, w: 600, h: 400 },
      isFrozen: true, // Frozen: 100 * 0.25 = 25MB
      ramUsageMb: 100,
    },
  ];

  const stats = calculateRamStats(windows, 8, 3);
  assert.equal(stats.totalMb, 11264); // (8 + 3) * 1024
  assert.equal(stats.appsUsedMb, 425); // 400 + 25
  assert.ok(stats.percentage > 0 && stats.percentage < 100);
});

test('optimizeMemory freezes background windows and reports freed MB', () => {
  const windows: WindowInstance[] = [
    {
      id: 'w1',
      appId: 'browser',
      title: 'Browser',
      icon: 'globe',
      isMinimized: false,
      isMaximized: false,
      snapType: 'none',
      zIndex: 1,
      position: { x: 0, y: 0, w: 600, h: 400 },
      prevPosition: { x: 0, y: 0, w: 600, h: 400 },
      isFrozen: false,
      ramUsageMb: 300,
    },
    {
      id: 'w2',
      appId: 'gallery',
      title: 'Gallery',
      icon: 'image',
      isMinimized: true,
      isMaximized: false,
      snapType: 'none',
      zIndex: 2,
      position: { x: 0, y: 0, w: 600, h: 400 },
      prevPosition: { x: 0, y: 0, w: 600, h: 400 },
      isFrozen: false,
      ramUsageMb: 200,
    },
  ];

  // Active is w1, so w2 should be frozen
  const result = optimizeMemory(windows, 'w1');
  assert.ok(result.freedMb > 0);
  const w2 = result.updatedWindows.find((w) => w.id === 'w2')!;
  assert.equal(w2.isFrozen, true);
  const w1 = result.updatedWindows.find((w) => w.id === 'w1')!;
  assert.equal(w1.isFrozen, false);
});
