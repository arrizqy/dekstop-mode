import React from 'react';
import { SnapType } from '../../types/desktop';
import { calculateSnapBounds, TASKBAR_HEIGHT } from '../../utils/windowManager';

interface SnapPreviewProps {
  snapType: SnapType;
  screenWidth: number;
  screenHeight: number;
}

export const SnapPreview: React.FC<SnapPreviewProps> = ({
  snapType,
  screenWidth,
  screenHeight,
}) => {
  if (snapType === 'none') return null;

  const bounds = calculateSnapBounds(snapType, screenWidth, screenHeight, TASKBAR_HEIGHT);

  return (
    <div
      className="fixed pointer-events-none z-30 transition-all duration-200 ease-out rounded-2xl bg-blue-500/15 border-2 border-blue-400/50 backdrop-blur-xs shadow-2xl shadow-blue-500/20"
      style={{
        left: bounds.x + 8,
        top: bounds.y + 8,
        width: bounds.w - 16,
        height: bounds.h - 16,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="px-3 py-1.5 rounded-full bg-blue-600/60 text-white font-bold text-xs uppercase tracking-wider border border-white/20 shadow-md">
          {snapType === 'fullscreen' || snapType === 'top'
            ? 'Layar Penuh'
            : snapType === 'left'
            ? 'Rata Kiri (50%)'
            : snapType === 'right'
            ? 'Rata Kanan (50%)'
            : `Sudut ${snapType}`}
        </span>
      </div>
    </div>
  );
};
