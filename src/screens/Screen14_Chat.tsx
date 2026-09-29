import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Send, CheckCheck, Calendar, Sparkles, User, ChevronLeft } from 'lucide-react';

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

  const exchangeId = screenParams?.exchangeId || exchanges[0]?.id;
  const exchange = exchanges.find((e) => e.id === exchangeId) || exchanges[0];

  const [inputMsg, setInputMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!exchange) {
    return <div className="p-8 text-center text-slate-400">No chat conversation found</div>;
  }

  const isStudent1 = exchange.student1Id === currentUser?.id;
  const partnerId = isStudent1 ? exchange.student2Id : exchange.student1Id;
  const partner = users.find((u) => u.id === partnerId);

  const learnedSkill = skillOffers.find(
    (s) => s.id === (isStudent1 ? exchange.skill2Id : exchange.skill1Id)
  );

  const chatMessages = messages.filter((m) => m.exchangeId === exchange.id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    sendMessage(exchange.id, inputMsg.trim());
    setInputMsg('');
  };

  return (
    <div className="min-h-[90vh] flex flex-col justify-between bg-slate-950 animate-fade-in relative">
      {/* Top Chat Header */}
      <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="text-slate-400 hover:text-white p-1">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <img
            src={partner?.avatar}
            alt={partner?.name}
            onClick={() => navigate('STUDENT_PROFILE', { userId: partner?.id })}
            className="w-10 h-10 rounded-full object-cover border border-indigo-500/50 cursor-pointer"
          />
          <div className="flex flex-col">
            <h3
              onClick={() => navigate('STUDENT_PROFILE', { userId: partner?.id })}
              className="font-bold text-slate-100 text-sm hover:text-indigo-300 cursor-pointer flex items-center gap-1.5"
            >
              {partner?.name}
            </h3>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Swapping {learnedSkill?.skillName || 'Skills'}
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('MATCHED_EXCHANGE', { exchangeId: exchange.id })}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-indigo-400 hover:bg-slate-800 font-semibold"
        >
          Details
        </button>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 my-2">
        <div className="text-center py-2">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            Exchange Connected on {exchange.startDate}
          </span>
        </div>

        {chatMessages.length === 0 ? (
          <div className="text-center p-6 text-xs text-slate-500 italic">
            Say hi to {partner?.name.split(' ')[0]} to arrange your first skill exchange session!
          </div>
        ) : (
          chatMessages.map((msg) => {
            const isMe = msg.senderId === currentUser?.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[80%] ${
                  isMe ? 'self-end items-end' : 'self-start items-start'
                }`}
              >
                <div
                  className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                    isMe
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-none'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 px-1">
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Footer */}
      <form
        onSubmit={handleSend}
        className="sticky bottom-0 z-30 p-3 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder={`Message ${partner?.name.split(' ')[0]}...`}
          className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
        />
        <button
          type="submit"
          disabled={!inputMsg.trim()}
          className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold disabled:opacity-40 transition-colors shadow-lg shadow-indigo-600/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
