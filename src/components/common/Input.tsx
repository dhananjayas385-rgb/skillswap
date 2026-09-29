import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  isPassword = false,
  className = '',
  type = 'text',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
            {leftIcon}
          </div>
        )}
        <input
          type={inputType}
          className={`w-full bg-slate-900/80 border ${
            error
              ? 'border-rose-500/80 focus:ring-rose-500/50'
              : 'border-slate-700/80 focus:border-indigo-500 focus:ring-indigo-500/40'
          } text-slate-100 placeholder-slate-500 rounded-xl ${
            leftIcon ? 'pl-10' : 'pl-4'
          } ${
            isPassword || rightIcon ? 'pr-10' : 'pr-4'
          } py-3 text-sm transition-all focus:outline-none focus:ring-2 shadow-inner ${className}`}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-slate-400 hover:text-slate-200 focus:outline-none p-1"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        ) : (
          rightIcon && <div className="absolute right-3.5 text-slate-400">{rightIcon}</div>
        )}
      </div>
      {error && <span className="text-xs text-rose-400 font-medium pl-1">{error}</span>}
    </div>
  );
};
