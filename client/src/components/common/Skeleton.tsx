import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 dark:bg-slate-700/60 rounded-lg ${className}`}
    />
  );
};

export const PostSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#1d2226] rounded-lg p-5 border border-[#e0dfdc] dark:border-[#383b40] shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-48 h-3" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-5/6 h-4" />
        <Skeleton className="w-3/4 h-4" />
      </div>
      <Skeleton className="w-full h-48 rounded-xl" />
      <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-[#383b40]">
        <Skeleton className="w-20 h-8 rounded-full" />
        <Skeleton className="w-20 h-8 rounded-full" />
        <Skeleton className="w-20 h-8 rounded-full" />
      </div>
    </div>
  );
};
