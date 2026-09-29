import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { SkillChip } from '../components/common/SkillChip';
import { Input } from '../components/common/Input';
import { Send, ArrowRightLeft, Sparkles, Calendar, MessageSquare, AlertCircle } from 'lucide-react';

export const Screen11_RequestExchange: React.FC = () => {
  const {
    screenParams,
    users,
    skillOffers,
    currentUser,
    sendExchangeRequest,
    navigate,
    showToast,
  } = useApp();

  const targetUserId = screenParams?.targetUserId || users[1]?.id;
  const targetUser = users.find((u) => u.id === targetUserId) || users[1];

  const targetOffers = skillOffers.filter((o) => o.userId === targetUser.id);
  const myOffers = skillOffers.filter((o) => o.userId === currentUser?.id);

  const initialRequestedSkillId =
    screenParams?.skillId || targetOffers[0]?.id || '';

  const [selectedRequestedId, setSelectedRequestedId] = useState(initialRequestedSkillId);
  const [selectedOfferedId, setSelectedOfferedId] = useState(myOffers[0]?.id || '');
  const [message, setMessage] = useState(
    `Hey ${targetUser.name}! I saw your profile and would love to exchange skills with you.`
  );
  const [preferredSchedule, setPreferredSchedule] = useState('Saturdays at 4:00 PM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedRequestedSkill = skillOffers.find((s) => s.id === selectedRequestedId);
  const selectedOfferedSkill = skillOffers.find((s) => s.id === selectedOfferedId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRequestedId) {
      showToast('Please select a skill you want to learn', 'error');
      return;
    }
    if (!selectedOfferedId) {
      showToast('Please add or select a skill you can teach in exchange', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      sendExchangeRequest({
        receiverId: targetUser.id,
        skillRequestedId: selectedRequestedId,
        skillOfferedId: selectedOfferedId,
        message,
        preferredSchedule,
      });
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen p-5 flex flex-col justify-between bg-slate-950 pb-20 animate-fade-in gap-5">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1 text-center pt-2">
          <h1 className="text-xl font-black text-slate-100 flex items-center justify-center gap-2">
            Skill Exchange Request <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
          </h1>
          <p className="text-xs text-slate-400">Propose a reciprocal skill exchange with {targetUser.name}</p>
        </div>

        {/* Receiver Profile Banner */}
        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
          <img
            src={targetUser.avatar}
            alt={targetUser.name}
            className="w-12 h-12 rounded-xl object-cover border border-indigo-500/40"
          />
          <div className="flex flex-col flex-1">
            <span className="text-xs text-slate-400">Requesting Swap With</span>
            <span className="font-bold text-slate-100 text-sm">{targetUser.name}</span>
            <span className="text-[11px] text-indigo-300">{targetUser.department}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Section 1: You want to learn */}
          <div className="glass-card p-5 rounded-3xl border border-cyan-900/50 bg-cyan-950/20 flex flex-col gap-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> You Want To Learn From {targetUser.name.split(' ')[0]}
            </span>

            <select
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              value={selectedRequestedId}
              onChange={(e) => setSelectedRequestedId(e.target.value)}
            >
              {targetOffers.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.skillName} ({o.level} Level)
                </option>
              ))}
            </select>

            {selectedRequestedSkill && (
              <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                "{selectedRequestedSkill.description}"
              </p>
            )}
          </div>

          {/* Section 2: You offer to teach */}
          <div className="glass-card p-5 rounded-3xl border border-indigo-900/50 bg-indigo-950/20 flex flex-col gap-3">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> You Offer To Teach In Return
            </span>

            {myOffers.length === 0 ? (
              <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs flex flex-col gap-2">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertCircle className="w-4 h-4" /> No skills added to your taught list!
                </div>
                <Button variant="secondary" size="sm" onClick={() => navigate('MY_SKILLS')}>
                  Add Skill to My Profile
                </Button>
              </div>
            ) : (
              <select
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                value={selectedOfferedId}
                onChange={(e) => setSelectedOfferedId(e.target.value)}
              >
                {myOffers.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.skillName} ({o.level} Level)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Personal Message */}
          <div className="glass-card p-4 rounded-3xl border border-slate-800 flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> Personal Note
            </label>
            <textarea
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              placeholder="Introduce yourself and propose learning goals..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Schedule */}
          <Input
            label="Preferred Schedule"
            leftIcon={<Calendar className="w-4 h-4 text-cyan-400" />}
            placeholder="e.g. Saturdays at 4:00 PM"
            value={preferredSchedule}
            onChange={(e) => setPreferredSchedule(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            rightIcon={<Send className="w-4 h-4" />}
            className="mt-2"
          >
            Send Exchange Request
          </Button>
        </form>
      </div>
    </div>
  );
};
