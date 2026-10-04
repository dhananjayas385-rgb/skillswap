import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import {
  Send,
  ArrowRightLeft,
  Sparkles,
  Calendar,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

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

  /*
   * ---------------------------------------------------------
   * TARGET USER
   * ---------------------------------------------------------
   */
  const targetUserId =
    screenParams?.targetUserId ||
    users.find((u) => u.id !== currentUser?.id)?.id ||
    '';

  const targetUser =
    users.find((u) => u.id === targetUserId) ||
    users.find((u) => u.id !== currentUser?.id);

  /*
   * ---------------------------------------------------------
   * TARGET USER'S SKILLS
   *
   * Normally skillOffers use userId.
   *
   * We also keep the screenParams.skillId as a valid fallback
   * because the request screen can be opened directly from a
   * particular skill card.
   * ---------------------------------------------------------
   */

  const targetOffers = useMemo(() => {
    if (!targetUser) return [];

    const directMatches = skillOffers.filter(
      (offer) => String(offer.userId) === String(targetUser.id)
    );

    /*
     * If normal userId matching works, use it.
     */
    if (directMatches.length > 0) {
      return directMatches;
    }

    /*
     * If the request was opened from a specific skill card,
     * preserve that exact skill.
     */
    if (screenParams?.skillId) {
      const requestedSkill = skillOffers.find(
        (offer) =>
          String(offer.id) === String(screenParams.skillId)
      );

      if (requestedSkill) {
        return [requestedSkill];
      }
    }

    /*
     * Some older locally-created skill records can contain
     * a userId that no longer matches the real Supabase user.
     *
     * Try matching common identity fields if available.
     */
    const targetName = String(
      targetUser.name ||
        targetUser.name ||
        ''
    )
      .trim()
      .toLowerCase();

    const fallbackMatches = skillOffers.filter((offer: any) => {
      const ownerName = String(
        offer.userName ||
          offer.fullName ||
          offer.ownerName ||
          ''
      )
        .trim()
        .toLowerCase();

      return (
        ownerName &&
        targetName &&
        ownerName === targetName
      );
    });

    return fallbackMatches;
  }, [
    skillOffers,
    targetUser,
    screenParams?.skillId,
  ]);

  /*
   * ---------------------------------------------------------
   * CURRENT USER'S SKILLS
   * ---------------------------------------------------------
   */
  const myOffers = useMemo(() => {
    if (!currentUser) return [];

    return skillOffers.filter(
      (offer) =>
        String(offer.userId) ===
        String(currentUser.id)
    );
  }, [skillOffers, currentUser]);

  /*
   * ---------------------------------------------------------
   * INITIAL SKILL
   * ---------------------------------------------------------
   */
  const initialRequestedSkillId = useMemo(() => {
    /*
     * First priority:
     * skill selected from Explore / Student Profile.
     */
    if (screenParams?.skillId) {
      const matchingSkill = targetOffers.find(
        (offer) =>
          String(offer.id) ===
          String(screenParams.skillId)
      );

      if (matchingSkill) {
        return matchingSkill.id;
      }
    }

    /*
     * Otherwise select Rama's first available skill.
     */
    return targetOffers[0]?.id || '';
  }, [
    screenParams?.skillId,
    targetOffers,
  ]);

  /*
   * ---------------------------------------------------------
   * STATE
   * ---------------------------------------------------------
   */
  const [selectedRequestedId, setSelectedRequestedId] =
    useState(initialRequestedSkillId);

  const [selectedOfferedId, setSelectedOfferedId] =
    useState(myOffers[0]?.id || '');

  const [message, setMessage] = useState('');

  const [preferredSchedule, setPreferredSchedule] =
    useState('Saturdays at 4:00 PM');

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /*
   * ---------------------------------------------------------
   * KEEP SELECTED SKILL IN SYNC
   * ---------------------------------------------------------
   *
   * This is important when the screen first loads before
   * skill data has finished becoming available.
   */
  useEffect(() => {
    if (!selectedRequestedId && targetOffers.length > 0) {
      setSelectedRequestedId(targetOffers[0].id);
    }
  }, [
    targetOffers,
    selectedRequestedId,
  ]);

  /*
   * Keep current user's first skill selected.
   */
  useEffect(() => {
    if (!selectedOfferedId && myOffers.length > 0) {
      setSelectedOfferedId(myOffers[0].id);
    }
  }, [
    myOffers,
    selectedOfferedId,
  ]);

  /*
   * Set personal message after target user becomes available.
   */
  useEffect(() => {
    if (!targetUser) return;

    setMessage(
      `Hey ${
        targetUser.name?.split(' ')[0] ||
        'there'
      }! I saw your profile and would love to exchange skills with you.`
    );
  }, [targetUser?.id]);

  /*
   * ---------------------------------------------------------
   * SELECTED SKILLS
   * ---------------------------------------------------------
   */
  const selectedRequestedSkill =
    skillOffers.find(
      (skill) =>
        String(skill.id) ===
        String(selectedRequestedId)
    );

  const selectedOfferedSkill =
    skillOffers.find(
      (skill) =>
        String(skill.id) ===
        String(selectedOfferedId)
    );

  /*
   * ---------------------------------------------------------
   * SUBMIT
   * ---------------------------------------------------------
   */
  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!targetUser) {
      showToast(
        'Student information could not be found',
        'error'
      );
      return;
    }

    if (!selectedRequestedId) {
      showToast(
        `Please select a skill you want to learn from ${targetUser.name}`,
        'error'
      );
      return;
    }

    if (!selectedRequestedSkill) {
      showToast(
        'The selected learning skill is no longer available',
        'error'
      );
      return;
    }

    if (!selectedOfferedId) {
      showToast(
        'Please select a skill you can teach in exchange',
        'error'
      );
      return;
    }

    if (!selectedOfferedSkill) {
      showToast(
        'Your teaching skill could not be found',
        'error'
      );
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      sendExchangeRequest({
        receiverId: targetUser.id,
        skillRequestedId:
          selectedRequestedId,
        skillOfferedId:
          selectedOfferedId,
        message: message.trim(),
        preferredSchedule:
          preferredSchedule.trim() ||
          'Flexible',
      });

      setIsSubmitting(false);
    }, 500);
  };

  /*
   * ---------------------------------------------------------
   * SAFETY FALLBACK
   * ---------------------------------------------------------
   */
  if (!targetUser) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
        <div className="glass-card rounded-3xl border border-rose-900/40 p-6 text-center">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />

          <h2 className="text-lg font-bold text-slate-100">
            Student Not Found
          </h2>

          <p className="text-xs text-slate-400 mt-2">
            We could not find the student for this
            exchange request.
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

        {/* ------------------------------------------------ */}
        {/* HEADER */}
        {/* ------------------------------------------------ */}

        <div className="flex flex-col gap-1 text-center pt-2">

          <h1 className="text-xl font-black text-slate-100 flex items-center justify-center gap-2">
            Skill Exchange Request

            <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
          </h1>

          <p className="text-xs text-slate-400">
            Propose a reciprocal skill exchange with{' '}
            {targetUser.name}
          </p>

        </div>

        {/* ------------------------------------------------ */}
        {/* TARGET USER */}
        {/* ------------------------------------------------ */}

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

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >

          {/* ================================================= */}
          {/* SECTION 1 — YOU WANT TO LEARN */}
          {/* ================================================= */}

          <div className="glass-card p-5 rounded-3xl border border-cyan-900/50 bg-cyan-950/20 flex flex-col gap-3">

            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">

              <Sparkles className="w-4 h-4" />

              You Want To Learn From{' '}
              {targetUser.name.split(' ')[0]}

            </span>

            {targetOffers.length === 0 ? (

              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 flex flex-col gap-2">

                <div className="flex items-center gap-2 text-amber-300">

                  <AlertCircle className="w-4 h-4" />

                  <span className="text-xs font-semibold">
                    No teaching skills found
                  </span>

                </div>

                <p className="text-[11px] text-amber-200/70">
                  {targetUser.name} has no available
                  taught skills in the current app data.
                </p>

                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() =>
                    navigate(
                      'STUDENT_PROFILE',
                      {
                        userId: targetUser.id,
                      }
                    )
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
                  onChange={(e) =>
                    setSelectedRequestedId(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select a skill to learn
                  </option>

                  {targetOffers.map((offer) => (
                    <option
                      key={offer.id}
                      value={offer.id}
                    >
                      {offer.skillName} (
                      {offer.level} Level)
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
                      {selectedRequestedSkill.level} Level
                    </p>

                  </div>

                )}

              </>

            )}

          </div>

          {/* ================================================= */}
          {/* SECTION 2 — YOU OFFER */}
          {/* ================================================= */}

          <div className="glass-card p-5 rounded-3xl border border-indigo-900/50 bg-indigo-950/20 flex flex-col gap-3">

            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">

              <Sparkles className="w-4 h-4" />

              You Offer To Teach In Return

            </span>

            {myOffers.length === 0 ? (

              <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs flex flex-col gap-2">

                <div className="flex items-center gap-1.5 font-semibold">

                  <AlertCircle className="w-4 h-4" />

                  No skills added to your taught list!

                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() =>
                    navigate('MY_SKILLS')
                  }
                >
                  Add Skill to My Profile
                </Button>

              </div>

            ) : (

              <select
                className="w-full bg-slate-900 border border-indigo-700/70 text-slate-100 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                value={selectedOfferedId}
                onChange={(e) =>
                  setSelectedOfferedId(
                    e.target.value
                  )
                }
              >

                {myOffers.map((offer) => (
                  <option
                    key={offer.id}
                    value={offer.id}
                  >
                    {offer.skillName} (
                    {offer.level} Level)
                  </option>
                ))}

              </select>

            )}

          </div>

          {/* ================================================= */}
          {/* PERSONAL NOTE */}
          {/* ================================================= */}

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
              onChange={(e) =>
                setMessage(e.target.value)
              }
            />

            <div className="text-right text-[10px] text-slate-600">
              {message.length}/500
            </div>

          </div>

          {/* ================================================= */}
          {/* SCHEDULE */}
          {/* ================================================= */}

          <Input
            label="Preferred Schedule"
            leftIcon={
              <Calendar className="w-4 h-4 text-cyan-400" />
            }
            placeholder="e.g. Saturdays at 4:00 PM"
            value={preferredSchedule}
            onChange={(e) =>
              setPreferredSchedule(
                e.target.value
              )
            }
          />

          {/* ================================================= */}
          {/* SEND */}
          {/* ================================================= */}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            disabled={
              isSubmitting ||
              targetOffers.length === 0 ||
              myOffers.length === 0
            }
            rightIcon={
              <Send className="w-4 h-4" />
            }
            className="mt-2"
          >
            Send Exchange Request
          </Button>

        </form>

      </div>

    </div>
  );
};