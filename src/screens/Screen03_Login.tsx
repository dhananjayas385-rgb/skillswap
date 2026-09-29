import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/common/Logo';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Mail, Lock, LogIn, Sparkles, UserCheck } from 'lucide-react';

export const Screen03_Login: React.FC = () => {
  const { login, navigate, users } = useApp();
  const [email, setEmail] = useState('rahul.s@rvce.edu.in');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid college email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const success = login(email, password);
      setIsLoading(false);
      if (!success) {
        setError('Invalid email or password. Please try again.');
      }
    }, 600);
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    login(demoEmail, 'password123');
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between p-6 bg-slate-950 animate-fade-in relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Logo */}
      <div className="flex flex-col items-center pt-4 gap-2">
        <Logo size="lg" showTagline />
        <h2 className="text-xl font-bold text-slate-100 mt-2">Welcome Back!</h2>
        <p className="text-xs text-slate-400">Sign in to exchange skills with campus peers</p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 my-auto glass-card p-6 rounded-3xl border border-slate-800 shadow-2xl">
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-semibold animate-slide-up">
            {error}
          </div>
        )}

        <Input
          label="College Email"
          type="email"
          placeholder="student@college.edu.in"
          leftIcon={<Mail className="w-4 h-4 text-indigo-400" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          isPassword
          placeholder="••••••••"
          leftIcon={<Lock className="w-4 h-4 text-indigo-400" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500/30" />
            <span>Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => alert('Password reset link sent to your college email!')}
            className="text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Forgot Password?
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          rightIcon={<LogIn className="w-4 h-4" />}
          className="mt-2"
        >
          Sign In
        </Button>

        {/* Quick Demo Selector */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center flex items-center justify-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> Demo Quick Logins:
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {users.slice(0, 3).map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleDemoLogin(u.email)}
                className="px-2 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-indigo-300 truncate transition-colors"
              >
                {u.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Footer Switch to Register */}
      <div className="text-center text-xs text-slate-400 pb-2">
        Don't have a SkillSwap profile yet?{' '}
        <button
          onClick={() => navigate('SIGNUP')}
          className="font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
        >
          Create Account
        </button>
      </div>
    </div>
  );
};
