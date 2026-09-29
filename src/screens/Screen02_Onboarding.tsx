import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { BookOpen, Sparkles, Repeat, ArrowRight, CheckCircle } from 'lucide-react';

export const Screen02_Onboarding: React.FC = () => {
  const { completeOnboarding, navigate } = useApp();
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      icon: <BookOpen className="w-12 h-12 text-indigo-400" />,
      tag: 'TEACH & INSPIRE',
      headline: 'Share What You Know',
      description:
        'Offer your skills—whether it is Python programming, UI/UX design, guitar, or public speaking. Turn your knowledge into currency!',
      bgGradient: 'from-indigo-600/20 via-purple-600/10 to-transparent',
    },
    {
      icon: <Sparkles className="w-12 h-12 text-cyan-400" />,
      tag: 'DISCOVER & EXPAND',
      headline: 'Learn What You Love',
      description:
        'Browse peer-offered skills across 10+ campus categories. Find student mentors in your own college or neighboring universities.',
      bgGradient: 'from-cyan-600/20 via-teal-600/10 to-transparent',
    },
    {
      icon: <Repeat className="w-12 h-12 text-emerald-400" />,
      tag: 'MUTUAL GROWTH',
      headline: 'Exchange Skills. Grow Together.',
      description:
        'Smart 2-way matching pairs you with students who want to learn what you teach and teach what you want to learn. No fees, pure peer learning!',
      bgGradient: 'from-emerald-600/20 via-indigo-600/10 to-transparent',
    },
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((prev) => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const current = pages[currentPage];

  return (
    <div className="min-h-[85vh] flex flex-col justify-between p-6 relative overflow-hidden bg-slate-950 animate-fade-in">
      {/* Dynamic Background Glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${current.bgGradient} pointer-events-none transition-all duration-500`}
      />

      {/* Top Controls */}
      <div className="flex items-center justify-between z-10 pt-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Step {currentPage + 1} of {pages.length}
        </span>
        {currentPage < pages.length - 1 && (
          <button
            onClick={completeOnboarding}
            className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800"
          >
            Skip
          </button>
        )}
      </div>

      {/* Main Slide Content */}
      <div className="flex flex-col items-center text-center gap-6 my-auto z-10 px-2 animate-slide-up key={currentPage}">
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-700/80 shadow-2xl backdrop-blur-xl relative">
          {current.icon}
          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-indigo-500 text-white shadow-md">
            {current.tag}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-black text-slate-100 tracking-tight leading-snug">
            {current.headline}
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
            {current.description}
          </p>
        </div>
      </div>

      {/* Bottom Controls & Indicators */}
      <div className="flex flex-col gap-6 z-10 pb-4">
        {/* Page Dots Indicator */}
        <div className="flex items-center justify-center gap-2">
          {pages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentPage
                  ? 'w-8 bg-indigo-400'
                  : 'w-2 bg-slate-800 hover:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          {currentPage === pages.length - 1 ? (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              rightIcon={<CheckCircle className="w-5 h-5" />}
              onClick={completeOnboarding}
            >
              Get Started with SkillSwap
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              rightIcon={<ArrowRight className="w-5 h-5" />}
              onClick={handleNext}
            >
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
