import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/common/Logo';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { User, Mail, Lock, GraduationCap, Building, Calendar, ArrowRight } from 'lucide-react';

export const Screen04_Signup: React.FC = () => {
  const { signup, navigate } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: 'RV College of Engineering',
    department: 'Computer Science & Eng',
    semester: '5th Sem',
    agreed: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@'))
      errs.email = 'Valid college email is required';
    if (!formData.password || formData.password.length < 6)
      errs.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    if (!formData.agreed) errs.agreed = 'You must agree to Terms & Privacy';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        college: formData.college,
        department: formData.department,
        semester: formData.semester,
      });
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between p-6 bg-slate-950 animate-fade-in relative overflow-hidden">
      <div className="flex flex-col items-center pt-2 gap-1 text-center">
        <Logo size="md" />
        <h2 className="text-xl font-black text-slate-100 mt-2">Join SkillSwap</h2>
        <p className="text-xs text-slate-400">Connect with students and swap knowledge</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 my-auto glass-card p-5 rounded-3xl border border-slate-800 shadow-2xl">
        <Input
          label="Full Name"
          placeholder="e.g. Ananya Rao"
          leftIcon={<User className="w-4 h-4 text-indigo-400" />}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
        />

        <Input
          label="College Email"
          type="email"
          placeholder="ananya.r@bmsce.ac.in"
          leftIcon={<Mail className="w-4 h-4 text-indigo-400" />}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />

        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Password"
            isPassword
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4 text-indigo-400" />}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            isPassword
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4 text-indigo-400" />}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
          />
        </div>

        {/* College & Dept */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
            College / Institution
          </label>
          <div className="relative">
            <GraduationCap className="absolute left-3.5 top-3.5 w-4 h-4 text-indigo-400" />
            <select
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
            >
              <option value="RV College of Engineering">RV College of Engineering</option>
              <option value="BMS College of Engineering">BMS College of Engineering</option>
              <option value="MS Ramaiah Inst of Tech">MS Ramaiah Inst of Tech</option>
              <option value="PES University">PES University</option>
              <option value="IIT Bangalore">IIT Bangalore</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
              Department
            </label>
            <select
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-3 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              <option value="Computer Science & Eng">Computer Science</option>
              <option value="Information Science">Information Science</option>
              <option value="Electronics & Comm">Electronics & Comm</option>
              <option value="Mechanical Eng">Mechanical Eng</option>
              <option value="Business Admin">Business Admin</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
              Semester
            </label>
            <select
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-3 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
            >
              <option value="1st Sem">1st Sem</option>
              <option value="3rd Sem">3rd Sem</option>
              <option value="5th Sem">5th Sem</option>
              <option value="7th Sem">7th Sem</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-300 mt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreed}
            onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
            className="rounded border-slate-700 bg-slate-900 text-indigo-500"
          />
          <span>I agree to SkillSwap Terms & Campus Code of Conduct</span>
        </label>
        {errors.agreed && <span className="text-xs text-rose-400">{errors.agreed}</span>}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="mt-2"
        >
          Create Account & Setup Profile
        </Button>
      </form>

      <div className="text-center text-xs text-slate-400 pb-2">
        Already have an account?{' '}
        <button
          onClick={() => navigate('LOGIN')}
          className="font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};
