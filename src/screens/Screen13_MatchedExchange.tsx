import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import {
  MessageSquare,
  CheckCircle2,
  Calendar,
  Clock,
  Award,
  ArrowRightLeft,
  GraduationCap,
  Sparkles,
  Zap,
} from 'lucide-react';

export const Screen13_MatchedExchange: React.FC = () => {
  const {
    screenParams,
    exchanges,
    currentUser,
    users,
    skillOffers,
    sessions,
    markSessionCompleted,
    endExchange,
    navigate,
  } = useApp();

  const exchangeId = screenParams?.exchangeId || exchanges[0]?.id;
  const exchange = exchanges.find((e) => e.id === exchangeId) || exchanges[0];

  if (!exchange) {
    return <div className="p-8 text-center text-slate-400">Exchange not found</div>;
  }

  const isStudent1 = exchange.student1Id === currentUser?.id;
  const partnerId = isStudent1 ? exchange.student2Id : exchange.student1Id;
  const partner = users.find((u) => u.id === partnerId);

  const learnedSkillId = isStudent1 ? exchange.skill2Id : exchange.skill1Id;
  const taughtSkillId = isStudent1 ? exchange.skill1Id : exchange.skill2Id;

  const learnedSkill = skillOffers.find((s) => s.id === learnedSkillId);
  const taughtSkill = skillOffers.find((s) => s.id === taughtSkillId);

  const exchangeSessions = sessions.filter((s) => s.exchangeId === exchange.id);

  return (
    <div className="min-h-screen p-5 flex flex-col justify-between bg-slate-950 pb-24 animate-fade-in gap-5">
      <div className="flex flex-col gap-5">
        {/* Partner Banner Card */}
        <div className="glass-card p-5 rounded-3xl border border-indigo-900/40 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Active Peer Exchange
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-800">
              {exchange.progress}% Done
            </span>
          </div>

          {/* Partner Profile */}
          <div
            onClick={() => navigate('STUDENT_PROFILE', { userId: partner?.id })}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <img
              src={partner?.avatar}
              alt={partner?.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-md group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col flex-1">
              <span className="font-bold text-slate-100 text-base group-hover:text-indigo-300">
                {partner?.name}
              </span>
              <span className="text-xs text-slate-400">{partner?.department}</span>
              <span className="text-[11px] text-slate-500">{partner?.college}</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<MessageSquare className="w-4 h-4" />}
              onClick={(e) => {
                e.stopPropagation();
                navigate('CHAT', { exchangeId: exchange.id });
              }}
            >
              Chat
            </Button>
          </div>

          {/* Skills Pair Box */}
          <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-cyan-400 uppercase">Skill You Learn</span>
              <span className="font-bold text-slate-100">{learnedSkill?.skillName || 'Skill'}</span>
              <span className="text-[10px] text-slate-400">{learnedSkill?.level} Level</span>
            </div>
            <div className="flex flex-col gap-0.5 border-l border-slate-800 pl-2">
              <span className="text-[10px] font-bold text-indigo-400 uppercase">Skill You Teach</span>
              <span className="font-bold text-slate-100">{taughtSkill?.skillName || 'Skill'}</span>
              <span className="text-[10px] text-slate-400">{taughtSkill?.level} Level</span>
            </div>
          </div>

          {/* Overall Progress Meter */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Sessions Completed</span>
              <span className="font-bold text-indigo-400">{exchange.completedSessions} / {exchange.totalSessions}</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${exchange.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Learning Milestones & Session Checklist */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-cyan-400" /> Exchange Sessions Checklist
            </h3>
            <button
              onClick={() => navigate('LEARNING_PROGRESS', { exchangeId: exchange.id })}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Full Milestones
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {exchangeSessions.map((sess) => (
              <div
                key={sess.id}
                onClick={() => markSessionCompleted(sess.id)}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  sess.isCompleted
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
                    : 'glass-card border-slate-800 text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      sess.isCompleted
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-slate-600 bg-slate-900'
                    }`}
                  >
                    {sess.isCompleted && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold ${sess.isCompleted ? 'line-through opacity-80' : ''}`}>
                      {sess.title}
                    </span>
                    <span className="text-[11px] text-slate-400">{sess.date} at {sess.time}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400">
                  {sess.isCompleted ? 'Done' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="fixed bottom-14 left-0 right-0 p-4 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 z-40 max-w-md mx-auto flex items-center gap-3">
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          leftIcon={<MessageSquare className="w-5 h-5" />}
          onClick={() => navigate('CHAT', { exchangeId: exchange.id })}
        >
          Chat with Partner
        </Button>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          leftIcon={<Award className="w-5 h-5" />}
          onClick={() => endExchange(exchange.id)}
        >
          Complete & Rate
        </Button>
      </div>
    </div>
  );
};
