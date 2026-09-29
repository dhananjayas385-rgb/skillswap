import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { SkillChip } from '../components/common/SkillChip';
import {
  Star,
  GraduationCap,
  MapPin,
  Clock,
  Sparkles,
  MessageSquare,
  Send,
  Repeat,
  Zap,
} from 'lucide-react';
import { calculateSmartMatch } from '../utils/matching';

export const Screen10_StudentProfile: React.FC = () => {
  const {
    screenParams,
    users,
    skillOffers,
    skillWants,
    reviews,
    currentUser,
    exchanges,
    navigate,
  } = useApp();

  const userId = screenParams?.userId || users[1]?.id;
  const student = users.find((u) => u.id === userId) || users[1];

  const studentOffers = skillOffers.filter((o) => o.userId === student.id);
  const studentWants = skillWants.filter((w) => w.userId === student.id);
  const studentReviews = reviews.filter((r) => r.revieweeId === student.id);

  const matchResult = calculateSmartMatch(currentUser, student, skillOffers, skillWants);

  const isSelf = student.id === currentUser?.id;

  // Check if active exchange exists with this student
  const activeExchange = exchanges.find(
    (e) =>
      e.status === 'active' &&
      ((e.student1Id === currentUser?.id && e.student2Id === student.id) ||
        (e.student2Id === currentUser?.id && e.student1Id === student.id))
  );

  return (
    <div className="min-h-screen p-5 flex flex-col justify-between bg-slate-950 pb-24 animate-fade-in gap-6">
      <div className="flex flex-col gap-6">
        {/* Profile Card Header */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col items-center text-center gap-3 relative overflow-hidden">
          {/* Smart Match Tag if high score */}
          {matchResult.score > 60 && !isSelf && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse-glow">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{matchResult.label} ({matchResult.score}%)</span>
            </div>
          )}

          <img
            src={student.avatar}
            alt={student.name}
            className="w-24 h-24 rounded-3xl object-cover border-4 border-indigo-500/50 shadow-xl"
          />

          <div className="flex flex-col items-center">
            <h1 className="text-xl font-black text-slate-100">{student.name}</h1>
            <div className="flex items-center gap-1 text-xs text-indigo-300 font-semibold mt-0.5">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>{student.department} • {student.semester}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{student.college}</span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 w-full pt-3 border-t border-slate-800">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{student.rating.toFixed(1)}</span>
              </div>
              <span className="text-[10px] text-slate-400">Rating</span>
            </div>

            <div className="flex flex-col items-center border-x border-slate-800">
              <span className="font-bold text-indigo-300 text-sm">{student.completedExchanges}</span>
              <span className="text-[10px] text-slate-400">Exchanges</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-bold text-cyan-300 text-sm">{studentReviews.length}</span>
              <span className="text-[10px] text-slate-400">Reviews</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {student.bio && (
          <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col gap-1.5 text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider">About Student</span>
            <p className="text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
              "{student.bio}"
            </p>
          </div>
        )}

        {/* Skills Offered */}
        <div className="glass-card p-5 rounded-3xl border border-indigo-900/40 bg-indigo-950/20 flex flex-col gap-3">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Skills Offered To Teach
          </span>
          <div className="flex flex-wrap gap-2">
            {studentOffers.map((offer) => (
              <SkillChip
                key={offer.id}
                name={offer.skillName}
                level={offer.level}
                variant="teach"
                onClick={() => navigate('SKILL_DETAILS', { skillId: offer.id })}
              />
            ))}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="glass-card p-5 rounded-3xl border border-cyan-900/40 bg-cyan-950/20 flex flex-col gap-3">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Skills Wanting To Learn
          </span>
          <div className="flex flex-wrap gap-2">
            {studentWants.map((want) => (
              <SkillChip key={want.id} name={want.skillName} variant="want" />
            ))}
          </div>
        </div>

        {/* Availability info */}
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
          <span><strong>Availability:</strong> {student.availability}</span>
        </div>

        {/* Reviews List */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Reviews ({studentReviews.length})
          </h3>
          {studentReviews.length === 0 ? (
            <span className="text-xs text-slate-500 italic">No reviews yet</span>
          ) : (
            studentReviews.map((rev) => {
              const reviewer = users.find((u) => u.id === rev.reviewerId);
              return (
                <div key={rev.id} className="glass-card p-3.5 rounded-2xl border border-slate-800 text-xs flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{reviewer?.name || 'Peer'}</span>
                    <span className="text-amber-400 font-bold">{rev.rating} ★</span>
                  </div>
                  <p className="text-slate-300">{rev.comment}</p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Action CTA buttons */}
      <div className="fixed bottom-14 left-0 right-0 p-4 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 z-40 max-w-md mx-auto flex items-center gap-3">
        {!isSelf ? (
          <>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<Repeat className="w-5 h-5" />}
              onClick={() => navigate('REQUEST_EXCHANGE', { targetUserId: student.id })}
            >
              Request Exchange
            </Button>
            {activeExchange && (
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<Send className="w-4 h-4" />}
                onClick={() => navigate('CHAT', { exchangeId: activeExchange.id })}
              >
                Message
              </Button>
            )}
          </>
        ) : (
          <Button variant="outline" size="lg" fullWidth onClick={() => navigate('PROFILE_SETUP')}>
            Edit My Profile
          </Button>
        )}
      </div>
    </div>
  );
};
