import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { SkillChip } from '../components/common/SkillChip';
import { Input } from '../components/common/Input';
import { User, Sparkles, Plus, CheckCircle, Camera } from 'lucide-react';
import { SkillLevel, SkillCategory } from '../types';

export const Screen05_ProfileSetup: React.FC = () => {
  const { currentUser, updateProfile, addSkillOffer, addSkillWant, navigate, skillOffers, skillWants } =
    useApp();

  const [bio, setBio] = useState(
    currentUser?.bio || 'Passionate student eager to learn and share skills across campus!'
  );
  const [availability, setAvailability] = useState(
    currentUser?.availability || 'Weekends & Evenings'
  );

  // New Taught Skill state
  const [teachName, setTeachName] = useState('');
  const [teachCategory, setTeachCategory] = useState<SkillCategory>('Programming');
  const [teachLevel, setTeachLevel] = useState<SkillLevel>('Intermediate');

  // New Wanted Skill state
  const [wantName, setWantName] = useState('');
  const [wantCategory, setWantCategory] = useState<SkillCategory>('Design');

  const myOffers = skillOffers.filter((o) => o.userId === currentUser?.id);
  const myWants = skillWants.filter((w) => w.userId === currentUser?.id);

  const handleAddTeach = () => {
    if (!teachName.trim()) return;
    addSkillOffer({
      skillName: teachName.trim(),
      category: teachCategory,
      level: teachLevel,
      availability,
      experience: `${teachLevel} level experience`,
      description: `I offer peer tutoring for ${teachName.trim()}.`,
    });
    setTeachName('');
  };

  const handleAddWant = () => {
    if (!wantName.trim()) return;
    addSkillWant({
      skillName: wantName.trim(),
      category: wantCategory,
      desiredLevel: 'Beginner',
    });
    setWantName('');
  };

  const handleFinish = () => {
    updateProfile({ bio, availability });
    navigate('HOME');
  };

  const avatars = [
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
  ];

  return (
    <div className="min-h-[85vh] p-5 flex flex-col gap-5 bg-slate-950 animate-fade-in pb-12">
      <div className="flex flex-col gap-1 text-center pt-2">
        <h2 className="text-xl font-black text-slate-100">Set Up Your Profile</h2>
        <p className="text-xs text-slate-400">
          Tell peers what skills you bring to the exchange & what you want to master
        </p>
      </div>

      {/* Avatar Picker */}
      <div className="glass-card p-4 rounded-3xl border border-slate-800 flex flex-col items-center gap-3 text-center">
        <div className="relative">
          <img
            src={currentUser?.avatar || avatars[0]}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border-4 border-indigo-500 shadow-xl"
          />
          <button className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 text-white shadow-lg border border-indigo-400">
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
        <span className="text-xs font-semibold text-slate-300">Choose Profile Picture</span>
        <div className="flex items-center gap-3">
          {avatars.map((url, i) => (
            <img
              key={i}
              src={url}
              alt="Avatar option"
              onClick={() => updateProfile({ avatar: url })}
              className={`w-10 h-10 rounded-full object-cover cursor-pointer border-2 transition-all ${
                currentUser?.avatar === url ? 'border-indigo-400 scale-110 shadow-lg' : 'border-slate-700 opacity-60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bio & Availability */}
      <div className="glass-card p-5 rounded-3xl border border-slate-800 flex flex-col gap-3">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Short Bio</label>
        <textarea
          rows={2}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          placeholder="Briefly describe yourself and your tech/creative interests..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <Input
          label="Your Availability"
          placeholder="e.g. Weekends after 4 PM"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        />
      </div>

      {/* Skills I Can Teach */}
      <div className="glass-card p-5 rounded-3xl border border-indigo-900/50 bg-indigo-950/20 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Skills I Can Teach
          </span>
          <span className="text-[11px] text-slate-400">{myOffers.length} added</span>
        </div>

        <div className="flex flex-wrap gap-2 min-h-[36px] bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          {myOffers.length === 0 ? (
            <span className="text-xs text-slate-500 italic">No skills added yet</span>
          ) : (
            myOffers.map((o) => (
              <SkillChip
                key={o.id}
                name={o.skillName}
                level={o.level}
                variant="teach"
              />
            ))
          )}
        </div>

        {/* Add Skill Row */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Skill (e.g. Python, Figma)"
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
              value={teachName}
              onChange={(e) => setTeachName(e.target.value)}
            />
            <select
              className="bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-100"
              value={teachLevel}
              onChange={(e) => setTeachLevel(e.target.value as SkillLevel)}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <Button variant="secondary" size="sm" onClick={handleAddTeach} leftIcon={<Plus className="w-4 h-4" />}>
            Add Taught Skill
          </Button>
        </div>
      </div>

      {/* Skills I Want to Learn */}
      <div className="glass-card p-5 rounded-3xl border border-cyan-900/50 bg-cyan-950/20 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Skills I Want To Learn
          </span>
          <span className="text-[11px] text-slate-400">{myWants.length} added</span>
        </div>

        <div className="flex flex-wrap gap-2 min-h-[36px] bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          {myWants.length === 0 ? (
            <span className="text-xs text-slate-500 italic">No desired skills added yet</span>
          ) : (
            myWants.map((w) => (
              <SkillChip
                key={w.id}
                name={w.skillName}
                variant="want"
              />
            ))
          )}
        </div>

        <div className="flex gap-2 pt-2 border-t border-slate-800">
          <input
            type="text"
            placeholder="Skill (e.g. UI/UX, Public Speaking)"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
            value={wantName}
            onChange={(e) => setWantName(e.target.value)}
          />
          <Button variant="secondary" size="sm" onClick={handleAddWant} leftIcon={<Plus className="w-4 h-4" />}>
            Add Want
          </Button>
        </div>
      </div>

      {/* Complete Button */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleFinish}
        rightIcon={<CheckCircle className="w-5 h-5" />}
        className="mt-2"
      >
        Complete Profile & Enter Dashboard
      </Button>
    </div>
  );
};
