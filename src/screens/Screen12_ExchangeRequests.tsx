import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import {
  Inbox,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  User,
  ArrowRightLeft,
  ChevronRight,
} from 'lucide-react';

export const Screen12_ExchangeRequests: React.FC = () => {
  const {
    requests,
    currentUser,
    users,
    skillOffers,
    acceptExchangeRequest,
    rejectExchangeRequest,
    cancelExchangeRequest,
    screenParams,
    navigate,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'received' | 'sent'>(
    screenParams?.tab || 'received'
  );

  const receivedRequests = requests.filter((r) => r.receiverId === currentUser?.id);
  const sentRequests = requests.filter((r) => r.senderId === currentUser?.id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-400" /> Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-950 text-rose-300 border border-rose-700/60 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-400" /> Rejected
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-700/60 flex items-center gap-1 animate-pulse">
            <Clock className="w-3 h-3 text-amber-400" /> Pending Approval
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen p-4 flex flex-col gap-5 bg-slate-950 pb-20 animate-fade-in">
      <div className="flex flex-col gap-1 pt-1">
        <h1 className="text-xl font-black text-slate-100">Exchange Requests</h1>
        <p className="text-xs text-slate-400">Manage incoming requests & track your sent proposals</p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'received'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Inbox className="w-4 h-4" /> Received ({receivedRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'sent'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Send className="w-4 h-4" /> Sent ({sentRequests.length})
        </button>
      </div>

      {/* Received Tab */}
      {activeTab === 'received' && (
        <div className="flex flex-col gap-4">
          {receivedRequests.length === 0 ? (
            <EmptyState
              icon={<Inbox className="w-8 h-8" />}
              title="No Received Requests"
              description="You haven't received any skill exchange requests from other students yet."
              actionText="Explore Student Skills"
              onAction={() => navigate('EXPLORE')}
            />
          ) : (
            receivedRequests.map((req) => {
              const sender = users.find((u) => u.id === req.senderId);
              const skillOffered = skillOffers.find((s) => s.id === req.skillOfferedId);
              const skillRequested = skillOffers.find((s) => s.id === req.skillRequestedId);

              return (
                <div
                  key={req.id}
                  className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between">
                    <div
                      onClick={() => navigate('STUDENT_PROFILE', { userId: sender?.id })}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <img
                        src={sender?.avatar}
                        alt={sender?.name}
                        className="w-11 h-11 rounded-xl object-cover border border-indigo-500/40"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-100 text-sm group-hover:text-indigo-300">
                          {sender?.name}
                        </span>
                        <span className="text-xs text-slate-400">{sender?.department}</span>
                      </div>
                    </div>
                    {getStatusBadge(req.status)}
                  </div>

                  {/* Skills Exchange Pair Card */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col gap-2 text-xs">
                    <div className="flex items-center justify-between text-indigo-300 font-semibold">
                      <span>Teaches: {skillOffered?.skillName || 'Skill'}</span>
                      <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-cyan-300">Wants: {skillRequested?.skillName || 'Skill'}</span>
                    </div>
                    {req.message && (
                      <p className="text-slate-300 italic pt-1 border-t border-slate-800 text-[11px]">
                        "{req.message}"
                      </p>
                    )}
                  </div>

                  {/* Action Buttons for Pending Requests */}
                  {req.status === 'pending' && (
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        leftIcon={<CheckCircle className="w-4 h-4" />}
                        onClick={() => acceptExchangeRequest(req.id)}
                      >
                        Accept Exchange
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        fullWidth
                        leftIcon={<XCircle className="w-4 h-4" />}
                        onClick={() => rejectExchangeRequest(req.id)}
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Sent Tab */}
      {activeTab === 'sent' && (
        <div className="flex flex-col gap-4">
          {sentRequests.length === 0 ? (
            <EmptyState
              icon={<Send className="w-8 h-8" />}
              title="No Sent Requests"
              description="You haven't sent any skill exchange requests yet. Find a skill and request a swap!"
              actionText="Discover Skills"
              onAction={() => navigate('EXPLORE')}
            />
          ) : (
            sentRequests.map((req) => {
              const receiver = users.find((u) => u.id === req.receiverId);
              const skillOffered = skillOffers.find((s) => s.id === req.skillOfferedId);
              const skillRequested = skillOffers.find((s) => s.id === req.skillRequestedId);

              return (
                <div
                  key={req.id}
                  className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between">
                    <div
                      onClick={() => navigate('STUDENT_PROFILE', { userId: receiver?.id })}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <img
                        src={receiver?.avatar}
                        alt={receiver?.name}
                        className="w-11 h-11 rounded-xl object-cover border border-cyan-500/40"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-100 text-sm group-hover:text-cyan-300">
                          {receiver?.name}
                        </span>
                        <span className="text-xs text-slate-400">{receiver?.department}</span>
                      </div>
                    </div>
                    {getStatusBadge(req.status)}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col gap-2 text-xs">
                    <div className="flex items-center justify-between text-indigo-300 font-semibold">
                      <span>You Offer: {skillOffered?.skillName || 'Skill'}</span>
                      <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-cyan-300">You Want: {skillRequested?.skillName || 'Skill'}</span>
                    </div>
                    {req.message && (
                      <p className="text-slate-300 italic pt-1 border-t border-slate-800 text-[11px]">
                        "{req.message}"
                      </p>
                    )}
                  </div>

                  {req.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cancelExchangeRequest(req.id)}
                    >
                      Cancel Request
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
