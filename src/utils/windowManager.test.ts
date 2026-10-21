import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSnapBounds,
  clampWindowPosition,
  bringToTop,
  getNextCascadePosition,
} from './windowManager';
import { WindowInstance } from '../types/desktop';

test('calculateSnapBounds calculates correct half width for snap left & right', () => {
  const left = calculateSnapBounds('left', 1920, 1080, 56);
  assert.equal(left.x, 0);
  assert.equal(left.y, 0);
  assert.equal(left.w, 960);
  assert.equal(left.h, 1024);

  const right = calculateSnapBounds('right', 1920, 1080, 56);
  assert.equal(right.x, 960);
  assert.equal(right.y, 0);
  assert.equal(right.w, 960);
  assert.equal(right.h, 1024);
});

test('calculateSnapBounds handles fullscreen and quadrant corners', () => {
  const full = calculateSnapBounds('fullscreen', 1600, 900, 50);
  assert.equal(full.x, 0);
  assert.equal(full.y, 0);
  assert.equal(full.w, 1600);
  assert.equal(full.h, 850);

  const topLeft = calculateSnapBounds('top-left', 1600, 900, 50);
  assert.equal(topLeft.x, 0);
  assert.equal(topLeft.y, 0);
  assert.equal(topLeft.w, 800);
  assert.equal(topLeft.h, 425);
});

test('clampWindowPosition keeps window titlebar on-screen', () => {
  const clamped = clampWindowPosition({ x: -999, y: -50, w: 600, h: 400 }, 1920, 1080, 56);
  assert.ok(clamped.x >= -600 + 80);
  assert.equal(clamped.y, 0);
});

test('bringToTop raises zIndex and unminimizes target window', () => {
  const windows: WindowInstance[] = [
    {
      id: 'w1',
      appId: 'files',
      title: 'Files',
      icon: 'folder',
      isMinimized: true,
      isMaximized: false,
      snapType: 'none',
      zIndex: 10,
      position: { x: 50, y: 50, w: 400, h: 300 },
      prevPosition: { x: 50, y: 50, w: 400, h: 300 },
      isFrozen: false,
      ramUsageMb: 120,
    },
    {
      id: 'w2',
      appId: 'notes',
      title: 'Notes',
      icon: 'file-text',
      isMinimized: false,
      isMaximized: false,
      snapType: 'none',
      zIndex: 15,
      position: { x: 100, y: 100, w: 400, h: 300 },
      prevPosition: { x: 100, y: 100, w: 400, h: 300 },
      isFrozen: false,
      ramUsageMb: 90,
    },
  ];

  const updated = bringToTop(windows, 'w1');
  const target = updated.find((w) => w.id === 'w1')!;
  assert.equal(target.isMinimized, false);
  assert.ok(target.zIndex > 15);
});

test('getNextCascadePosition shifts cascading coordinates', () => {
  const pos1 = getNextCascadePosition([], 500, 400, 1200, 800);
  const pos2 = getNextCascadePosition(
    [
      {
        id: '1',
        appId: 'notes',
        title: 'Notes',
        icon: '',
        isMinimized: false,
        isMaximized: false,
        snapType: 'none',
        zIndex: 1,
        position: pos1,
        prevPosition: pos1,
        isFrozen: false,
        ramUsageMb: 80,
      },
    ],
    500,
    400,
    1200,
    800
  );

  assert.ok(pos2.x > pos1.x);
  assert.ok(pos2.y > pos1.y);
});
