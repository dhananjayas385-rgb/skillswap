import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { SkillChip } from '../components/common/SkillChip';
import {
  User as UserIcon,
  GraduationCap,
  MapPin,
  Star,
  Sparkles,
  Settings,
  BookOpen,
  Award,
  Edit,
  Clock,
} from 'lucide-react';

export const Screen20_Profile: React.FC = () => {
  const { currentUser, skillOffers, skillWants, reviews, navigate } = useApp();

  if (!currentUser) return null;

  const myOffers = skillOffers.filter((o) => o.userId === currentUser.id);
  const myWants = skillWants.filter((w) => w.userId === currentUser.id);
  const myReviews = reviews.filter((r) => r.revieweeId === currentUser.id);

  return (
    <div className="min-h-screen p-5 flex flex-col gap-6 bg-slate-950 pb-24 animate-fade-in">
      {/* Profile Header */}
      <div className="glass-card p-6 rounded-3xl border border-indigo-900/40 flex flex-col items-center text-center gap-3 relative overflow-hidden">
        <button
          onClick={() => navigate('SETTINGS')}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <Settings className="w-4 h-4" />
        </button>

        <div className="relative">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-24 h-24 rounded-3xl object-cover border-4 border-indigo-500/50 shadow-xl"
          />
          <button
            onClick={() => navigate('PROFILE_SETUP')}
            className="absolute bottom-0 right-0 p-1.5 rounded-xl bg-indigo-600 text-white shadow-md"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <h1 className="text-xl font-black text-slate-100">{currentUser.name}</h1>
          <div className="flex items-center gap-1 text-xs text-indigo-300 font-semibold mt-0.5">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>{currentUser.department} • {currentUser.semester}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentUser.college}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 w-full pt-3 border-t border-slate-800">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{currentUser.rating.toFixed(1)}</span>
            </div>
            <span className="text-[10px] text-slate-400">Rating</span>
          </div>

          <div className="flex flex-col items-center border-x border-slate-800">
            <span className="font-bold text-indigo-300 text-sm">{currentUser.completedExchanges}</span>
            <span className="text-[10px] text-slate-400">Exchanges</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="font-bold text-cyan-300 text-sm">{myReviews.length}</span>
            <span className="text-[10px] text-slate-400">Reviews</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      {currentUser.bio && (
        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col gap-1.5 text-xs">
          <span className="font-bold text-slate-400 uppercase tracking-wider">Bio</span>
          <p className="text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800">
            "{currentUser.bio}"
          </p>
        </div>
      )}

      {/* Skills Offered */}
      <div className="glass-card p-5 rounded-3xl border border-indigo-900/40 bg-indigo-950/20 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Skills I Offer ({myOffers.length})
          </span>
          <button
            onClick={() => navigate('MY_SKILLS')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Manage
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {myOffers.map((o) => (
            <SkillChip key={o.id} name={o.skillName} level={o.level} variant="teach" />
          ))}
        </div>
      </div>

      {/* Skills Wanted */}
      <div className="glass-card p-5 rounded-3xl border border-cyan-900/40 bg-cyan-950/20 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Skills I Want To Learn ({myWants.length})
          </span>
          <button
            onClick={() => navigate('MY_SKILLS')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Manage
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {myWants.map((w) => (
            <SkillChip key={w.id} name={w.skillName} variant="want" />
          ))}
        </div>
      </div>

      {/* Action Shortcut Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" size="md" onClick={() => navigate('PROFILE_SETUP')}>
          Edit Profile
        </Button>
        <Button variant="outline" size="md" onClick={() => navigate('MY_SKILLS')}>
          Manage Skills
        </Button>
      </div>
    </div>
  );
};
