import React from 'react';
import { ArrowLeftRight, Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false, className = '' }) => {
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center gap-2.5">
        <div className="relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-2.5 shadow-lg shadow-indigo-500/30">
          <ArrowLeftRight className={`${iconSizes[size]} text-white transform -rotate-12`} />
          <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-amber-300 animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className={`font-black tracking-tight ${textSizes[size]} bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent`}>
            Skill<span className="text-indigo-400">Swap</span>
          </span>
        </div>
      </div>
      {showTagline && (
        <span className="mt-1 text-xs font-medium tracking-widest text-cyan-400 uppercase">
          Learn • Teach • Exchange
        </span>
      )}
    </div>
  );
};
