import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SkillCard } from '../components/common/SkillCard';
import { StudentCard } from '../components/common/StudentCard';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { calculateSmartMatch } from '../utils/matching';
import { SkillCategory } from '../types';
import { Search, SlidersHorizontal, Sparkles, Users, BookOpen, Filter } from 'lucide-react';

export const Screen07_Explore: React.FC = () => {
  const {
    skillOffers,
    users,
    currentUser,
    skillWants,
    filters,
    updateFilters,
    navigate,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'skills' | 'students'>('skills');

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

  // Filter skills based on search & category & filters state
  const filteredSkills = skillOffers.filter((skill) => {
    if (skill.userId === currentUser?.id) return false;

    const matchesSearch =
      !filters.searchQuery ||
      skill.skillName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(filters.searchQuery.toLowerCase());

    const matchesCategory =
      filters.category === 'All' || skill.category === filters.category;

    const matchesLevel =
      filters.skillLevel === 'All' || skill.level === filters.skillLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Filter students based on search & category
  const filteredStudents = users
    .filter((user) => {
      if (user.id === currentUser?.id) return false;

      const matchesSearch =
        !filters.searchQuery ||
        user.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(filters.searchQuery.toLowerCase());

      const userOffers = skillOffers.filter((o) => o.userId === user.id);
      const matchesCategory =
        filters.category === 'All' ||
        userOffers.some((o) => o.category === filters.category);

      return matchesSearch && matchesCategory;
    })
    .map((student) => ({
      student,
      matchResult: calculateSmartMatch(currentUser, student, skillOffers, skillWants),
    }))
    .sort((a, b) => b.matchResult.score - a.matchResult.score);

  return (
    <div className="min-h-screen p-4 flex flex-col gap-5 bg-slate-950 pb-20 animate-fade-in">
      {/* Header & Search Bar */}
      <div className="flex flex-col gap-3 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-100">Explore Skills</h1>
            <p className="text-xs text-slate-400">Discover peer mentors across campus</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('FILTERS')}
            leftIcon={<SlidersHorizontal className="w-4 h-4 text-indigo-400" />}
          >
            Filters
          </Button>
        </div>

        <Input
          placeholder="Search skills, topics, students (e.g. Python, Figma)..."
          leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          value={filters.searchQuery}
          onChange={(e) => updateFilters({ searchQuery: e.target.value })}
        />
      </div>

      {/* Horizontal Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => updateFilters({ category: cat })}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              filters.category === cat
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white border-indigo-400/50 shadow-md shadow-indigo-600/30'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* View Switcher Tabs: Skills vs Students */}
      <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'skills'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Skills Offered ({filteredSkills.length})
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'students'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" /> Students ({filteredStudents.length})
        </button>
      </div>

      {/* Skills Tab Content */}
      {activeTab === 'skills' && (
        <div className="flex flex-col gap-4">
          {filteredSkills.length === 0 ? (
            <div className="text-center p-8 glass-card rounded-2xl border border-slate-800">
              <p className="text-sm font-semibold text-slate-300">No skills found matching your query</p>
              <p className="text-xs text-slate-500 mt-1">Try resetting your filters or search keywords</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => updateFilters({ searchQuery: '', category: 'All', skillLevel: 'All' })}
              >
                Clear Search Filters
              </Button>
            </div>
          ) : (
            filteredSkills.map((skill) => {
              const teacher = users.find((u) => u.id === skill.userId);
              return (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  teacher={teacher}
                  onSelect={() => navigate('SKILL_DETAILS', { skillId: skill.id })}
                  onRequestExchange={() => navigate('REQUEST_EXCHANGE', { skillId: skill.id })}
                />
              );
            })
          )}
        </div>
      )}

      {/* Students Tab Content */}
      {activeTab === 'students' && (
        <div className="flex flex-col gap-4">
          {filteredStudents.length === 0 ? (
            <div className="text-center p-8 glass-card rounded-2xl border border-slate-800">
              <p className="text-sm font-semibold text-slate-300">No student profiles found</p>
              <p className="text-xs text-slate-500 mt-1">Try exploring other categories or clearing your search</p>
            </div>
          ) : (
            filteredStudents.map(({ student, matchResult }) => (
              <StudentCard
                key={student.id}
                student={student}
                matchResult={matchResult}
                onSelect={() => navigate('STUDENT_PROFILE', { userId: student.id })}
                onRequestExchange={() => navigate('REQUEST_EXCHANGE', { targetUserId: student.id })}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};
