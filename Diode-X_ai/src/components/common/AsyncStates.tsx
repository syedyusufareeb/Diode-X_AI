import React from 'react';
import { AlertCircle, RefreshCw, Database } from 'lucide-react';

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 bg-slate-200/70 rounded-xl w-full" />
      ))}
    </div>
  );
};

export const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({
  message,
  onRetry
}) => {
  return (
    <div className="p-8 text-center glass-card rounded-2xl border border-rose-200/80 my-4">
      <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-slate-800">Connection Disrupted</h4>
      <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Connection
        </button>
      )}
    </div>
  );
};

export const EmptyState: React.FC<{ title: string; message: string }> = ({ title, message }) => {
  return (
    <div className="p-8 text-center glass-card rounded-2xl border border-slate-200 my-4">
      <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400 mb-3">
        <Database className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-slate-700">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">{message}</p>
    </div>
  );
};
