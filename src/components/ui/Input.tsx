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
  // Soft variant: borderless rounded gray surface, keep same bg on focus for stability
  const softBase = 'bg-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500';
  const defaultBase = 'border border-gray-300 rounded-lg';
  const base = variant === 'soft' ? softBase : defaultBase;
  return (
    <div className={`flex flex-col gap-1 ${wrapperClassName || ''}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={`${sizing} focus:outline-none transition-colors ${
          disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''
        } ${error ? 'ring-2 ring-red-400' : ''} ${base} ${className || ''}`}
        disabled={disabled}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

