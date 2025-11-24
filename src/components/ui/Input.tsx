import React from "react";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  wrapperClassName?: string; // allows external control of spacing/layout
  variant?: 'default' | 'soft';
  size?: 'md' | 'lg';
}


export default function Input({
  label,
  error,
  className,
  disabled,
  wrapperClassName,
  variant = 'default',
  size = 'md',
  ...props
}: InputProps) {
  const sizing = size === 'lg' ? 'px-4 py-3 text-base' : 'px-3 py-2 text-sm';
  const softBase = 'bg-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500';
  const defaultBase = 'border border-gray-300 rounded-lg';
  const base = variant === 'soft' ? softBase : defaultBase;

  // date input 디자인 개선: 아이콘 추가, padding 조정, 모바일/웹앱 환경 대응
  const isDate = props.type === 'date';

  return (
    <div className={`flex flex-col gap-1 relative ${wrapperClassName || ''}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={`${sizing} focus:outline-none transition-colors ${
          disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''
        } ${error ? 'ring-2 ring-red-400' : ''} ${base} ${className || ''} ${isDate ? 'pr-10' : ''}`}
        disabled={disabled}
        {...props}
        style={isDate ? { WebkitAppearance: 'none', appearance: 'none', background: 'none', position: 'relative' } : {}}
      />
      {/* 달력 아이콘 (date input일 때만) */}
      {isDate && (
        <span
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: '#2563eb',
            fontSize: '18px',
            opacity: disabled ? 0.4 : 1,
          }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <rect x="3" y="5" width="18" height="16" rx="4" fill="#fff" stroke="#2563eb" strokeWidth="1.5" />
            <path d="M7 3v4M17 3v4" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="7" y="11" width="2" height="2" rx="1" fill="#2563eb" />
            <rect x="11" y="11" width="2" height="2" rx="1" fill="#2563eb" />
            <rect x="15" y="11" width="2" height="2" rx="1" fill="#2563eb" />
          </svg>
        </span>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

