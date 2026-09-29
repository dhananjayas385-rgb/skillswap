import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { TrendingUp, CheckCircle2, Calendar, Sparkles, Award } from 'lucide-react';

export const Screen16_LearningProgress: React.FC = () => {
  const {
    screenParams,
    exchanges,
    currentUser,
    users,
    skillOffers,
    sessions,
    markSessionCompleted,
    navigate,
  } = useApp();

  const exchangeId = screenParams?.exchangeId || exchanges[0]?.id;
  const exchange = exchanges.find((e) => e.id === exchangeId) || exchanges[0];

  if (!exchange) {
    return <div className="p-8 text-center text-slate-400">No active learning progress</div>;
  }

  const isStudent1 = exchange.student1Id === currentUser?.id;
  const partnerId = isStudent1 ? exchange.student2Id : exchange.student1Id;
  const partner = users.find((u) => u.id === partnerId);

  const learnedSkillId = isStudent1 ? exchange.skill2Id : exchange.skill1Id;
  const learnedSkill = skillOffers.find((s) => s.id === learnedSkillId);

  const exchangeSessions = sessions.filter((s) => s.exchangeId === exchange.id);

  return (
    <div className="min-h-screen p-5 flex flex-col justify-between bg-slate-950 pb-20 animate-fade-in gap-5">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1 text-center pt-1">
          <h1 className="text-xl font-black text-slate-100 flex items-center justify-center gap-2">
            Learning Milestones <TrendingUp className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs text-slate-400">Track your skill acquisition & session milestones</p>
        </div>

        {/* Progress Card Dial */}
        <div className="glass-card p-6 rounded-3xl border border-indigo-900/50 flex flex-col items-center text-center gap-4 relative overflow-hidden">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/60 uppercase tracking-wider">
            {learnedSkill?.category}
          </span>

          <h2 className="text-2xl font-black text-slate-100">{learnedSkill?.skillName}</h2>

          {/* Big Progress Circle */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-slate-800 stroke-current"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-indigo-500 stroke-current transition-all duration-1000"
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * exchange.progress) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black text-slate-100">{exchange.progress}%</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Completed</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Mentor: <strong>{partner?.name}</strong></span>
          </div>
        </div>

        {/* Milestones List */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Session Milestones ({exchange.completedSessions}/{exchange.totalSessions})
          </h3>

          <div className="flex flex-col gap-2.5">
            {exchangeSessions.map((sess, idx) => (
              <div
                key={sess.id}
                onClick={() => markSessionCompleted(sess.id)}
                className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                  sess.isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100'
                    : 'glass-card border-slate-800 text-slate-200 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    sess.isCompleted
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                      : 'border-slate-600 bg-slate-900 text-slate-400 text-xs'
                  }`}
                >
                  {sess.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <div className="flex flex-col flex-1">
                  <span className={`text-xs font-bold ${sess.isCompleted ? 'line-through opacity-80' : ''}`}>
                    {sess.title}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">{sess.date} at {sess.time}</span>
                  {sess.notes && (
                    <p className="text-[11px] text-slate-300 mt-1 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                      "{sess.notes}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={() => navigate('MATCHED_EXCHANGE', { exchangeId: exchange.id })}
      >
        Return to Active Exchange Details
      </Button>
    </div>
  );
};
