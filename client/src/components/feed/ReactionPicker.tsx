import React from 'react';
import { ReactionType } from '../../types';

interface ReactionPickerProps {
  currentReaction?: ReactionType | null;
  onSelectReaction: (type: ReactionType) => void;
}

export const REACTION_CONFIG: Record<
  ReactionType,
  { label: string; color: string; bg: string; emoji: string }
> = {
  LIKE: {
    label: 'Like',
    color: 'text-[#0a66c2] dark:text-[#70b5f9]',
    bg: 'bg-blue-50 dark:bg-[#0a66c2]/20',
    emoji: '👍',
  },
  CELEBRATE: {
    label: 'Celebrate',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    emoji: '👏',
  },
  SUPPORT: {
    label: 'Support',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    emoji: '🤝',
  },
  LOVE: {
    label: 'Love',
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    emoji: '❤️',
  },
  INSIGHTFUL: {
    label: 'Insightful',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    emoji: '💡',
  },
};

export const ReactionPicker: React.FC<ReactionPickerProps> = ({
  currentReaction,
  onSelectReaction,
}) => {
  const reactions: ReactionType[] = ['LIKE', 'CELEBRATE', 'SUPPORT', 'LOVE', 'INSIGHTFUL'];

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-[#1d2226] rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.22)] border border-[#e0dfdc] dark:border-[#383b40] animate-in fade-in-50 zoom-in-95">
      {reactions.map((type) => {
        const config = REACTION_CONFIG[type];
        const isSelected = currentReaction === type;
        return (
          <button
            key={type}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectReaction(type);
            }}
            className={`group relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:scale-125 hover:-translate-y-1 cursor-pointer ${
              isSelected ? config.bg : 'hover:bg-slate-100 dark:hover:bg-[#282c31]'
            }`}
            title={config.label}
          >
            <span className="text-xl leading-none select-none">{config.emoji}</span>
            {/* Tooltip */}
            <span className="absolute -top-7 px-2 py-0.5 text-[10px] font-semibold text-white bg-slate-900 dark:bg-slate-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm z-50">
              {config.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
