import React from 'react';
import clsx from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  hoverEffect?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  title,
  subtitle,
  icon,
  headerAction,
  hoverEffect = false,
  padding = 'md'
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8'
  }[padding];

  return (
    <div
      className={clsx(
        'glass-card rounded-2xl relative overflow-hidden transition-all duration-200',
        hoverEffect && 'glass-card-hover',
        paddingClasses,
        className
      )}
    >
      {(title || subtitle || icon || headerAction) && (
        <div className="flex items-start justify-between gap-4 mb-4 pb-1 border-b border-slate-100/80">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-9 h-9 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                {icon}
              </div>
            )}
            <div>
              {title && <h3 className="font-semibold text-slate-800 text-base tracking-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-500 font-normal mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
