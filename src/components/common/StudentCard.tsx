import React from 'react';
import { Star, GraduationCap, MapPin, ArrowUpRight, Zap } from 'lucide-react';
import { User, MatchResult } from '../../types';
import { SkillChip } from './SkillChip';
import { Button } from './Button';
import { useApp } from '../../context/AppContext';

interface StudentCardProps {
  student: User;
  matchResult?: MatchResult;
  onSelect?: () => void;
  onRequestExchange?: () => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  matchResult,
  onSelect,
  onRequestExchange,
}) => {
  const { skillOffers, skillWants } = useApp();

  const studentOffers = skillOffers.filter((o) => o.userId === student.id);
  const studentWants = skillWants.filter((w) => w.userId === student.id);

  return (
    <div
      onClick={onSelect}
      className="glass-card glass-card-hover rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden cursor-pointer group border border-slate-800"
    >
      {/* Top Match Badge */}
      {matchResult && matchResult.score > 60 && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500/20 to-indigo-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-sm animate-pulse-glow">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{matchResult.label} ({matchResult.score}%)</span>
        </div>
      )}

      {/* Profile Info Header */}
      <div className="flex items-start gap-3.5 pt-1">
        <img
          src={student.avatar}
          alt={student.name}
          className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-md group-hover:scale-105 transition-transform"
        />
        <div className="flex flex-col flex-1 pr-16">
          <h3 className="font-bold text-slate-100 text-base leading-tight group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
            {student.name}
          </h3>
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">{student.department} • {student.semester}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{student.college}</span>
          </div>
        </div>
      </div>

      {/* Bio snippet */}
      {student.bio && (
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60">
          "{student.bio}"
        </p>
      )}

      {/* Rating & Stats row */}
      <div className="flex items-center justify-between py-1 border-y border-slate-800/80 text-xs">
        <div className="flex items-center gap-1 text-amber-400 font-semibold">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{Number(student.rating ?? 0).toFixed(1)} ⭐</span>
          <span className="text-slate-500 font-normal">({student.reviewCount} reviews)</span>
        </div>
        <div className="text-slate-400 text-xs font-medium">
          <span className="text-indigo-400 font-bold">{student.completedExchanges}</span> exchanges done
        </div>
      </div>

      {/* Offered Skills */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
          Can Teach:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {studentOffers.slice(0, 2).map((offer) => (
            <SkillChip
              key={offer.id}
              name={offer.skillName}
              level={offer.level}
              variant="teach"
              size="sm"
            />
          ))}
          {studentOffers.length > 2 && (
            <span className="text-[11px] text-slate-400 self-center">
              +{studentOffers.length - 2} more
            </span>
          )}
        </div>
      </div>

      {/* Wanted Skills */}
      {studentWants.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
            Wants To Learn:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {studentWants.slice(0, 2).map((want) => (
              <SkillChip
                key={want.id}
                name={want.skillName}
                variant="want"
                size="sm"
              />
            ))}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
          onClick={(e) => {
            e.stopPropagation();
            if (onSelect) onSelect();
          }}
        >
          View Profile
        </Button>
        {onRequestExchange && (
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              onRequestExchange();
            }}
          >
            Swap Skills
          </Button>
        )}
      </div>
    </div>
  );
};
