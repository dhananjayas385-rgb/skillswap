import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import {
  Plus,
  Trash2,
  BookOpen,
  HeartHandshake,
  ChevronDown,
  Check,
} from 'lucide-react';
import { SkillLevel, SkillCategory } from '../types';

type SkillCatalogItem = {
  name: string;
  category: SkillCategory;
};

const SKILL_CATALOG: SkillCatalogItem[] = [
  // PROGRAMMING
  { name: 'Python', category: 'Programming' },
  { name: 'Python & Data Structures', category: 'Programming' },
  { name: 'Java', category: 'Programming' },
  { name: 'JavaScript', category: 'Programming' },
  { name: 'TypeScript', category: 'Programming' },
  { name: 'C', category: 'Programming' },
  { name: 'C++', category: 'Programming' },
  { name: 'C#', category: 'Programming' },
  { name: 'Go', category: 'Programming' },
  { name: 'Rust', category: 'Programming' },
  { name: 'Kotlin', category: 'Programming' },
  { name: 'Swift', category: 'Programming' },
  { name: 'PHP', category: 'Programming' },
  { name: 'Ruby', category: 'Programming' },
  { name: 'Dart', category: 'Programming' },
  { name: 'R Programming', category: 'Programming' },
  { name: 'SQL', category: 'Programming' },
  { name: 'HTML', category: 'Programming' },
  { name: 'CSS', category: 'Programming' },
  { name: 'React', category: 'Programming' },
  { name: 'React Native', category: 'Programming' },
  { name: 'Node.js', category: 'Programming' },
  { name: 'Express.js', category: 'Programming' },
  { name: 'FastAPI', category: 'Programming' },
  { name: 'Django', category: 'Programming' },
  { name: 'Flask', category: 'Programming' },
  { name: 'Angular', category: 'Programming' },
  { name: 'Vue.js', category: 'Programming' },
  { name: 'Next.js', category: 'Programming' },
  { name: 'Spring Boot', category: 'Programming' },
  { name: 'Object-Oriented Programming', category: 'Programming' },
  { name: 'OOP Concepts', category: 'Programming' },
  { name: 'Data Structures', category: 'Programming' },
  { name: 'Data Structures & Algorithms', category: 'Programming' },
  { name: 'Algorithms', category: 'Programming' },
  { name: 'Competitive Programming', category: 'Programming' },
  { name: 'Problem Solving', category: 'Programming' },
  { name: 'Git', category: 'Programming' },
  { name: 'GitHub', category: 'Programming' },
  { name: 'REST API Development', category: 'Programming' },
  { name: 'Backend Development', category: 'Programming' },
  { name: 'Frontend Development', category: 'Programming' },
  { name: 'Full Stack Development', category: 'Programming' },
  { name: 'Machine Learning', category: 'Programming' },
  { name: 'Artificial Intelligence', category: 'Programming' },

  // DESIGN
  { name: 'UI/UX Design', category: 'Design' },
  { name: 'Figma', category: 'Design' },
  { name: 'Graphic Design', category: 'Design' },
  { name: 'Graphic Design Basics', category: 'Design' },
  { name: 'Product Design', category: 'Design' },
  { name: 'Web Design', category: 'Design' },
  { name: 'Mobile App Design', category: 'Design' },
  { name: 'Visual Design', category: 'Design' },
  { name: 'Interaction Design', category: 'Design' },
  { name: 'Design Systems', category: 'Design' },
  { name: 'Wireframing', category: 'Design' },
  { name: 'Prototyping', category: 'Design' },
  { name: 'Typography', category: 'Design' },
  { name: 'Color Theory', category: 'Design' },
  { name: 'Adobe Photoshop', category: 'Design' },
  { name: 'Adobe Illustrator', category: 'Design' },
  { name: 'Canva', category: 'Design' },

  // COMMUNICATION
  { name: 'Public Speaking', category: 'Communication' },
  { name: 'Public Speaking & Presentation', category: 'Communication' },
  { name: 'Presentation Skills', category: 'Communication' },
  { name: 'Communication Skills', category: 'Communication' },
  { name: 'English Communication', category: 'Communication' },
  { name: 'Debating', category: 'Communication' },
  { name: 'Storytelling', category: 'Communication' },
  { name: 'Interview Skills', category: 'Communication' },
  { name: 'Leadership Communication', category: 'Communication' },
  { name: 'Group Discussion', category: 'Communication' },
  { name: 'Body Language', category: 'Communication' },
  { name: 'Voice Modulation', category: 'Communication' },

  // BUSINESS
  { name: 'Business Management', category: 'Business' },
  { name: 'Digital Marketing', category: 'Business' },
  { name: 'Digital Marketing & Socials', category: 'Business' },
  { name: 'Marketing', category: 'Business' },
  { name: 'Social Media Marketing', category: 'Business' },
  { name: 'Content Marketing', category: 'Business' },
  { name: 'SEO', category: 'Business' },
  { name: 'Entrepreneurship', category: 'Business' },
  { name: 'Financial Management', category: 'Business' },
  { name: 'Financial Modeling', category: 'Business' },
  { name: 'Excel', category: 'Business' },
  { name: 'Advanced Excel & Dashboards', category: 'Business' },
  { name: 'Business Analytics', category: 'Business' },
  { name: 'Project Management', category: 'Business' },
  { name: 'Sales', category: 'Business' },

  // MUSIC
  { name: 'Guitar', category: 'Music' },
  { name: 'Piano', category: 'Music' },
  { name: 'Keyboard', category: 'Music' },
  { name: 'Singing', category: 'Music' },
  { name: 'Music Production', category: 'Music' },
  { name: 'Music Theory', category: 'Music' },
  { name: 'Drums', category: 'Music' },
  { name: 'Ukulele', category: 'Music' },

  // PHOTOGRAPHY
  { name: 'Photography', category: 'Photography' },
  { name: 'Portrait Photography', category: 'Photography' },
  { name: 'Mobile Photography', category: 'Photography' },
  { name: 'Landscape Photography', category: 'Photography' },
  { name: 'Street Photography', category: 'Photography' },
  { name: 'Photo Editing', category: 'Photography' },
  { name: 'Lightroom', category: 'Photography' },
  { name: 'Camera Basics', category: 'Photography' },

  // VIDEO EDITING
  { name: 'Video Editing', category: 'Video Editing' },
  { name: 'Video Editing & Premiere Pro', category: 'Video Editing' },
  { name: 'Adobe Premiere Pro', category: 'Video Editing' },
  { name: 'DaVinci Resolve', category: 'Video Editing' },
  { name: 'Final Cut Pro', category: 'Video Editing' },
  { name: 'After Effects', category: 'Video Editing' },
  { name: 'Motion Graphics', category: 'Video Editing' },
  { name: 'Color Grading', category: 'Video Editing' },
  { name: 'Cinematography', category: 'Video Editing' },
  { name: 'Reels Editing', category: 'Video Editing' },

  // ACADEMICS
  { name: 'Mathematics', category: 'Academics' },
  { name: 'Physics', category: 'Academics' },
  { name: 'Chemistry', category: 'Academics' },
  { name: 'Data Analytics', category: 'Academics' },
  { name: 'Statistics', category: 'Academics' },
  { name: 'Database Management', category: 'Academics' },
  { name: 'Operating Systems', category: 'Academics' },
  { name: 'Computer Networks', category: 'Academics' },
  { name: 'Theory of Computation', category: 'Academics' },
  { name: 'Software Engineering', category: 'Academics' },

  // SPORTS
  { name: 'Cricket', category: 'Sports' },
  { name: 'Football', category: 'Sports' },
  { name: 'Badminton', category: 'Sports' },
  { name: 'Basketball', category: 'Sports' },
  { name: 'Table Tennis', category: 'Sports' },
  { name: 'Chess', category: 'Sports' },
  { name: 'Fitness Training', category: 'Sports' },
  { name: 'Yoga', category: 'Sports' },

  // LANGUAGES
  { name: 'English', category: 'Languages' },
  { name: 'Kannada', category: 'Languages' },
  { name: 'Hindi', category: 'Languages' },
  { name: 'Tamil', category: 'Languages' },
  { name: 'Telugu', category: 'Languages' },
  { name: 'Malayalam', category: 'Languages' },
  { name: 'French', category: 'Languages' },
  { name: 'German', category: 'Languages' },
  { name: 'Spanish', category: 'Languages' },

  // OTHER
  { name: 'Public Relations', category: 'Other' },
  { name: 'Time Management', category: 'Other' },
  { name: 'Teamwork', category: 'Other' },
  { name: 'Critical Thinking', category: 'Other' },
  { name: 'Creative Thinking', category: 'Other' },
  { name: 'Event Management', category: 'Other' },
];

const normalize = (value: unknown): string =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ');

const compact = (value: unknown): string =>
  normalize(value).replace(/\s+/g, '');

const isSubsequence = (query: string, target: string): boolean => {
  if (!query) return false;

  let index = 0;

  for (const character of target) {
    if (character === query[index]) {
      index += 1;
      if (index === query.length) return true;
    }
  }

  return false;
};

const acronym = (value: string): string =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('');

const getSuggestionScore = (query: string, skillName: string): number => {
  const q = normalize(query);
  const name = normalize(skillName);

  if (!q || !name) return 0;

  const compactQuery = compact(q);
  const compactName = compact(name);
  const words = name.split(/\s+/);

  let score = 0;

  if (name === q) score += 1000;

  if (compactName === compactQuery) score += 950;

  if (name.startsWith(q)) score += 800;

  if (compactName.startsWith(compactQuery)) score += 760;

  if (words.some((word) => word.startsWith(q))) {
    score += 650;
  }

  if (name.includes(q)) score += 550;

  if (compactName.includes(compactQuery)) {
    score += 500;
  }

  if (acronym(name) === compactQuery) {
    score += 900;
  }

  if (acronym(name).startsWith(compactQuery)) {
    score += 700;
  }

  if (isSubsequence(compactQuery, compactName)) {
    score += 250;
  }

  return score;
};

const getSmartSuggestions = (
  query: string,
  category: SkillCategory,
  existingSkills: SkillCatalogItem[]
): SkillCatalogItem[] => {
  const cleanQuery = normalize(query);

  const combined = [...SKILL_CATALOG, ...existingSkills];

  const unique = new Map<string, SkillCatalogItem>();

  for (const skill of combined) {
    const name = String(skill?.name ?? '').trim();
    const itemCategory = skill?.category;

    if (!name || !itemCategory) continue;

    if (itemCategory !== category) continue;

    const key = `${itemCategory}::${normalize(name)}`;

    if (!unique.has(key)) {
      unique.set(key, {
        name,
        category: itemCategory,
      });
    }
  }

  const allSkills = Array.from(unique.values());

  if (!cleanQuery) {
    return allSkills.slice(0, 12);
  }

  return allSkills
    .map((skill) => ({
      skill,
      score: getSuggestionScore(cleanQuery, skill.name),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.skill.name.localeCompare(b.skill.name);
    })
    .slice(0, 12)
    .map((item) => item.skill);
};

export const Screen17_MySkills: React.FC = () => {
  const {
    skillOffers,
    skillWants,
    currentUser,
    addSkillOffer,
    deleteSkillOffer,
    addSkillWant,
    deleteSkillWant,
  } = useApp();

  const myOffers = skillOffers.filter(
    (o) => o.userId === currentUser?.id
  );

  const myWants = skillWants.filter(
    (w) => w.userId === currentUser?.id
  );

  const [isAddOfferOpen, setIsAddOfferOpen] = useState(false);
  const [isAddWantOpen, setIsAddWantOpen] = useState(false);

  const [offerName, setOfferName] = useState('');
  const [offerCategory, setOfferCategory] =
    useState<SkillCategory>('Programming');
  const [offerLevel, setOfferLevel] =
    useState<SkillLevel>('Intermediate');
  const [offerAvailability, setOfferAvailability] =
    useState('Weekends & Evenings');
  const [offerDesc, setOfferDesc] = useState('');

  const [wantName, setWantName] = useState('');
  const [wantCategory, setWantCategory] =
    useState<SkillCategory>('Design');

  const [showOfferSuggestions, setShowOfferSuggestions] =
    useState(false);

  const [showWantSuggestions, setShowWantSuggestions] =
    useState(false);

  const categories: SkillCategory[] = [
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

  const existingSkills = useMemo<SkillCatalogItem[]>(() => {
    const offers: SkillCatalogItem[] = skillOffers.map((skill) => ({
      name: String(skill.skillName ?? ''),
      category: skill.category,
    }));

    const wants: SkillCatalogItem[] = skillWants.map((skill) => ({
      name: String(skill.skillName ?? ''),
      category: skill.category,
    }));

    return [...offers, ...wants];
  }, [skillOffers, skillWants]);

  const offerSuggestions = useMemo(
    () =>
      getSmartSuggestions(
        offerName,
        offerCategory,
        existingSkills
      ),
    [offerName, offerCategory, existingSkills]
  );

  const wantSuggestions = useMemo(
    () =>
      getSmartSuggestions(
        wantName,
        wantCategory,
        existingSkills
      ),
    [wantName, wantCategory, existingSkills]
  );

  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!offerName.trim()) return;

    addSkillOffer({
      skillName: offerName.trim(),
      category: offerCategory,
      level: offerLevel,
      availability: offerAvailability,
      experience: `${offerLevel} level`,
      description:
        offerDesc.trim() ||
        `Peer tutoring for ${offerName.trim()}.`,
    });

    setOfferName('');
    setOfferDesc('');
    setShowOfferSuggestions(false);
    setIsAddOfferOpen(false);
  };

  const handleSaveWant = (e: React.FormEvent) => {
    e.preventDefault();

    if (!wantName.trim()) return;

    addSkillWant({
      skillName: wantName.trim(),
      category: wantCategory,
      desiredLevel: 'Beginner',
    });

    setWantName('');
    setShowWantSuggestions(false);
    setIsAddWantOpen(false);
  };

  const selectOfferSkill = (skill: SkillCatalogItem) => {
    setOfferName(skill.name);
    setOfferCategory(skill.category);
    setShowOfferSuggestions(false);
  };

  const selectWantSkill = (skill: SkillCatalogItem) => {
    setWantName(skill.name);
    setWantCategory(skill.category);
    setShowWantSuggestions(false);
  };

  return (
    <div className="min-h-screen p-5 flex flex-col gap-6 bg-slate-950 pb-20 animate-fade-in">

      <div className="flex flex-col gap-1 pt-1">
        <h1 className="text-xl font-black text-slate-100">
          Manage My Skills
        </h1>

        <p className="text-xs text-slate-400">
          Add, edit, or remove your offered and desired skills
        </p>
      </div>

      {/* SKILLS I TEACH */}
      <div className="flex flex-col gap-3">

        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            Skills I Teach ({myOffers.length})
          </h2>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddOfferOpen(true)}
          >
            Add Taught Skill
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          {myOffers.length === 0 ? (
            <div className="text-center p-6 glass-card rounded-2xl text-xs text-slate-400">
              You haven't listed any skills you teach yet. Add one to start swapping!
            </div>
          ) : (
            myOffers.map((o) => (
              <div
                key={o.id}
                className="glass-card p-4 rounded-2xl border border-indigo-900/40 flex items-start justify-between gap-3"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">
                      {o.skillName}
                    </span>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-700">
                      {o.level}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400">
                    {o.category} • {o.availability}
                  </span>

                  <p className="text-xs text-slate-300 mt-1">
                    {o.description}
                  </p>
                </div>

                <button
                  onClick={() => deleteSkillOffer(o.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SKILLS I WANT */}
      <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">

        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4" />
            Skills I Want To Learn ({myWants.length})
          </h2>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddWantOpen(true)}
          >
            Add Desired Skill
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          {myWants.length === 0 ? (
            <div className="text-center p-6 glass-card rounded-2xl text-xs text-slate-400">
              No learning goals added yet.
            </div>
          ) : (
            myWants.map((w) => (
              <div
                key={w.id}
                className="glass-card p-4 rounded-2xl border border-cyan-900/40 flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-slate-100 text-sm">
                    {w.skillName}
                  </span>

                  <span className="text-xs text-slate-400">
                    {w.category}
                  </span>
                </div>

                <button
                  onClick={() => deleteSkillWant(w.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ADD TAUGHT SKILL */}
      <Modal
        isOpen={isAddOfferOpen}
        onClose={() => {
          setIsAddOfferOpen(false);
          setShowOfferSuggestions(false);
        }}
        title="Add Taught Skill"
      >
        <form
          onSubmit={handleSaveOffer}
          className="flex flex-col gap-4"
        >

          <div className="relative">
            <Input
              label="Skill Name"
              placeholder="Search a skill..."
              value={offerName}
              onChange={(e) => {
                setOfferName(e.target.value);
                setShowOfferSuggestions(true);
              }}
              onFocus={() => setShowOfferSuggestions(true)}
              autoComplete="off"
            />

            {showOfferSuggestions && offerSuggestions.length > 0 && (
              <div className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">

                {offerSuggestions.map((skill) => (
                  <button
                    key={`${skill.category}-${skill.name}`}
                    type="button"
                    onClick={() => selectOfferSkill(skill)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-800 transition-colors border-b border-slate-800 last:border-b-0"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-100">
                        {skill.name}
                      </span>

                      <span className="text-[10px] text-slate-500">
                        {skill.category}
                      </span>
                    </div>

                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase">
              Category
            </label>

            <div className="relative">
              <select
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 text-xs appearance-none"
                value={offerCategory}
                onChange={(e) => {
                  setOfferCategory(e.target.value as SkillCategory);
                  setShowOfferSuggestions(true);
                }}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase">
              Skill Level
            </label>

            <select
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 text-xs"
              value={offerLevel}
              onChange={(e) =>
                setOfferLevel(e.target.value as SkillLevel)
              }
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <Input
            label="Availability"
            placeholder="e.g. Weekends after 5 PM"
            value={offerAvailability}
            onChange={(e) =>
              setOfferAvailability(e.target.value)
            }
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase">
              Description
            </label>

            <textarea
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 text-xs"
              placeholder="Describe what you will teach..."
              value={offerDesc}
              onChange={(e) => setOfferDesc(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
          >
            Save Offered Skill
          </Button>
        </form>
      </Modal>

      {/* ADD DESIRED SKILL */}
      <Modal
        isOpen={isAddWantOpen}
        onClose={() => {
          setIsAddWantOpen(false);
          setShowWantSuggestions(false);
        }}
        title="Add Desired Skill"
      >
        <form
          onSubmit={handleSaveWant}
          className="flex flex-col gap-4"
        >

          <div className="relative">
            <Input
              label="Skill You Want to Learn"
              placeholder="Search a skill..."
              value={wantName}
              onChange={(e) => {
                setWantName(e.target.value);
                setShowWantSuggestions(true);
              }}
              onFocus={() => setShowWantSuggestions(true)}
              autoComplete="off"
            />

            {showWantSuggestions && wantSuggestions.length > 0 && (
              <div className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">

                {wantSuggestions.map((skill) => (
                  <button
                    key={`${skill.category}-${skill.name}`}
                    type="button"
                    onClick={() => selectWantSkill(skill)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-800 transition-colors border-b border-slate-800 last:border-b-0"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-100">
                        {skill.name}
                      </span>

                      <span className="text-[10px] text-slate-500">
                        {skill.category}
                      </span>
                    </div>

                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase">
              Category
            </label>

            <div className="relative">
              <select
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 text-xs appearance-none"
                value={wantCategory}
                onChange={(e) => {
                  setWantCategory(e.target.value as SkillCategory);
                  setShowWantSuggestions(true);
                }}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
          >
            Save Desired Skill
          </Button>
        </form>
      </Modal>
    </div>
  );
};