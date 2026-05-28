import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  className = '',
  onClick,
  hoverable = true,
  padding = 'md'
}: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const cursorClass = onClick ? 'cursor-pointer' : '';
  const hoverClass = hoverable 
    ? 'hover:translate-y-[-2px] hover:shadow-[0_15px_35px_rgba(0,47,86,0.06)] hover:border-slate-300' 
    : '';

  return (
    <div
      onClick={onClick}
      className={`glass-card bg-white/95 rounded-xl border border-slate-200/80 shadow-[0_10px_30px_rgba(0,47,86,0.02)] transition-all duration-300 ${paddings[padding]} ${cursorClass} ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
}
