import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/common/Logo';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import {
  User,
  Mail,
  Lock,
  GraduationCap,
  ArrowRight,
  Search,
  Check,
} from 'lucide-react';

const KARNATAKA_ENGINEERING_COLLEGES = [
  'Acharya Institute of Technology',
  'ACS College of Engineering',
  'Adichunchanagiri Institute of Technology',
  'Atria Institute of Technology',
  'Bangalore Institute of Technology',
  'Bangalore University',
  'Bapuji Institute of Engineering and Technology',
  'BMS College of Engineering',
  'BMS Institute of Technology and Management',
  'BNM Institute of Technology',
  'Brindavan College of Engineering',
  'CMR Institute of Technology',
  'CMR University',
  'Christ University Faculty of Engineering',
  'Dayananda Sagar College of Engineering',
  'Dayananda Sagar University',
  'East West Institute of Technology',
  'Global Academy of Technology',
  'Government Engineering College, Chamarajanagar',
  'Government Engineering College, Hassan',
  'Government Engineering College, Haveri',
  'Government Engineering College, Ramanagara',
  'Government Engineering College, Raichur',
  'Government Engineering College, Kushalnagar',
  'HKBK College of Engineering',
  'JSS Academy of Technical Education',
  'JSS Science and Technology University',
  'KLE Technological University',
  'KLE Society Institute of Technology',
  'KLE Society’s KLE Institute of Technology',
  'Malnad College of Engineering',
  'M S Ramaiah Institute of Technology',
  'MS Ramaiah University of Applied Sciences',
  'Mangalore Institute of Technology and Engineering',
  'Manipal Institute of Technology',
  'Manipal University Jaipur',
  'New Horizon College of Engineering',
  'NIE Institute of Technology',
  'National Institute of Engineering, Mysuru',
  'Nitte Meenakshi Institute of Technology',
  'PES College of Engineering, Mandya',
  'PES University',
  'PES Institute of Technology and Management',
  'PES Institute of Technology',
  'Presidency University',
  'R V College of Engineering',
  'R V Institute of Technology and Management',
  'Rajarajeshwari College of Engineering',
  'Ramaiah Institute of Technology',
  'Reva University',
  'Sapthagiri College of Engineering',
  'SEA College of Engineering and Technology',
  'Siddaganga Institute of Technology',
  'Sir M Visvesvaraya Institute of Technology',
  'SJB Institute of Technology',
  'Sri Krishna Institute of Technology',
  'Sri Venkateshwara College of Engineering',
  'The National Institute of Engineering',
  'University Visvesvaraya College of Engineering',
  'University of Visvesvaraya College of Engineering',
  'Vemana Institute of Technology',
  'Vidyavardhaka College of Engineering',
  'Visvesvaraya Technological University',
  'Yenepoya Institute of Technology',
];

const normalize = (value: unknown) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ');

const compact = (value: unknown) =>
  normalize(value).replace(/\s+/g, '');

const acronym = (value: string) =>
  normalize(value)
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('');

const isSubsequence = (query: string, target: string) => {
  if (!query) return false;

  let index = 0;

  for (const character of target) {
    if (character === query[index]) {
      index++;

      if (index === query.length) {
        return true;
      }
    }
  }

  return false;
};

const getCollegeScore = (
  query: string,
  college: string
): number => {
  const q = normalize(query);
  const name = normalize(college);

  if (!q || !name) return 0;

  const cq = compact(q);
  const cn = compact(name);

  let score = 0;

  // Exact match
  if (name === q) score += 2000;

  // Exact compact match
  if (cn === cq) score += 1800;

  // College starts with query
  if (name.startsWith(q)) score += 1200;

  // Compact name starts with query
  if (cn.startsWith(cq)) score += 1100;

  // Any word starts with query
  if (
    name
      .split(/\s+/)
      .some((word) => word.startsWith(q))
  ) {
    score += 950;
  }

  // Query occurs anywhere
  if (name.includes(q)) score += 800;

  // Compact query occurs anywhere
  if (cn.includes(cq)) score += 700;

  // Acronym matching
  const collegeAcronym = acronym(college);

  if (collegeAcronym === cq) {
    score += 1400;
  }

  if (collegeAcronym.startsWith(cq)) {
    score += 1000;
  }

  // Flexible character matching
  if (isSubsequence(cq, cn)) {
    score += 350;
  }

  return score;
};

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
  const [collegeSearch, setCollegeSearch] = useState(
    'RV College of Engineering'
  );
  const [showCollegeSuggestions, setShowCollegeSuggestions] =
    useState(false);

  const collegeSuggestions = useMemo(() => {
    const query = normalize(collegeSearch);

    if (!query) {
      return KARNATAKA_ENGINEERING_COLLEGES.slice(0, 15);
    }

    return KARNATAKA_ENGINEERING_COLLEGES
      .map((college) => ({
        college,
        score: getCollegeScore(query, college),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        return a.college.localeCompare(b.college);
      })
      .slice(0, 15)
      .map((item) => item.college);
  }, [collegeSearch]);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    }

    if (
      !formData.email.trim() ||
      !formData.email.includes('@')
    ) {
      errs.email = 'Valid college email is required';
    }

    if (
      !formData.password ||
      formData.password.length < 6
    ) {
      errs.password =
        'Password must be at least 6 characters';
    }

    if (
      formData.password !== formData.confirmPassword
    ) {
      errs.confirmPassword =
        'Passwords do not match';
    }

    if (!formData.college.trim()) {
      errs.college = 'Please select your college';
    }

    if (!formData.agreed) {
      errs.agreed =
        'You must agree to Terms & Privacy';
    }

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const selectCollege = (college: string) => {
    setCollegeSearch(college);

    setFormData({
      ...formData,
      college,
    });

    setShowCollegeSuggestions(false);

    setErrors((previous) => ({
      ...previous,
      college: '',
    }));
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

        <h2 className="text-xl font-black text-slate-100 mt-2">
          Join SkillSwap
        </h2>

        <p className="text-xs text-slate-400">
          Connect with students and swap knowledge
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3.5 my-auto glass-card p-5 rounded-3xl border border-slate-800 shadow-2xl"
      >

        <Input
          label="Full Name"
          placeholder="e.g. Ananya Rao"
          leftIcon={
            <User className="w-4 h-4 text-indigo-400" />
          }
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
          error={errors.name}
        />

        <Input
          label="College Email"
          type="email"
          placeholder="ananya.r@bmsce.ac.in"
          leftIcon={
            <Mail className="w-4 h-4 text-indigo-400" />
          }
          value={formData.email}
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value,
            })
          }
          error={errors.email}
        />

        <div className="grid grid-cols-2 gap-2">

          <Input
            label="Password"
            isPassword
            placeholder="••••••••"
            leftIcon={
              <Lock className="w-4 h-4 text-indigo-400" />
            }
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            isPassword
            placeholder="••••••••"
            leftIcon={
              <Lock className="w-4 h-4 text-indigo-400" />
            }
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({
                ...formData,
                confirmPassword: e.target.value,
              })
            }
            error={errors.confirmPassword}
          />

        </div>

        {/* COLLEGE SMART SEARCH */}
        <div className="flex flex-col gap-1.5">

          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
            College / Institution
          </label>

          <div className="relative">

            <GraduationCap className="absolute left-3.5 top-3.5 w-4 h-4 text-indigo-400 z-10" />

            <input
              type="text"
              value={collegeSearch}
              placeholder="Search Karnataka engineering college..."
              autoComplete="off"
              onFocus={() => {
                setShowCollegeSuggestions(true);
              }}
              onChange={(e) => {
                const value = e.target.value;

                setCollegeSearch(value);

                setFormData({
                  ...formData,
                  college: value,
                });

                setShowCollegeSuggestions(true);

                setErrors((previous) => ({
                  ...previous,
                  college: '',
                }));
              }}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />

            <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500" />

            {showCollegeSuggestions &&
              collegeSuggestions.length > 0 && (
                <div className="absolute z-50 left-0 right-0 mt-1 max-h-64 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">

                  {collegeSuggestions.map((college) => (
                    <button
                      key={college}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectCollege(college);
                      }}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left border-b border-slate-800 last:border-b-0 hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">

                        <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />

                        <span className="text-xs text-slate-100">
                          {college}
                        </span>

                      </div>

                      {formData.college === college && (
                        <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                      )}
                    </button>
                  ))}

                </div>
              )}

            {showCollegeSuggestions &&
              collegeSearch.trim() &&
              collegeSuggestions.length === 0 && (
                <div className="absolute z-50 left-0 right-0 mt-1 rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-2xl">
                  <p className="text-xs text-slate-400 text-center">
                    No matching Karnataka engineering college found.
                  </p>
                </div>
              )}

          </div>

          {errors.college && (
            <span className="text-xs text-rose-400">
              {errors.college}
            </span>
          )}

        </div>

        {/* DEPARTMENT + SEMESTER */}
        <div className="grid grid-cols-2 gap-2">

          <div className="flex flex-col gap-1.5">

            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
              Department
            </label>

            <select
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-3 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              value={formData.department}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  department: e.target.value,
                })
              }
            >
              <option value="Computer Science & Eng">
                Computer Science
              </option>

              <option value="Information Science">
                Information Science
              </option>

              <option value="Electronics & Comm">
                Electronics & Comm
              </option>

              <option value="Mechanical Eng">
                Mechanical Eng
              </option>

              <option value="Business Admin">
                Business Admin
              </option>
            </select>

          </div>

          <div className="flex flex-col gap-1.5">

            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
              Semester
            </label>

            <select
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-3 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              value={formData.semester}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  semester: e.target.value,
                })
              }
            >
              <option value="1st Sem">1st Sem</option>
              <option value="3rd Sem">3rd Sem</option>
              <option value="5th Sem">5th Sem</option>
              <option value="7th Sem">7th Sem</option>
            </select>

          </div>

        </div>

        {/* AGREEMENT */}
        <label className="flex items-center gap-2 text-xs text-slate-300 mt-1 cursor-pointer">

          <input
            type="checkbox"
            checked={formData.agreed}
            onChange={(e) =>
              setFormData({
                ...formData,
                agreed: e.target.checked,
              })
            }
            className="rounded border-slate-700 bg-slate-900 text-indigo-500"
          />

          <span>
            I agree to SkillSwap Terms & Campus Code of Conduct
          </span>

        </label>

        {errors.agreed && (
          <span className="text-xs text-rose-400">
            {errors.agreed}
          </span>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          rightIcon={
            <ArrowRight className="w-4 h-4" />
          }
          className="mt-2"
        >
          Create Account & Setup Profile
        </Button>

      </form>

      <div className="text-center text-xs text-slate-400 pb-2">

        Already have an account?{' '}

        <button
          type="button"
          onClick={() => navigate('LOGIN')}
          className="font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
        >
          Sign In
        </button>

      </div>

    </div>
  );
};