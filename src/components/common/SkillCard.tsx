import React from 'react';
import { Star, Clock, BookOpen, ChevronRight } from 'lucide-react';
import { SkillOffer, User } from '../../types';
import { Button } from './Button';

interface SkillCardProps {
  skill: SkillOffer;
  teacher?: User;
  onSelect?: () => void;
  onRequestExchange?: () => void;
}

export const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  teacher,
  onSelect,
  onRequestExchange,
}) => {
  return (
    <div
      onClick={onSelect}
      className="glass-card glass-card-hover rounded-2xl p-4 flex flex-col gap-3 relative cursor-pointer border border-slate-800"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-800/50 w-fit">
            {skill.category}
          </span>
          <h3 className="font-bold text-slate-100 text-base leading-snug hover:text-indigo-300 transition-colors">
            {skill.skillName}
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 shrink-0">
          {skill.level}
        </span>
      </div>

      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
        {skill.description}
      </p>

      {/* Teacher Row */}
      {teacher && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <img
              src={teacher.avatar}
              alt={teacher.name}
              className="w-8 h-8 rounded-full object-cover border border-indigo-500/40"
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-200 leading-tight">
                {teacher.name}
              </span>
              <span className="text-[11px] text-slate-400">
                {teacher.department}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{teacher.rating.toFixed(1)}</span>
          </div>
        </div>
      )}

      {/* Availability hint */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
        <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span className="truncate">{skill.availability}</span>
      </div>

      <div className="pt-1 flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          fullWidth
          rightIcon={<ChevronRight className="w-4 h-4" />}
          onClick={(e) => {
            e.stopPropagation();
            if (onRequestExchange) onRequestExchange();
            else if (onSelect) onSelect();
          }}
        >
          View Skill Details
        </Button>
      </div>
    </div>
  );
};
