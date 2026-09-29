import React from 'react';
import { Home, Compass, Repeat, Bell, User as UserIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScreenId } from '../../types';

export const BottomNav: React.FC = () => {
  const { currentScreen, navigate, currentUser, requests, notifications } = useApp();

  if (
    !currentUser ||
    currentScreen === 'SPLASH' ||
    currentScreen === 'ONBOARDING' ||
    currentScreen === 'LOGIN' ||
    currentScreen === 'SIGNUP' ||
    currentScreen === 'PROFILE_SETUP'
  ) {
    return null;
  }

  // Count pending requests for current user
  const pendingRequestsCount = requests.filter(
    (r) => r.receiverId === currentUser.id && r.status === 'pending'
  ).length;

  // Count unread notifications
  const unreadNotifsCount = notifications.filter(
    (n) => n.userId === currentUser.id && !n.isRead
  ).length;

  const navItems: { id: ScreenId; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'HOME', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'EXPLORE', label: 'Explore', icon: <Compass className="w-5 h-5" /> },
    {
      id: 'MY_EXCHANGES',
      label: 'Exchanges',
      icon: <Repeat className="w-5 h-5" />,
      badge: pendingRequestsCount,
    },
    {
      id: 'NOTIFICATIONS',
      label: 'Activity',
      icon: <Bell className="w-5 h-5" />,
      badge: unreadNotifsCount,
    },
    { id: 'PROFILE', label: 'Profile', icon: <UserIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="sticky bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const isActive =
          currentScreen === item.id ||
          (item.id === 'MY_EXCHANGES' &&
            (currentScreen === 'EXCHANGE_REQUESTS' ||
              currentScreen === 'MATCHED_EXCHANGE' ||
              currentScreen === 'LEARNING_PROGRESS'));

        return (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-200 ${
              isActive
                ? 'text-indigo-400 bg-indigo-950/50 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              {item.icon}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 shadow-md shadow-rose-950 animate-pulse">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">{item.label}</span>
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-indigo-400 absolute -bottom-0.5" />
            )}
          </button>
        );
      })}
    </div>
  );
};
