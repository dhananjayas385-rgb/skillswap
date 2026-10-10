import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { apiRequest } from '../utils/api';
import {
  Send,
  ArrowRightLeft,
  Sparkles,
  Calendar,
  MessageSquare,
  AlertCircle,
  Loader2,
} from 'lucide-react';

type SkillOption = {
  id: string;
  userId: string;
  skillName: string;
  level: string;
  description: string;
  category?: string;
};

const normalizeSkill = (item: any, userId: string): SkillOption | null => {
  const skill = item?.skills;

  if (!skill?.id || !skill?.name) {
    return null;
  }

  return {
    id: String(skill.id),
    userId,
    skillName: String(skill.name),
    level: String(item.proficiency || 'Beginner'),
    description: String(skill.description || ''),
    category: skill.category || '',
  };
};

export const Screen11_RequestExchange: React.FC = () => {
  const {
    screenParams,
    users,
    currentUser,
    sendExchangeRequest,
    navigate,
    showToast,
  } = useApp();

  const targetUserId = String(
    screenParams?.targetUserId ||
      users.find((user) => user.id !== currentUser?.id)?.id ||
      ''
  );

  const targetUser = users.find(
    (user) => String(user.id) === targetUserId
  );

  const [targetOffers, setTargetOffers] = useState<SkillOption[]>([]);
  const [myOffers, setMyOffers] = useState<SkillOption[]>([]);

  const [loadingSkills, setLoadingSkills] = useState(true);
  const [skillsError, setSkillsError] = useState('');

  const [selectedRequestedId, setSelectedRequestedId] = useState('');
  const [selectedOfferedId, setSelectedOfferedId] = useState('');

  const [message, setMessage] = useState('');
  const [preferredSchedule, setPreferredSchedule] = useState(
    'Saturdays at 4:00 PM'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch real teaching skills for both students.
  useEffect(() => {
    let cancelled = false;

    const loadSkills = async () => {
      if (!currentUser?.id || !targetUserId) {
        setTargetOffers([]);
        setMyOffers([]);
        setLoadingSkills(false);
        return;
      }

      if (String(currentUser.id) === targetUserId) {
        setTargetOffers([]);
        setMyOffers([]);
        setSkillsError('You cannot send an exchange request to yourself.');
        setLoadingSkills(false);
        return;
      }

      setLoadingSkills(true);
      setSkillsError('');

      try {
        const [targetResponse, myResponse] = await Promise.all([
          apiRequest(
            `/user-skills/user/${encodeURIComponent(targetUserId)}`
          ),
          apiRequest('/user-skills/'),
        ]);

        if (cancelled) return;

        const targetSkills: SkillOption[] = (
          targetResponse.teaching_skills || []
        )
          .map((item: any) => normalizeSkill(item, targetUserId))
          .filter((skill: SkillOption | null): skill is SkillOption =>
            Boolean(skill)
          );

        const ownSkills: SkillOption[] = (myResponse.skills || [])
          .filter((item: any) => item.skill_type === 'teach')
          .map((item: any) =>
            normalizeSkill(item, String(currentUser.id))
          )
          .filter((skill: SkillOption | null): skill is SkillOption =>
            Boolean(skill)
          );

        setTargetOffers(targetSkills);
        setMyOffers(ownSkills);

        setSelectedRequestedId((previous) =>
          targetSkills.some((skill) => skill.id === previous)
            ? previous
            : targetSkills.find(
                (skill) =>
                  String(skill.id) === String(screenParams?.skillId)
              )?.id || targetSkills[0]?.id || ''
        );

        setSelectedOfferedId((previous) =>
          ownSkills.some((skill) => skill.id === previous)
            ? previous
            : ownSkills[0]?.id || ''
        );
      } catch (error: any) {
        if (!cancelled) {
          console.error('Could not load exchange skills:', error);

          setTargetOffers([]);
          setMyOffers([]);
          setSkillsError(
            error?.message ||
              'Could not load skills from the server. Please try again.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingSkills(false);
        }
      }
    };

    void loadSkills();

    return () => {
      cancelled = true;
    };
  }, [
    currentUser?.id,
    targetUserId,
    screenParams?.skillId,
  ]);

  // Set a default personal message for the selected student.
  useEffect(() => {
    if (!targetUser) return;

    setMessage(
      `Hey ${targetUser.name?.split(' ')[0] || 'there'}! I saw your profile and would love to exchange skills with you.`
    );
  }, [targetUser?.id]);

  const selectedRequestedSkill = useMemo(
    () => targetOffers.find((skill) => skill.id === selectedRequestedId),
    [targetOffers, selectedRequestedId]
  );

  const selectedOfferedSkill = useMemo(
    () => myOffers.find((skill) => skill.id === selectedOfferedId),
    [myOffers, selectedOfferedId]
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!targetUser || !currentUser) {
      showToast('Student information could not be found.', 'error');
      return;
    }

    if (!selectedRequestedSkill) {
      showToast(
        'Please select an available teaching skill from this student.',
        'error'
      );
      return;
    }

    if (!selectedOfferedSkill) {
      showToast(
        'Please add a teaching skill to your profile first.',
        'error'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await sendExchangeRequest({
        receiverId: targetUser.id,
        skillRequestedId: selectedRequestedSkill.id,
        skillOfferedId: selectedOfferedSkill.id,
        message: message.trim(),
        preferredSchedule: preferredSchedule.trim() || 'Flexible',
      });
    } catch (error: any) {
      console.error('Could not send exchange request:', error);
      showToast(
        error?.message || 'Could not send the exchange request.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!targetUser) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
        <div className="glass-card rounded-3xl border border-rose-900/40 p-6 text-center">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />

          <h2 className="text-lg font-bold text-slate-100">
            Student Not Found
          </h2>

          <p className="text-xs text-slate-400 mt-2">
            We could not find the student for this exchange request.
          </p>

          <Button
            variant="secondary"
            size="sm"
            className="mt-5"
            onClick={() => navigate('EXPLORE')}
          >
            Back to Explore
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 flex flex-col justify-between bg-slate-950 pb-20 animate-fade-in gap-5">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-col gap-1 text-center pt-2">
          <h1 className="text-xl font-black text-slate-100 flex items-center justify-center gap-2">
            Skill Exchange Request
            <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
          </h1>

          <p className="text-xs text-slate-400">
            Propose a reciprocal skill exchange with {targetUser.name}
          </p>
        </div>

        {/* Target student */}
        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
          <img
            src={targetUser.avatar}
            alt={targetUser.name}
            className="w-12 h-12 rounded-xl object-cover border border-indigo-500/40"
          />

          <div className="flex flex-col flex-1">
            <span className="text-xs text-slate-400">
              Requesting Swap With
            </span>

            <span className="font-bold text-slate-100 text-sm">
              {targetUser.name}
            </span>

            <span className="text-[11px] text-indigo-300">
              {targetUser.department}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Learn from the other student */}
          <div className="glass-card p-5 rounded-3xl border border-cyan-900/50 bg-cyan-950/20 flex flex-col gap-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              You Want To Learn From {targetUser.name.split(' ')[0]}
            </span>

            {loadingSkills ? (
              <div className="flex items-center gap-2 p-4 text-cyan-300 text-xs">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading teaching skills from Supabase...
              </div>
            ) : skillsError ? (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-rose-300">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs font-semibold">
                    Could not load skills
                  </span>
                </div>

                <p className="text-[11px] text-rose-200/80">
                  {skillsError}
                </p>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            ) : targetOffers.length === 0 ? (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-amber-300">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs font-semibold">
                    No teaching skills found
                  </span>
                </div>

                <p className="text-[11px] text-amber-200/70">
                  {targetUser.name} has no teaching skills saved in the
                  database yet.
                </p>

                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() =>
                    navigate('STUDENT_PROFILE', {
                      userId: targetUser.id,
                    })
                  }
                >
                  View {targetUser.name}'s Profile
                </Button>
              </div>
            ) : (
              <>
                <select
                  className="w-full bg-slate-900 border border-cyan-700/70 text-slate-100 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  value={selectedRequestedId}
                  onChange={(event) =>
                    setSelectedRequestedId(event.target.value)
                  }
                  required
                >
                  <option value="">Select a skill to learn</option>

                  {targetOffers.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.skillName} ({skill.level})
                    </option>
                  ))}
                </select>

                {selectedRequestedSkill && (
                  <div className="p-3 rounded-xl bg-slate-900/70 border border-cyan-900/50">
                    <p className="text-[10px] text-cyan-400 font-bold uppercase mb-1">
                      Selected Skill
                    </p>

                    <p className="text-sm font-bold text-slate-100">
                      {selectedRequestedSkill.skillName}
                    </p>

                    {selectedRequestedSkill.description && (
                      <p className="text-xs text-slate-300 mt-1">
                        {selectedRequestedSkill.description}
                      </p>
                    )}

                    <p className="text-[10px] text-slate-500 mt-2">
                      {selectedRequestedSkill.level}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Your teaching skills */}
          <div className="glass-card p-5 rounded-3xl border border-indigo-900/50 bg-indigo-950/20 flex flex-col gap-3">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              You Offer To Teach In Return
            </span>

            {loadingSkills ? (
              <div className="flex items-center gap-2 p-3 text-indigo-300 text-xs">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading your teaching skills...
              </div>
            ) : myOffers.length === 0 ? (
              <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs flex flex-col gap-2">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  No teaching skills saved in your account.
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => navigate('MY_SKILLS')}
                >
                  Add Skill to My Profile
                </Button>
              </div>
            ) : (
              <select
                className="w-full bg-slate-900 border border-indigo-700/70 text-slate-100 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                value={selectedOfferedId}
                onChange={(event) => setSelectedOfferedId(event.target.value)}
                required
              >
                <option value="">Select a skill to teach</option>

                {myOffers.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.skillName} ({skill.level})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Personal note */}
          <div className="glass-card p-4 rounded-3xl border border-slate-800 flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              Personal Note
            </label>

            <textarea
              rows={3}
              maxLength={500}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
              placeholder="Introduce yourself and propose learning goals..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />

            <div className="text-right text-[10px] text-slate-600">
              {message.length}/500
            </div>
          </div>

          {/* Schedule */}
          <Input
            label="Preferred Schedule"
            leftIcon={<Calendar className="w-4 h-4 text-cyan-400" />}
            placeholder="e.g. Saturdays at 4:00 PM"
            value={preferredSchedule}
            onChange={(event) => setPreferredSchedule(event.target.value)}
          />

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            disabled={
              loadingSkills ||
              isSubmitting ||
              Boolean(skillsError) ||
              !selectedRequestedSkill ||
              !selectedOfferedSkill
            }
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