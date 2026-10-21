import React from 'react';
import { Bell, CheckCheck, Trash2, Calendar as CalendarIcon, Clock, X } from 'lucide-react';
import { SystemNotification } from '../../types/desktop';

interface NotificationCenterProps {
  isOpen: boolean;
  notifications: SystemNotification[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  notifications,
  onClose,
  onMarkAllAsRead,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const today = new Date();
  const dateStr = today.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-16 right-3 w-88 glass-panel rounded-2xl shadow-2xl z-50 p-4 border border-white/20 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200 select-none max-h-[560px]"
    >
      {/* Calendar Header */}
      <div className="p-3 bg-slate-900/80 rounded-xl border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <CalendarIcon className="w-4 h-4 text-blue-400" />
          <div>
            <div className="text-xs font-bold text-white capitalize">{dateStr}</div>
            <div className="text-[10px] text-slate-400">Pad 6 Kalender Kerja</div>
          </div>
        </div>
      </div>

      {/* Notifications Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Pemberitahuan Sistem ({notifications.length})
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <button
            onClick={onMarkAllAsRead}
            className="hover:text-blue-400 p-1"
            title="Tandai Semua Dibaca"
          >
            <CheckCheck className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClearAll}
            className="hover:text-rose-400 p-1"
            title="Hapus Semua"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Notification items */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-72">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            Tidak ada pemberitahuan baru
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3 rounded-xl border transition-all ${
                notif.read
                  ? 'bg-slate-900/40 border-white/5 opacity-75'
                  : 'bg-slate-800/80 border-blue-500/30 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-bold text-xs text-white">{notif.title}</span>
                <span className="text-[10px] text-slate-400">{notif.time}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">{notif.message}</p>
              <div className="mt-1.5 text-[10px] text-blue-400 font-semibold">{notif.source}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
