import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'circle' | 'button';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'card' }) => {
  let baseStyles = "bg-amber-200/50 dark:bg-slate-800/80 animate-pulse border-2 border-[#1A1A1A]/20";
  
  if (variant === 'circle') {
    baseStyles += " rounded-full";
  } else if (variant === 'text') {
    baseStyles += " h-4 rounded-md w-full";
  } else if (variant === 'button') {
    baseStyles += " h-10 rounded-xl w-32";
  } else {
    baseStyles += " rounded-2xl";
  }

  return (
    <div className={`${baseStyles} ${className} relative overflow-hidden`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" />
    </div>
  );
};

export const QuestCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#FDFCF0] dark:bg-slate-900 border-3 border-[#1A1A1A] rounded-3xl p-6 shadow-[6px_6px_0px_0px_#1A1A1A] space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton variant="circle" className="w-12 h-12" />
        <Skeleton variant="button" className="w-24 h-6" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" className="w-3/4 h-6" />
        <Skeleton variant="text" className="w-full h-4" />
        <Skeleton variant="text" className="w-5/6 h-4" />
      </div>
      <div className="pt-2 flex items-center justify-between">
        <Skeleton variant="button" className="w-32 h-10" />
        <Skeleton variant="circle" className="w-10 h-10" />
      </div>
    </div>
  );
};

export const TutorChatSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-start gap-3">
        <Skeleton variant="circle" className="w-10 h-10 shrink-0" />
        <div className="space-y-2 flex-1 bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A]">
          <Skeleton variant="text" className="w-1/3 h-5" />
          <Skeleton variant="text" className="w-full h-4" />
          <Skeleton variant="text" className="w-4/5 h-4" />
          <Skeleton variant="text" className="w-2/3 h-4" />
        </div>
      </div>
      <div className="flex items-start gap-3 justify-end">
        <div className="space-y-2 w-2/3 bg-amber-100 dark:bg-slate-800 p-4 rounded-2xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A]">
          <Skeleton variant="text" className="w-full h-4" />
        </div>
      </div>
    </div>
  );
};
