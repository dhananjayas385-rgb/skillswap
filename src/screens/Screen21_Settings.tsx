import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Logo } from '../components/common/Logo';
import {
  User,
  Shield,
  Bell,
  Lock,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

export const Screen21_Settings: React.FC = () => {
  const { currentUser, logout, navigate, resetToDemoState, showToast } = useApp();

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Preference Toggles
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [showEmailOnProfile, setShowEmailOnProfile] = useState(false);

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }
    showToast('Password updated successfully!');
    setIsPasswordOpen(false);
    setOldPass('');
    setNewPass('');
  };

  return (
    <div className="min-h-screen p-5 flex flex-col justify-between bg-slate-950 pb-20 animate-fade-in gap-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1 pt-1">
          <h1 className="text-xl font-black text-slate-100">Settings & Preferences</h1>
          <p className="text-xs text-slate-400">Manage account security, notifications, and app options</p>
        </div>

        {/* Account Summary Banner */}
        <div
          onClick={() => navigate('PROFILE_SETUP')}
          className="glass-card p-4 rounded-3xl border border-slate-800 flex items-center justify-between cursor-pointer hover:border-indigo-500/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-12 h-12 rounded-2xl object-cover border border-indigo-500/40"
            />
            <div className="flex flex-col">
              <span className="font-bold text-slate-100 text-sm">{currentUser?.name}</span>
              <span className="text-xs text-slate-400">{currentUser?.email}</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500" />
        </div>

        {/* Setting Groups */}
        <div className="flex flex-col gap-4">
          {/* Notifications Section */}
          <div className="glass-card p-4 rounded-3xl border border-slate-800 flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-indigo-400" /> Notification Preferences
            </span>

            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800">
              <span className="text-slate-300">Push Notifications for Requests</span>
              <input
                type="checkbox"
                checked={pushNotifs}
                onChange={() => setPushNotifs(!pushNotifs)}
                className="w-4 h-4 rounded text-indigo-500 bg-slate-900 border-slate-700"
              />
            </div>

            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-slate-300">Email Summaries & Reminders</span>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={() => setEmailNotifs(!emailNotifs)}
                className="w-4 h-4 rounded text-indigo-500 bg-slate-900 border-slate-700"
              />
            </div>
          </div>

          {/* Account Security */}
          <div className="glass-card p-4 rounded-3xl border border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Shield className="w-4 h-4 text-cyan-400" /> Security & Privacy
            </span>

            <button
              onClick={() => setIsPasswordOpen(true)}
              className="flex items-center justify-between text-xs text-slate-300 p-2.5 rounded-xl hover:bg-slate-900 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400" /> Change Password
              </span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            <div className="flex items-center justify-between text-xs p-2.5">
              <span className="text-slate-300">Show Email on Public Profile</span>
              <input
                type="checkbox"
                checked={showEmailOnProfile}
                onChange={() => setShowEmailOnProfile(!showEmailOnProfile)}
                className="w-4 h-4 rounded text-indigo-500 bg-slate-900 border-slate-700"
              />
            </div>
          </div>

          {/* Support & About */}
          <div className="glass-card p-4 rounded-3xl border border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => setIsHelpOpen(true)}
              className="flex items-center justify-between text-xs text-slate-300 p-2.5 rounded-xl hover:bg-slate-900 transition-colors"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" /> Help & Student Support
              </span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => setIsAboutOpen(true)}
              className="flex items-center justify-between text-xs text-slate-300 p-2.5 rounded-xl hover:bg-slate-900 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-400" /> About SkillSwap App
              </span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Reset Demo State Button */}
          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={resetToDemoState}
            className="text-cyan-400 hover:text-cyan-300"
          >
            Reset App Demo Data
          </Button>

          {/* Logout Button */}
          <Button
            variant="danger"
            size="lg"
            fullWidth
            leftIcon={<LogOut className="w-5 h-5" />}
            onClick={() => setIsLogoutOpen(true)}
          >
            Log Out of SkillSwap
          </Button>
        </div>
      </div>

      {/* Modal 1: Change Password */}
      <Modal isOpen={isPasswordOpen} onClose={() => setIsPasswordOpen(false)} title="Change Password">
        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-300">Current Password</label>
            <input
              type="password"
              className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-100"
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-300">New Password</label>
            <input
              type="password"
              className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-100"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" size="lg" fullWidth>
            Update Password
          </Button>
        </form>
      </Modal>

      {/* Modal 2: Help & Support */}
      <Modal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} title="Help & Support">
        <div className="flex flex-col gap-3 text-xs text-slate-300">
          <p>
            Welcome to SkillSwap Student Support! If you encounter issues with requests, chats, or peer exchanges:
          </p>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
            <strong className="text-indigo-300">Campus Coordinator Email:</strong>
            <span>support@skillswap.edu.in</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
            <strong className="text-cyan-300">Emergency Safety Line:</strong>
            <span>+91 98765 43210 (24/7 Student Safety Desk)</span>
          </div>
        </div>
      </Modal>

      {/* Modal 3: About SkillSwap */}
      <Modal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} title="About SkillSwap">
        <div className="flex flex-col items-center text-center gap-3">
          <Logo size="md" showTagline />
          <span className="text-xs text-slate-400">Version 1.0.0 (Production Release)</span>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            SkillSwap is a peer-to-peer campus exchange platform designed to help college students trade skills, master new technologies, and build reciprocal learning networks.
          </p>
        </div>
      </Modal>

      {/* Modal 4: Logout Confirmation */}
      <Modal isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} title="Confirm Logout">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-xs text-slate-300">
            Are you sure you want to log out of your SkillSwap account?
          </p>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="md" fullWidth onClick={() => setIsLogoutOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="md" fullWidth onClick={logout}>
              Yes, Log Out
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
