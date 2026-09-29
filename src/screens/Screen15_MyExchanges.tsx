import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { Repeat, Clock, CheckCircle2, MessageSquare, ArrowRight, Zap } from 'lucide-react';

export const Screen15_MyExchanges: React.FC = () => {
  const {
    exchanges,
    currentUser,
    users,
    skillOffers,
    requests,
    navigate,
    screenParams,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'completed'>(
    screenParams?.tab || 'active'
  );

  const myExchanges = exchanges.filter(
    (e) => e.student1Id === currentUser?.id || e.student2Id === currentUser?.id
  );

  const activeList = myExchanges.filter((e) => e.status === 'active');
  const completedList = myExchanges.filter((e) => e.status === 'completed');
  const pendingRequestsList = requests.filter(
    (r) => (r.senderId === currentUser?.id || r.receiverId === currentUser?.id) && r.status === 'pending'
  );

  return (
    <div className="min-h-screen p-4 flex flex-col gap-5 bg-slate-950 pb-20 animate-fade-in">
      <div className="flex flex-col gap-1 pt-1">
        <h1 className="text-xl font-black text-slate-100">My Skill Exchanges</h1>
        <p className="text-xs text-slate-400">Track active learning progress, pending requests, and completed swaps</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'active' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'
          }`}
        >
          Active ({activeList.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'pending' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'
          }`}
        >
          Pending ({pendingRequestsList.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'completed' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'
          }`}
        >
          Completed ({completedList.length})
        </button>
      </div>

      {/* Active Exchanges Tab */}
      {activeTab === 'active' && (
        <div className="flex flex-col gap-4">
          {activeList.length === 0 ? (
            <EmptyState
              icon={<Repeat className="w-8 h-8" />}
              title="No Active Skill Exchanges"
              description="You don't have any active skill exchanges right now. Discover skills to get started!"
              actionText="Explore Skills"
              onAction={() => navigate('EXPLORE')}
            />
          ) : (
            activeList.map((ex) => {
              const isStudent1 = ex.student1Id === currentUser?.id;
              const partnerId = isStudent1 ? ex.student2Id : ex.student1Id;
              const partner = users.find((u) => u.id === partnerId);
              const learnedSkill = skillOffers.find(
                (s) => s.id === (isStudent1 ? ex.skill2Id : ex.skill1Id)
              );
              const taughtSkill = skillOffers.find(
                (s) => s.id === (isStudent1 ? ex.skill1Id : ex.skill2Id)
              );

              return (
                <div
                  key={ex.id}
                  onClick={() => navigate('MATCHED_EXCHANGE', { exchangeId: ex.id })}
                  className="glass-card glass-card-hover p-4 rounded-2xl border border-indigo-900/50 flex flex-col gap-3 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={partner?.avatar}
                        alt={partner?.name}
                        className="w-11 h-11 rounded-xl object-cover border border-indigo-500/40"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-100 text-sm">{partner?.name}</span>
                        <span className="text-xs text-slate-400">{partner?.department}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {ex.progress}% Complete
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-cyan-400 font-bold block uppercase">Learning</span>
                      <span className="font-semibold text-slate-200">{learnedSkill?.skillName}</span>
                    </div>
                    <div className="border-l border-slate-800 pl-2">
                      <span className="text-[10px] text-indigo-400 font-bold block uppercase">Teaching</span>
                      <span className="font-semibold text-slate-200">{taughtSkill?.skillName}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full"
                      style={{ width: `${ex.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<MessageSquare className="w-4 h-4" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('CHAT', { exchangeId: ex.id });
                      }}
                    >
                      Chat
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('MATCHED_EXCHANGE', { exchangeId: ex.id });
                      }}
                    >
                      Manage Exchange
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Pending Tab */}
      {activeTab === 'pending' && (
        <div className="flex flex-col gap-3">
          {pendingRequestsList.length === 0 ? (
            <EmptyState
              icon={<Clock className="w-8 h-8" />}
              title="No Pending Requests"
              description="You don't have any pending exchange proposals right now."
              actionText="Request a Skill"
              onAction={() => navigate('EXPLORE')}
            />
          ) : (
            <Button variant="primary" size="md" onClick={() => navigate('EXCHANGE_REQUESTS')}>
              Open Exchange Requests Manager
            </Button>
          )}
        </div>
      )}

      {/* Completed Tab */}
      {activeTab === 'completed' && (
        <div className="flex flex-col gap-4">
          {completedList.length === 0 ? (
            <EmptyState
              icon={<CheckCircle2 className="w-8 h-8 text-emerald-400" />}
              title="No Completed Exchanges Yet"
              description="Complete active skill exchange sessions to earn badges, stars, and reviews!"
            />
          ) : (
            completedList.map((ex) => {
              const isStudent1 = ex.student1Id === currentUser?.id;
              const partnerId = isStudent1 ? ex.student2Id : ex.student1Id;
              const partner = users.find((u) => u.id === partnerId);
              const learnedSkill = skillOffers.find(
                (s) => s.id === (isStudent1 ? ex.skill2Id : ex.skill1Id)
              );

              return (
                <div
                  key={ex.id}
                  className="glass-card p-4 rounded-2xl border border-emerald-900/40 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={partner?.avatar}
                        alt={partner?.name}
                        className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-100 text-sm">{partner?.name}</span>
                        <span className="text-xs text-slate-400">Completed Skill Exchange</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      100% Completed 🏆
                    </span>
                  </div>

                  <span className="text-xs text-slate-300">
                    Mastered Skill: <strong>{learnedSkill?.skillName}</strong>
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
