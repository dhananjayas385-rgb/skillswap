import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import {
  Bell,
  CheckCheck,
  MessageSquare,
  Repeat,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
} from 'lucide-react';

export const Screen19_Notifications: React.FC = () => {
  const {
    notifications,
    currentUser,
    markNotificationRead,
    markAllNotificationsRead,
    navigate,
  } = useApp();

  const myNotifications = notifications.filter((n) => n.userId === currentUser?.id);
  const unreadCount = myNotifications.filter((n) => !n.isRead).length;

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'request':
        return <Repeat className="w-4 h-4 text-indigo-400" />;
      case 'accepted':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-rose-400" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-cyan-400" />;
      case 'review':
        return <Star className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-400" />;
    }
  };

  const handleNotificationClick = (notif: any) => {
    markNotificationRead(notif.id);
    if (notif.type === 'request') {
      navigate('EXCHANGE_REQUESTS');
    } else if (notif.type === 'accepted' || notif.type === 'message') {
      navigate('CHAT', { exchangeId: notif.relatedId });
    } else if (notif.type === 'review') {
      navigate('PROFILE');
    }
  };

  return (
    <div className="min-h-screen p-4 flex flex-col gap-5 bg-slate-950 pb-20 animate-fade-in">
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-slate-100 flex items-center gap-2">
            Activity Notifications <Bell className="w-5 h-5 text-indigo-400" />
          </h1>
          <p className="text-xs text-slate-400">Stay updated on requests, messages, and exchanges</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark All Read
          </button>
        )}
      </div>

      {myNotifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-8 h-8" />}
          title="No Notifications Yet"
          description="You are all caught up! You'll receive alerts when peers request skill swaps."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {myNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                notif.isRead
                  ? 'glass-card border-slate-800/80 text-slate-300 opacity-75'
                  : 'bg-indigo-950/30 border-indigo-500/50 text-slate-100 shadow-md'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                {getNotifIcon(notif.type)}
              </div>

              <div className="flex flex-col flex-1 gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">{notif.title}</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-snug">{notif.message}</p>
              </div>

              {!notif.isRead && (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 mt-2 animate-pulse" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
