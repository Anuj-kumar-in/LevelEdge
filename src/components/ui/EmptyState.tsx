import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onActionClick?: () => void;
  actionText?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = 'No Data Found',
  description = 'Try adjusting your search query or filters to discover relevant salary submissions.',
  onActionClick,
  actionText = 'Reset Filters',
  icon = <AlertCircle className="text-slate-400 h-10 w-10" />
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center glass-card border-dashed border-2 border-slate-200 bg-slate-50/50">
      
      {/* Icon Wrapper */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4 shadow-inner">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-navy mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {/* Clear/Reset Action Button */}
      {onActionClick && (
        <button
          onClick={onActionClick}
          className="btn-secondary text-xs flex items-center gap-1.5 shadow-sm hover:shadow"
        >
          <RefreshCw size={13} />
          <span>{actionText}</span>
        </button>
      )}

    </div>
  );
}
