import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { SkillChip } from '../components/common/SkillChip';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { Plus, Edit2, Trash2, Sparkles, BookOpen, HeartHandshake } from 'lucide-react';
import { SkillLevel, SkillCategory } from '../types';

export const Screen17_MySkills: React.FC = () => {
  const {
    skillOffers,
    skillWants,
    currentUser,
    addSkillOffer,
    editSkillOffer,
    deleteSkillOffer,
    addSkillWant,
    deleteSkillWant,
  } = useApp();

  const myOffers = skillOffers.filter((o) => o.userId === currentUser?.id);
  const myWants = skillWants.filter((w) => w.userId === currentUser?.id);

  // Modal State
  const [isAddOfferOpen, setIsAddOfferOpen] = useState(false);
  const [isAddWantOpen, setIsAddWantOpen] = useState(false);

  // Form states
  const [offerName, setOfferName] = useState('');
  const [offerCategory, setOfferCategory] = useState<SkillCategory>('Programming');
  const [offerLevel, setOfferLevel] = useState<SkillLevel>('Intermediate');
  const [offerAvailability, setOfferAvailability] = useState('Weekends & Evenings');
  const [offerDesc, setOfferDesc] = useState('');

  const [wantName, setWantName] = useState('');
  const [wantCategory, setWantCategory] = useState<SkillCategory>('Design');

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

  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerName.trim()) return;
    addSkillOffer({
      skillName: offerName.trim(),
      category: offerCategory,
      level: offerLevel,
      availability: offerAvailability,
      experience: `${offerLevel} level`,
      description: offerDesc || `Peer tutoring for ${offerName.trim()}.`,
    });
    setOfferName('');
    setOfferDesc('');
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
    setIsAddWantOpen(false);
  };

  return (
    <div className="min-h-screen p-5 flex flex-col gap-6 bg-slate-950 pb-20 animate-fade-in">
      <div className="flex flex-col gap-1 pt-1">
        <h1 className="text-xl font-black text-slate-100">Manage My Skills</h1>
        <p className="text-xs text-slate-400">Add, edit, or remove your offered and desired skills</p>
      </div>

      {/* Section 1: Skills I Teach */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Skills I Teach ({myOffers.length})
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
                    <span className="font-bold text-slate-100 text-sm">{o.skillName}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-700">
                      {o.level}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{o.category} • {o.availability}</span>
                  <p className="text-xs text-slate-300 mt-1">{o.description}</p>
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

      {/* Section 2: Skills I Want to Learn */}
      <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4" /> Skills I Want To Learn ({myWants.length})
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
                  <span className="font-bold text-slate-100 text-sm">{w.skillName}</span>
                  <span className="text-xs text-slate-400">{w.category}</span>
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

      {/* Modal 1: Add Taught Skill */}
      <Modal isOpen={isAddOfferOpen} onClose={() => setIsAddOfferOpen(false)} title="Add Taught Skill">
        <form onSubmit={handleSaveOffer} className="flex flex-col gap-4">
          <Input
            label="Skill Name"
            placeholder="e.g. Python Programming, Figma"
            value={offerName}
            onChange={(e) => setOfferName(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase">Category</label>
            <select
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 text-xs"
              value={offerCategory}
              onChange={(e) => setOfferCategory(e.target.value as SkillCategory)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase">Skill Level</label>
            <select
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 text-xs"
              value={offerLevel}
              onChange={(e) => setOfferLevel(e.target.value as SkillLevel)}
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
            onChange={(e) => setOfferAvailability(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase">Description</label>
            <textarea
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 text-xs"
              placeholder="Describe what you will teach..."
              value={offerDesc}
              onChange={(e) => setOfferDesc(e.target.value)}
            />
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth>
            Save Offered Skill
          </Button>
        </form>
      </Modal>

      {/* Modal 2: Add Desired Skill */}
      <Modal isOpen={isAddWantOpen} onClose={() => setIsAddWantOpen(false)} title="Add Desired Skill">
        <form onSubmit={handleSaveWant} className="flex flex-col gap-4">
          <Input
            label="Skill You Want to Learn"
            placeholder="e.g. UI/UX Design, Guitar"
            value={wantName}
            onChange={(e) => setWantName(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase">Category</label>
            <select
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 text-xs"
              value={wantCategory}
              onChange={(e) => setWantCategory(e.target.value as SkillCategory)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth>
            Save Desired Skill
          </Button>
        </form>
      </Modal>
    </div>
  );
};
