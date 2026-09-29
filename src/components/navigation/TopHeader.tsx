import React from 'react';
import { ArrowLeft, Monitor, Smartphone, RefreshCw, Bell, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';

export const TopHeader: React.FC = () => {
  const {
    currentScreen,
    goBack,
    historyStack,
    mobileFrameMode,
    toggleMobileFrame,
    resetToDemoState,
    notifications,
    currentUser,
    navigate,
  } = useApp();

  if (
    currentScreen === 'SPLASH' ||
    currentScreen === 'ONBOARDING' ||
    currentScreen === 'LOGIN' ||
    currentScreen === 'SIGNUP'
  ) {
    return null;
  }

  const screenTitles: Record<string, string> = {
    HOME: 'Dashboard',
    EXPLORE: 'Discover Skills',
    FILTERS: 'Filter Options',
    SKILL_DETAILS: 'Skill Details',
    STUDENT_PROFILE: 'Student Profile',
    REQUEST_EXCHANGE: 'Request Exchange',
    EXCHANGE_REQUESTS: 'Exchange Requests',
    MATCHED_EXCHANGE: 'Active Exchange',
    CHAT: 'Messages',
    MY_EXCHANGES: 'My Exchanges',
    LEARNING_PROGRESS: 'Learning Milestones',
    MY_SKILLS: 'Manage Skills',
    RATINGS_REVIEWS: 'Ratings & Feedback',
    NOTIFICATIONS: 'Notifications',
    PROFILE: 'My Profile',
    SETTINGS: 'Settings',
    PROFILE_SETUP: 'Profile Setup',
  };

  const showBackButton = historyStack.length > 1 && currentScreen !== 'HOME';

  const unreadCount = notifications.filter(
    (n) => n.userId === currentUser?.id && !n.isRead
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {showBackButton ? (
          <button
            onClick={goBack}
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/80 border border-slate-700 hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <Logo size="sm" />
        )}
        <h2 className="font-bold text-slate-100 text-base tracking-tight truncate max-w-[160px]">
          {screenTitles[currentScreen] || 'SkillSwap'}
        </h2>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2">
        {/* Toggle Frame for Desktop viewing */}
        <button
          onClick={toggleMobileFrame}
          title={mobileFrameMode ? 'Switch to Full Mobile Screen' : 'Switch to Phone Frame Container'}
          className="p-2 rounded-xl text-slate-400 hover:text-indigo-300 bg-slate-900/80 border border-slate-800 hover:bg-slate-800 transition-colors hidden sm:flex"
        >
          {mobileFrameMode ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Reset Demo Data */}
        <button
          onClick={resetToDemoState}
          title="Reset sample data"
          className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 bg-slate-900/80 border border-slate-800 hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Notifications Icon (if logged in) */}
        {currentUser && (
          <button
            onClick={() => navigate('NOTIFICATIONS')}
            className="relative p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>
        )}

        {/* Settings Icon */}
        {currentUser && (
          <button
            onClick={() => navigate('SETTINGS')}
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
