import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Send,
  CheckCheck,
  MessageCircle,
  ChevronLeft,
  Info,
} from 'lucide-react';

export const Screen14_Chat: React.FC = () => {
  const {
    screenParams,
    exchanges,
    messages,
    sendMessage,
    currentUser,
    users,
    skillOffers,
    navigate,
    goBack,
  } = useApp();

  const [inputMsg, setInputMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /*
   * ---------------------------------------------------------
   * FIND CURRENT EXCHANGE
   * ---------------------------------------------------------
   */
  const exchangeId =
    screenParams?.exchangeId ||
    exchanges.find(
      (exchange) =>
        exchange.student1Id === currentUser?.id ||
        exchange.student2Id === currentUser?.id
    )?.id ||
    exchanges[0]?.id;

  const exchange =
    exchanges.find(
      (exchange) => exchange.id === exchangeId
    ) || exchanges[0];

  /*
   * ---------------------------------------------------------
   * FIND PARTNER
   * ---------------------------------------------------------
   */
  const isStudent1 =
    exchange?.student1Id === currentUser?.id;

  const partnerId = exchange
    ? isStudent1
      ? exchange.student2Id
      : exchange.student1Id
    : undefined;

  const partner = users.find(
    (user) => user.id === partnerId
  );

  /*
   * ---------------------------------------------------------
   * FIND LEARNED SKILL
   * ---------------------------------------------------------
   */
  const learnedSkill = exchange
    ? skillOffers.find(
        (skill) =>
          skill.id ===
          (isStudent1
            ? exchange.skill2Id
            : exchange.skill1Id)
      )
    : undefined;

  /*
   * ---------------------------------------------------------
   * CHAT MESSAGES
   * ---------------------------------------------------------
   */
  const chatMessages = exchange
    ? messages.filter(
        (message) =>
          message.exchangeId === exchange.id
      )
    : [];

  /*
   * ---------------------------------------------------------
   * AUTO SCROLL
   * ---------------------------------------------------------
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [chatMessages.length]);

  /*
   * ---------------------------------------------------------
   * SEND MESSAGE
   * ---------------------------------------------------------
   */
  const handleSend = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const trimmedMessage =
      inputMsg.trim();

    if (!trimmedMessage) return;

    if (!exchange) return;

    sendMessage(
      exchange.id,
      trimmedMessage
    );

    setInputMsg('');
  };

  /*
   * ---------------------------------------------------------
   * ENTER KEY
   * ---------------------------------------------------------
   */
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      const trimmedMessage =
        inputMsg.trim();

      if (!trimmedMessage) return;

      if (!exchange) return;

      sendMessage(
        exchange.id,
        trimmedMessage
      );

      setInputMsg('');
    }
  };

  /*
   * ---------------------------------------------------------
   * EMPTY EXCHANGE
   * ---------------------------------------------------------
   */
  if (!exchange) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">

        <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
          <MessageCircle className="w-8 h-8 text-indigo-400" />
        </div>

        <h2 className="text-lg font-bold text-slate-100">
          No Chat Conversation
        </h2>

        <p className="text-xs text-slate-500 mt-2 max-w-xs">
          There is no active exchange conversation
          available right now.
        </p>

        <button
          onClick={goBack}
          className="mt-5 px-5 py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-colors"
        >
          Go Back
        </button>

      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * PARTNER FALLBACK
   * ---------------------------------------------------------
   */
  const partnerName =
    partner?.name || 'Exchange Partner';

  const firstName =
    partnerName.split(' ')[0] ||
    'Partner';

  /*
   * ---------------------------------------------------------
   * MAIN UI
   * ---------------------------------------------------------
   */
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 animate-fade-in">

      {/* ================================================= */}
      {/* CHAT HEADER */}
      {/* ================================================= */}

      <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3 min-w-0">

            {/* Back */}
            <button
              type="button"
              onClick={goBack}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Avatar */}
            <button
              type="button"
              onClick={() => {
                if (partner?.id) {
                  navigate(
                    'STUDENT_PROFILE',
                    {
                      userId: partner.id,
                    }
                  );
                }
              }}
              className="shrink-0"
            >
              <img
                src={
                  partner?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
                }
                alt={partnerName}
                className="w-11 h-11 rounded-full object-cover border-2 border-indigo-500/50"
              />
            </button>

            {/* Partner Information */}
            <div className="flex flex-col min-w-0">

              <button
                type="button"
                onClick={() => {
                  if (partner?.id) {
                    navigate(
                      'STUDENT_PROFILE',
                      {
                        userId: partner.id,
                      }
                    );
                  }
                }}
                className="text-left font-bold text-slate-100 text-sm truncate hover:text-indigo-300 transition-colors"
              >
                {partnerName}
              </button>

              <span className="text-[10px] text-emerald-400 flex items-center gap-1.5 mt-0.5">

                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                Exchange Partner

              </span>

            </div>

          </div>

          {/* Details */}
          <button
            type="button"
            onClick={() =>
              navigate(
                'MATCHED_EXCHANGE',
                {
                  exchangeId:
                    exchange.id,
                }
              )
            }
            className="shrink-0 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 hover:bg-slate-800 transition-colors"
            aria-label="Exchange details"
          >
            <Info className="w-4 h-4" />
          </button>

        </div>

        {/* Skill Strip */}
        <div className="mt-3 px-3 py-2 rounded-xl bg-indigo-950/30 border border-indigo-900/40">

          <div className="flex items-center justify-between gap-3">

            <div className="flex flex-col min-w-0">

              <span className="text-[9px] uppercase tracking-wider text-indigo-400 font-bold">
                You Learn
              </span>

              <span className="text-xs font-semibold text-slate-200 truncate">
                {learnedSkill?.skillName ||
                  'Skill Exchange'}
              </span>

            </div>

            <div className="w-px h-7 bg-slate-800" />

            <div className="flex flex-col min-w-0 text-right">

              <span className="text-[9px] uppercase tracking-wider text-cyan-400 font-bold">
                Exchange
              </span>

              <span className="text-xs font-semibold text-slate-200 truncate">
                {exchange.progress || 0}% Complete
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* MESSAGE AREA */}
      {/* ================================================= */}

      <div className="flex-1 overflow-y-auto px-4 py-4">

        {/* Exchange Start */}
        <div className="flex justify-center mb-5">

          <div className="text-center">

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">

              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />

              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold">
                Exchange Connected
              </span>

            </div>

            {exchange.startDate && (
              <p className="text-[9px] text-slate-600 mt-1">
                {exchange.startDate}
              </p>
            )}

          </div>

        </div>

        {/* Empty Chat */}
        {chatMessages.length === 0 ? (

          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">

            <div className="w-16 h-16 rounded-3xl bg-indigo-950/40 border border-indigo-900/50 flex items-center justify-center mb-4">

              <MessageCircle className="w-8 h-8 text-indigo-400" />

            </div>

            <h3 className="text-sm font-bold text-slate-200">
              Start the conversation
            </h3>

            <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
              Say hello to {firstName} and
              coordinate your first skill exchange
              session.
            </p>

            <button
              type="button"
              onClick={() =>
                setInputMsg(
                  `Hi ${firstName}! Looking forward to our skill exchange.`
                )
              }
              className="mt-4 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-indigo-400 hover:bg-slate-800 transition-colors"
            >
              Say Hello 👋
            </button>

          </div>

        ) : (

          <div className="flex flex-col gap-3">

            {chatMessages.map((msg) => {

              const isMe =
                msg.senderId ===
                currentUser?.id;

              const timestamp =
                new Date(
                  msg.timestamp
                );

              const timeText =
                Number.isNaN(
                  timestamp.getTime()
                )
                  ? ''
                  : timestamp.toLocaleTimeString(
                      [],
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    );

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[82%] ${
                    isMe
                      ? 'self-end items-end'
                      : 'self-start items-start'
                  }`}
                >

                  {/* Message */}
                  <div
                    className={`px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-md break-words ${
                      isMe
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-none'
                        : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-1.5 text-[9px] text-slate-600 mt-1 px-1">

                    <span>
                      {timeText}
                    </span>

                    {isMe && (
                      <CheckCheck className="w-3 h-3 text-cyan-400" />
                    )}

                  </div>

                </div>
              );
            })}

            <div ref={messagesEndRef} />

          </div>

        )}

      </div>

      {/* ================================================= */}
      {/* MESSAGE INPUT */}
      {/* ================================================= */}

      <div className="sticky bottom-0 z-30 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 p-3">

        <form
          onSubmit={handleSend}
          className="flex items-center gap-2"
        >

          <input
            type="text"
            placeholder={`Message ${firstName}...`}
            className="flex-1 min-w-0 bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50"
            value={inputMsg}
            onChange={(e) =>
              setInputMsg(e.target.value)
            }
            onKeyDown={handleKeyDown}
            maxLength={1000}
            autoComplete="off"
          />

          <button
            type="submit"
            disabled={
              !inputMsg.trim()
            }
            className="shrink-0 p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>

        </form>

        <div className="flex justify-between px-2 mt-1">

          <span className="text-[9px] text-slate-700">
            Messages are saved with your exchange
          </span>

          <span className="text-[9px] text-slate-700">
            {inputMsg.length}/1000
          </span>

        </div>

      </div>

    </div>
  );
};