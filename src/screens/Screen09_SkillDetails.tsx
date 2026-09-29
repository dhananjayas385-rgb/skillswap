import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { SkillChip } from '../components/common/SkillChip';
import {
  Star,
  Clock,
  Award,
  GraduationCap,
  MapPin,
  MessageSquare,
  ArrowRight,
  User,
  Sparkles,
  Zap,
} from 'lucide-react';

export const Screen09_SkillDetails: React.FC = () => {
  const { screenParams, skillOffers, users, reviews, navigate, currentUser } = useApp();

  const skillId = screenParams?.skillId || skillOffers[0]?.id;
  const skill = skillOffers.find((s) => s.id === skillId) || skillOffers[0];
  const teacher = users.find((u) => u.id === skill?.userId) || users[0];
  const teacherReviews = reviews.filter((r) => r.revieweeId === teacher.id);

  if (!skill) {
    return (
      <div className="p-8 text-center text-slate-400">Skill not found</div>
    );
  }

  const isSelf = teacher.id === currentUser?.id;

  return (
    <div className="min-h-screen p-5 flex flex-col justify-between bg-slate-950 pb-24 animate-fade-in gap-6">
      <div className="flex flex-col gap-6">
        {/* Category & Title Header */}
        <div className="glass-card p-5 rounded-3xl border border-indigo-900/40 flex flex-col gap-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-950 text-indigo-300 border border-indigo-700/60 uppercase tracking-wider">
              {skill.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700">
              {skill.level} Level
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-100 leading-tight">
            {skill.skillName}
          </h1>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            {skill.description}
          </p>

          <div className="flex flex-col gap-2 pt-1 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>Experience:</strong> {skill.experience}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
              <span><strong>Availability:</strong> {skill.availability}</span>
            </div>
          </div>
        </div>

        {/* Teacher Profile Snapshot Card */}
        <div className="glass-card p-5 rounded-3xl border border-slate-800 flex flex-col gap-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Offered By Student
          </span>

          <div
            onClick={() => navigate('STUDENT_PROFILE', { userId: teacher.id })}
            className="flex items-start gap-3.5 cursor-pointer group"
          >
            <img
              src={teacher.avatar}
              alt={teacher.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-md group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col flex-1 pr-2">
              <h3 className="font-bold text-slate-100 text-base group-hover:text-indigo-300 transition-colors flex items-center gap-1">
                {teacher.name}
              </h3>
              <span className="text-xs text-slate-400">{teacher.department} • {teacher.semester}</span>
              <span className="text-[11px] text-slate-500">{teacher.college}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-800/60">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{teacher.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            "{teacher.bio}"
          </div>
        </div>

        {/* Reviews Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-400" /> Student Reviews ({teacherReviews.length})
            </h3>
          </div>

          {teacherReviews.length === 0 ? (
            <div className="text-center p-4 glass-card rounded-2xl text-xs text-slate-400">
              No reviews yet for this student mentor. Be the first to exchange!
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {teacherReviews.map((rev) => {
                const reviewer = users.find((u) => u.id === rev.reviewerId);
                return (
                  <div key={rev.id} className="glass-card p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{reviewer?.name || 'Anonymous Student'}</span>
                      <div className="flex items-center text-amber-400 gap-0.5">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-300 leading-snug">{rev.comment}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Button Bar */}
      <div className="fixed bottom-14 left-0 right-0 p-4 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 z-40 max-w-md mx-auto">
        {!isSelf ? (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            rightIcon={<ArrowRight className="w-5 h-5" />}
            onClick={() => navigate('REQUEST_EXCHANGE', { skillId: skill.id, targetUserId: teacher.id })}
          >
            Request Skill Exchange
          </Button>
        ) : (
          <Button variant="outline" size="lg" fullWidth onClick={() => navigate('MY_SKILLS')}>
            Edit My Offered Skill
          </Button>
        )}
      </div>
    </div>
  );
};
