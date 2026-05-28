import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'gray';
  className?: string;
  size?: 'sm' | 'md';
}

export default function Badge({
  children,
  variant = 'gray',
  className = '',
  size = 'md'
}: BadgeProps) {
  const variants = {
    primary: 'bg-sky-blue/10 text-sky-blue border border-sky-blue/20',
    secondary: 'bg-navy/5 text-navy border border-navy/10',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    info: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
    gray: 'bg-slate-100 text-slate-700 border border-slate-200'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] font-bold tracking-wider',
    md: 'px-2.5 py-1 text-xs font-semibold'
  };

  return (
    <span className={`inline-flex items-center rounded-full uppercase ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
