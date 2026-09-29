import React, { useEffect } from 'react';
import { Logo } from '../components/common/Logo';
import { useApp } from '../context/AppContext';
import { Sparkles, GraduationCap, ArrowRightLeft } from 'lucide-react';

export const Screen01_Splash: React.FC = () => {
  const { currentUser, onboardingCompleted, navigate } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentUser) {
        navigate('HOME');
      } else if (!onboardingCompleted) {
        navigate('ONBOARDING');
      } else {
        navigate('LOGIN');
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, [currentUser, onboardingCompleted, navigate]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-between p-8 text-center relative overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950/40 to-slate-950 animate-fade-in">
      {/* Background glowing blurred circles */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />

      {/* Top spacer */}
      <div className="pt-8" />

      {/* Hero Logo Section */}
      <div className="flex flex-col items-center gap-6 z-10">
        <div className="p-4 rounded-3xl bg-indigo-950/40 border border-indigo-500/30 backdrop-blur-xl shadow-2xl animate-pulse">
          <Logo size="xl" showTagline />
        </div>
        <p className="text-slate-300 text-sm max-w-xs leading-relaxed font-medium">
          The Student-First Peer Skill Exchange Platform
        </p>
      </div>

      {/* Loading Indicator */}
      <div className="flex flex-col items-center gap-4 z-10">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <Sparkles className="w-5 h-5 text-indigo-400 absolute animate-pulse" />
        </div>
        <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
          Initializing Student Network...
        </span>
      </div>

      {/* Footer Branding */}
      <div className="flex items-center gap-2 text-slate-500 text-xs z-10 pb-4">
        <GraduationCap className="w-4 h-4 text-indigo-400" />
        <span>Built for College Skill Exchange</span>
      </div>
    </div>
  );
};
