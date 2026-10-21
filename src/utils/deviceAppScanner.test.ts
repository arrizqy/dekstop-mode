import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEVICE_INSTALLED_APPS,
  mergeAppLists,
} from './deviceAppScanner';
import { AppDefinition } from '../types/desktop';

test('DEVICE_INSTALLED_APPS contains common Android & Xiaomi Pad 6 apps with valid package names', () => {
  assert.ok(DEVICE_INSTALLED_APPS.length >= 15);
  const wa = DEVICE_INSTALLED_APPS.find((a) => a.id === 'whatsapp');
  assert.ok(wa);
  assert.equal(wa?.packageName, 'com.whatsapp');
  assert.equal(wa?.isInstalledOnDevice, true);

  const yt = DEVICE_INSTALLED_APPS.find((a) => a.id === 'youtube');
  assert.ok(yt);
  assert.equal(yt?.packageName, 'com.google.android.youtube');
});

test('mergeAppLists deduplicates apps by id while preserving custom fields', () => {
  const list1: AppDefinition[] = [
    {
      id: 'files',
      name: 'Pengelola Berkas',
      icon: 'folder',
      category: 'productivity',
      defaultWidth: 700,
      defaultHeight: 500,
      minWidth: 400,
      minHeight: 300,
      baseRamMb: 100,
      description: 'Files',
    },
  ];

  const list2: AppDefinition[] = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: 'message-circle',
      category: 'social',
      defaultWidth: 800,
      defaultHeight: 500,
      minWidth: 400,
      minHeight: 300,
      baseRamMb: 150,
      description: 'Chat',
      packageName: 'com.whatsapp',
    },
    {
      id: 'files',
      name: 'Pengelola Berkas Updated',
      icon: 'folder',
      category: 'productivity',
      defaultWidth: 700,
      defaultHeight: 500,
      minWidth: 400,
      minHeight: 300,
      baseRamMb: 100,
      description: 'Files updated',
    },
  ];

  const merged = mergeAppLists(list1, list2);
  assert.equal(merged.length, 2);
  const filesApp = merged.find((a) => a.id === 'files');
  assert.equal(filesApp?.name, 'Pengelola Berkas Updated');
  const waApp = merged.find((a) => a.id === 'whatsapp');
  assert.equal(waApp?.packageName, 'com.whatsapp');
});
