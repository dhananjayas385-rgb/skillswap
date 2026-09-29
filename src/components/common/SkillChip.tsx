import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { SkillLevel } from '../../types';

interface SkillChipProps {
  name: string;
  level?: SkillLevel;
  category?: string;
  onRemove?: () => void;
  onClick?: () => void;
  variant?: 'teach' | 'want' | 'neutral';
  size?: 'sm' | 'md';
}

export const SkillChip: React.FC<SkillChipProps> = ({
  name,
  level,
  onRemove,
  onClick,
  variant = 'neutral',
  size = 'md',
}) => {
  const levelColors: Record<string, string> = {
    Beginner: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    Intermediate: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    Advanced: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    Expert: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  };

  const variantStyles = {
    teach: 'bg-indigo-950/60 text-indigo-200 border-indigo-500/40 hover:border-indigo-400',
    want: 'bg-cyan-950/60 text-cyan-200 border-cyan-500/40 hover:border-cyan-400',
    neutral: 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-xs font-medium gap-2',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center rounded-full border ${variantStyles[variant]} ${
        sizeStyles[size]
      } ${
        onClick ? 'cursor-pointer transition-all hover:scale-105' : ''
      }`}
    >
      <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
      <span>{name}</span>
      {level && (
        <span
          className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${
            levelColors[level] || 'bg-slate-700 text-slate-300'
          }`}
        >
          {level}
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:text-rose-400 p-0.5 rounded-full hover:bg-slate-700/50 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
