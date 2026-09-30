import React from 'react';
import { ConversationItem } from '../../types';
import { Avatar } from '../common/Avatar';

interface ConversationListProps {
  conversations: ConversationItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onlineUsers: Set<string>;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  onSelect,
  onlineUsers,
}) => {
  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) {
      return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="divide-y divide-slate-100 dark:divide-[#383b40] overflow-y-auto">
      {conversations.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
          No conversations yet. Connect with professionals and start a discussion!
        </div>
      ) : (
        conversations.map((conv) => {
          const isSelected = selectedId === conv.id;
          const isOnline = onlineUsers.has(conv.peer.id) || conv.peer.isOnline;

          return (
            <div
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-[#edf3f8] dark:bg-[#282c31] border-l-4 border-[#0a66c2]'
                  : 'hover:bg-slate-50 dark:hover:bg-[#23272c]'
              }`}
            >
              <Avatar
                src={conv.peer.avatarUrl}
                name={conv.peer.fullName}
                size="md"
                isOnline={isOnline}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {conv.peer.fullName}
                  </h4>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {formatTime(conv.lastMessageAt)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {conv.lastMessage ? conv.lastMessage.content : 'Started conversation'}
                </p>
              </div>

              {conv.unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#0a66c2] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {conv.unreadCount}
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
