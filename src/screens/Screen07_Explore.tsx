import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SkillCard } from '../components/common/SkillCard';
import { StudentCard } from '../components/common/StudentCard';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { calculateSmartMatch } from '../utils/matching';
import { SkillCategory } from '../types';
import {
  Search,
  SlidersHorizontal,
  Users,
  BookOpen,
} from 'lucide-react';

const safeText = (value: unknown): string =>
  String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const compactText = (value: unknown): string =>
  safeText(value).replace(/\s+/g, '');

const levenshtein = (a: string, b: string): number => {
  if (!a) return b.length;
  if (!b) return a.length;

  const matrix: number[][] = Array.from(
    { length: a.length + 1 },
    () => Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i][j] =
        a[i - 1] === b[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(
              matrix[i - 1][j] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j - 1] + 1
            );
    }
  }

  return matrix[a.length][b.length];
};

const isSubsequence = (query: string, text: string): boolean => {
  if (!query) return true;

  let index = 0;

  for (const char of text) {
    if (char === query[index]) {
      index++;

      if (index === query.length) {
        return true;
      }
    }
  }

  return false;
};

const getSearchScore = (
  skillName: unknown,
  description: unknown,
  queryValue: unknown
): number => {
  const query = compactText(queryValue);

  if (!query) return 1;

  const name = safeText(skillName);
  const descriptionText = safeText(description);
  const compactName = compactText(skillName);

  if (!name) return 0;

  let score = 0;

  if (compactName === query) {
    score += 1000;
  }

  if (compactName.startsWith(query)) {
    score += 800;
  }

  if (name.includes(safeText(queryValue))) {
    score += 600;
  }

  if (descriptionText.includes(safeText(queryValue))) {
    score += 150;
  }

  const words = name.split(/\s+/).filter(Boolean);

  for (const word of words) {
    if (word.startsWith(query)) {
      score += 500;
    }

    if (query.length >= 2) {
      const prefix = word.slice(
        0,
        Math.min(word.length, Math.max(query.length, 2))
      );

      const distance = levenshtein(query, prefix);

      if (
        distance <=
        (query.length <= 3 ? 1 : 2)
      ) {
        score += 350;
      }
    }
  }

  if (
    query.length >= 2 &&
    isSubsequence(query, compactName)
  ) {
    score += 300;
  }

  if (query.length >= 2) {
    const prefix = compactName.slice(
      0,
      Math.min(
        compactName.length,
        Math.max(query.length, 2)
      )
    );

    const distance = levenshtein(query, prefix);

    if (
      distance <=
      (query.length <= 3 ? 1 : 2)
    ) {
      score += 400;
    }
  }

  return score;
};

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

  const [activeTab, setActiveTab] =
    useState<'skills' | 'students'>('skills');

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

  const searchQuery = String(
    filters?.searchQuery ?? ''
  );

  const filteredSkills = (skillOffers || [])
    .filter((skill) => {
      if (!skill) return false;

      if (
        currentUser?.id &&
        skill.userId === currentUser.id
      ) {
        return false;
      }

      const matchesCategory =
        filters?.category === 'All' ||
        !filters?.category ||
        skill.category === filters.category;

      const matchesLevel =
        filters?.skillLevel === 'All' ||
        !filters?.skillLevel ||
        skill.level === filters.skillLevel;

      if (!matchesCategory || !matchesLevel) {
        return false;
      }

      if (!searchQuery.trim()) {
        return true;
      }

      return (
        getSearchScore(
          skill.skillName,
          skill.description,
          searchQuery
        ) > 0
      );
    })
    .map((skill) => ({
      skill,
      score: getSearchScore(
        skill.skillName,
        skill.description,
        searchQuery
      ),
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ skill }) => skill);

  const filteredStudents = (users || [])
    .filter((user) => {
      if (!user) return false;

      if (
        currentUser?.id &&
        user.id === currentUser.id
      ) {
        return false;
      }

      const query = safeText(searchQuery);

      const userName = safeText(user.name);
      const department = safeText(user.department);

      const matchesSearch =
        !query ||
        userName.includes(query) ||
        department.includes(query);

      const userOffers = (skillOffers || []).filter(
        (offer) =>
          offer &&
          offer.userId === user.id
      );

      const matchesCategory =
        !filters?.category ||
        filters.category === 'All' ||
        userOffers.some(
          (offer) =>
            offer.category === filters.category
        );

      return matchesSearch && matchesCategory;
    })
    .map((student) => {
      let matchResult;

      try {
        matchResult = calculateSmartMatch(
          currentUser,
          student,
          skillOffers || [],
          skillWants || []
        );
      } catch {
        matchResult = {
          score: 0,
        } as any;
      }

      return {
        student,
        matchResult,
      };
    })
    .sort(
      (a, b) =>
        Number(b.matchResult?.score ?? 0) -
        Number(a.matchResult?.score ?? 0)
    );

  return (
    <div className="min-h-screen p-4 flex flex-col gap-5 bg-slate-950 pb-20 animate-fade-in">

      <div className="flex flex-col gap-3 pt-1">

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-xl font-black text-slate-100">
              Explore Skills
            </h1>

            <p className="text-xs text-slate-400">
              Discover peer mentors across campus
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('FILTERS')}
            leftIcon={
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            }
          >
            Filters
          </Button>

        </div>

        <Input
          placeholder="Search skills, topics, students..."
          leftIcon={
            <Search className="w-4 h-4 text-slate-400" />
          }
          value={searchQuery}
          onChange={(e) =>
            updateFilters({
              searchQuery: e.target.value,
            })
          }
        />

      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              updateFilters({
                category: cat,
              })
            }
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              filters?.category === cat
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white border-indigo-400/50 shadow-md shadow-indigo-600/30'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}

      </div>

      <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">

        <button
          onClick={() => setActiveTab('skills')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'skills'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Skills Offered ({filteredSkills.length})
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'students'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Students ({filteredStudents.length})
        </button>

      </div>

      {activeTab === 'skills' && (
        <div className="flex flex-col gap-4">

          {filteredSkills.length === 0 ? (
            <div className="text-center p-8 glass-card rounded-2xl border border-slate-800">

              <p className="text-sm font-semibold text-slate-300">
                No skills found matching your query
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Try another keyword or reset your filters
              </p>

              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() =>
                  updateFilters({
                    searchQuery: '',
                    category: 'All',
                    skillLevel: 'All',
                  })
                }
              >
                Clear Search Filters
              </Button>

            </div>
          ) : (
            filteredSkills.map((skill) => {

              const teacher = (users || []).find(
                (u) =>
                  u &&
                  u.id === skill.userId
              );

              return (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  teacher={teacher}
                  onSelect={() =>
                    navigate('SKILL_DETAILS', {
                      skillId: skill.id,
                    })
                  }
                  onRequestExchange={() =>
                    navigate('REQUEST_EXCHANGE', {
                      skillId: skill.id,
                    })
                  }
                />
              );
            })
          )}

        </div>
      )}

      {activeTab === 'students' && (
        <div className="flex flex-col gap-4">

          {filteredStudents.length === 0 ? (
            <div className="text-center p-8 glass-card rounded-2xl border border-slate-800">

              <p className="text-sm font-semibold text-slate-300">
                No student profiles found
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Try exploring other categories or clearing your search
              </p>

            </div>
          ) : (
            filteredStudents.map(
              ({ student, matchResult }) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  matchResult={matchResult}
                  onSelect={() =>
                    navigate('STUDENT_PROFILE', {
                      userId: student.id,
                    })
                  }
                  onRequestExchange={() =>
                    navigate('REQUEST_EXCHANGE', {
                      targetUserId: student.id,
                    })
                  }
                />
              )
            )
          )}

        </div>
      )}

    </div>
  );
};