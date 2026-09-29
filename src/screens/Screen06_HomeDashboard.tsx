import React from 'react';
import { useApp } from '../context/AppContext';
import { StudentCard } from '../components/common/StudentCard';
import { Button } from '../components/common/Button';
import { calculateSmartMatch } from '../utils/matching';
import {
  Search,
  PlusCircle,
  Repeat,
  Inbox,
  Sparkles,
  Zap,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

export const Screen06_HomeDashboard: React.FC = () => {
  const {
    currentUser,
    users,
    skillOffers,
    skillWants,
    exchanges,
    sessions,
    requests,
    notifications,
    navigate,
  } = useApp();

  // Find recommended match students
  const otherUsers = users.filter((u) => u.id !== currentUser?.id);
  const matchedStudents = otherUsers
    .map((student) => ({
      student,
      matchResult: calculateSmartMatch(currentUser, student, skillOffers, skillWants),
    }))
    .sort((a, b) => b.matchResult.score - a.matchResult.score);

  // Active exchanges for current user
  const myActiveExchanges = exchanges.filter(
    (e) =>
      (e.student1Id === currentUser?.id || e.student2Id === currentUser?.id) &&
      e.status === 'active'
  );

  // Upcoming sessions for current user's active exchanges
  const myActiveExchangeIds = myActiveExchanges.map((e) => e.id);
  const upcomingSessionsList = sessions
    .filter((s) => myActiveExchangeIds.includes(s.exchangeId) && !s.isCompleted)
    .slice(0, 3);

  // Pending requests for badge counts
  const pendingReceivedCount = requests.filter(
    (r) => r.receiverId === currentUser?.id && r.status === 'pending'
  ).length;

  return (
    <div className="min-h-screen p-4 flex flex-col gap-6 bg-slate-950 pb-20 animate-fade-in">
      {/* Personalized Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            onClick={() => navigate('PROFILE')}
            className="w-12 h-12 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-md cursor-pointer hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-medium">Welcome back,</span>
            <h1 className="text-lg font-black text-slate-100 flex items-center gap-1.5 leading-tight">
              {currentUser?.name} <Sparkles className="w-4 h-4 text-amber-400" />
            </h1>
          </div>
        </div>

        {/* College Tag */}
        <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold">{currentUser?.department}</span>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => navigate('EXPLORE')}
          className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 hover:bg-indigo-900/40 transition-colors group"
        >
          <div className="p-2.5 rounded-xl bg-indigo-600/30 text-indigo-400 group-hover:scale-110 transition-transform">
            <Search className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-200">Find Skill</span>
        </button>

        <button
          onClick={() => navigate('MY_SKILLS')}
          className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 hover:bg-cyan-900/40 transition-colors group"
        >
          <div className="p-2.5 rounded-xl bg-cyan-600/30 text-cyan-400 group-hover:scale-110 transition-transform">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-200">Offer Skill</span>
        </button>

        <button
          onClick={() => navigate('MY_EXCHANGES')}
          className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-purple-950/40 border border-purple-500/30 hover:bg-purple-900/40 transition-colors group"
        >
          <div className="p-2.5 rounded-xl bg-purple-600/30 text-purple-400 group-hover:scale-110 transition-transform">
            <Repeat className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-200">Exchanges</span>
        </button>

        <button
          onClick={() => navigate('EXCHANGE_REQUESTS')}
          className="relative flex flex-col items-center gap-2 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 hover:bg-amber-900/40 transition-colors group"
        >
          <div className="p-2.5 rounded-xl bg-amber-600/30 text-amber-400 group-hover:scale-110 transition-transform">
            <Inbox className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-200">Requests</span>
          {pendingReceivedCount > 0 && (
            <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
              {pendingReceivedCount}
            </span>
          )}
        </button>
      </div>

      {/* Currently Learning / Active Exchanges Section */}
      {myActiveExchanges.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> My Learning Progress
            </h2>
            <button
              onClick={() => navigate('MY_EXCHANGES', { tab: 'active' })}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {myActiveExchanges.map((ex) => {
              const isStudent1 = ex.student1Id === currentUser?.id;
              const partnerId = isStudent1 ? ex.student2Id : ex.student1Id;
              const partner = users.find((u) => u.id === partnerId);
              const learnedSkillId = isStudent1 ? ex.skill2Id : ex.skill1Id;
              const taughtSkillId = isStudent1 ? ex.skill1Id : ex.skill2Id;
              const learnedSkill = skillOffers.find((s) => s.id === learnedSkillId);
              const taughtSkill = skillOffers.find((s) => s.id === taughtSkillId);

              return (
                <div
                  key={ex.id}
                  onClick={() => navigate('MATCHED_EXCHANGE', { exchangeId: ex.id })}
                  className="glass-card p-4 rounded-2xl border border-indigo-900/50 flex flex-col gap-3 cursor-pointer hover:border-indigo-500/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={partner?.avatar}
                        alt={partner?.name}
                        className="w-10 h-10 rounded-full object-cover border border-indigo-400"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-100">
                          Learning {learnedSkill?.skillName || 'New Skill'}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Exchanging with {partner?.name}
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {ex.progress}% Complete
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${ex.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>{ex.completedSessions} of {ex.totalSessions} sessions done</span>
                    <span className="text-indigo-400 font-semibold flex items-center gap-1">
                      Teaching: {taughtSkill?.skillName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Scheduled Sessions */}
      {upcomingSessionsList.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-cyan-400" /> Upcoming Sessions
          </h2>
          <div className="flex flex-col gap-2">
            {upcomingSessionsList.map((sess) => (
              <div
                key={sess.id}
                className="glass-card p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-100">{sess.title}</span>
                    <span className="text-[11px] text-slate-400">{sess.date} at {sess.time}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('MATCHED_EXCHANGE', { exchangeId: sess.exchangeId })}
                >
                  Join
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Match Recommended Exchanges Carousel/Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-base font-black text-slate-100 flex items-center gap-1.5">
              Recommended Matches <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
            </h2>
            <p className="text-[11px] text-slate-400">Based on your taught skills vs desired learning goals</p>
          </div>
          <button
            onClick={() => navigate('EXPLORE')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Explore All
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {matchedStudents.slice(0, 3).map(({ student, matchResult }) => (
            <StudentCard
              key={student.id}
              student={student}
              matchResult={matchResult}
              onSelect={() => navigate('STUDENT_PROFILE', { userId: student.id })}
              onRequestExchange={() => navigate('REQUEST_EXCHANGE', { targetUserId: student.id })}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity Notification Snippet */}
      {notifications.length > 0 && (
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Recent Activity
          </span>
          <div
            onClick={() => navigate('NOTIFICATIONS')}
            className="glass-card p-3 rounded-xl border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-slate-700"
          >
            <div className="p-2 rounded-full bg-indigo-950 text-indigo-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex flex-col flex-1 truncate">
              <span className="text-xs font-semibold text-slate-200 truncate">
                {notifications[0].title}
              </span>
              <span className="text-[11px] text-slate-400 truncate">
                {notifications[0].message}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
