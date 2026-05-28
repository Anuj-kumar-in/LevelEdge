import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
  height?: string;
  width?: string;
}

export default function Skeleton({
  className = '',
  variant = 'rect',
  height,
  width
}: SkeletonProps) {
  const variants = {
    text: 'h-4 w-3/4 rounded',
    rect: 'rounded-md',
    circle: 'rounded-full'
  };

  const style: React.CSSProperties = {};
  if (height) style.height = height;
  if (width) style.width = width;

  return (
    <div
      style={style}
      className={`shimmer bg-slate-200 ${variants[variant]} ${className}`}
    />
  );
}
