import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { FilterState, SkillCategory } from '../types';
import { SlidersHorizontal, Check, RefreshCcw, Zap } from 'lucide-react';

export const Screen08_Filters: React.FC = () => {
  const { filters, updateFilters, resetFilters, goBack, navigate } = useApp();

  const categories: SkillCategory[] = [
    'All',
    'Programming',
    'Design',
    'Communication',
    'Business',
    'Music',
    'Photography',
    'Video Editing',
    'Academics',
    'Sports',
    'Languages',
    'Other',
  ];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const departments = ['All', 'Computer Science & Eng', 'Information Science', 'Electronics & Comm', 'Mechanical Eng', 'Business Admin'];
  const semesters = ['All', '1st Sem', '3rd Sem', '5th Sem', '7th Sem'];

  const handleApply = () => {
    navigate('EXPLORE');
  };

  return (
    <div className="min-h-screen p-5 flex flex-col justify-between bg-slate-950 pb-20 animate-fade-in">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
            <h1 className="text-lg font-black text-slate-100">Filter Skills & Mentors</h1>
          </div>
          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <RefreshCcw className="w-3.5 h-3.5" /> Clear All
          </button>
        </div>

        {/* 2-Way Match Compatibility Toggle */}
        <div
          onClick={() => updateFilters({ compatibilityOnly: !filters.compatibilityOnly })}
          className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
            filters.compatibilityOnly
              ? 'bg-amber-950/40 border-amber-500/50 shadow-lg shadow-amber-950/50'
              : 'glass-card border-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Zap className="w-5 h-5 fill-amber-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-100">Smart 2-Way Exchanges Only</span>
              <span className="text-[11px] text-slate-400">Show only students who want what I teach</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={filters.compatibilityOnly}
            onChange={() => {}}
            className="w-4 h-4 rounded text-indigo-500 border-slate-700 bg-slate-900"
          />
        </div>

        {/* Category Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => updateFilters({ category: cat })}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  filters.category === cat
                    ? 'bg-indigo-600 text-white border-indigo-400'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Level */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Skill Level</label>
          <div className="flex flex-wrap gap-2">
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => updateFilters({ skillLevel: lvl })}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  filters.skillLevel === lvl
                    ? 'bg-cyan-600 text-white border-cyan-400'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Department Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Department</label>
          <select
            className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            value={filters.department}
            onChange={(e) => updateFilters({ department: e.target.value })}
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Semester</label>
          <select
            className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            value={filters.semester}
            onChange={(e) => updateFilters({ semester: e.target.value })}
          >
            {semesters.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
        <Button variant="outline" size="lg" fullWidth onClick={goBack}>
          Cancel
        </Button>
        <Button variant="primary" size="lg" fullWidth onClick={handleApply} leftIcon={<Check className="w-4 h-4" />}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
};
