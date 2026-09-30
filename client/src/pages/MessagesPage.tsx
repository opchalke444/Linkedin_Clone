import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageSquare, Search, Send, Image, Smile, Phone, Video, MoreHorizontal, UserPlus } from 'lucide-react';
import { ConversationItem, MessageItem, User } from '../types';
import { messageApi } from '../api/message.api';
import { userApi } from '../api/user.api';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { ConversationList } from '../components/messaging/ConversationList';
import { ChatWindow } from '../components/messaging/ChatWindow';
import { Avatar } from '../components/common/Avatar';

export const MessagesPage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const { onlineUsers } = useSocket();
  const { user: currentUser } = useAuth();

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [currentChatData, setCurrentChatData] = useState<{
    conversationId: string;
    peer: any;
    messages: MessageItem[];
  } | null>(null);
  const [targetPeerUser, setTargetPeerUser] = useState<User | null>(null);
  const [newChatText, setNewChatText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingFirst, setIsSendingFirst] = useState(false);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const res = await messageApi.getConversations();
      if (res.success && res.data) {
        setConversations(res.data);

        // If a userId was passed in URL
        if (userId && userId !== currentUser?.id) {
          const existing = res.data.find(
            (c: any) => c.user1?.id === userId || c.user2?.id === userId || (c.peer && c.peer.id === userId)
          );
          if (existing) {
            handleSelectConversation(existing.id);
          } else {
            // Need to start a new chat with target user
            const peerRes = await userApi.getUserById(userId);
            if (peerRes.success && peerRes.data) {
              setTargetPeerUser(peerRes.data);
              setSelectedConversationId('new');
              setCurrentChatData(null);
            }
          }
        } else if (res.data.length > 0 && !selectedConversationId) {
          handleSelectConversation(res.data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [userId]);

  const handleSelectConversation = async (convId: string) => {
    setSelectedConversationId(convId);
    setTargetPeerUser(null);
    try {
      const res = await messageApi.getMessages(convId);
      if (res.success && res.data) {
        setCurrentChatData(res.data);
        // Reset unread count locally
        setConversations((prev) =>
          prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c))
        );
      }
    } catch (err) {
      console.error('Error fetching conversation messages:', err);
    }
  };

  const handleStartNewConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPeerUser || !newChatText.trim()) return;

    setIsSendingFirst(true);
    try {
      const res = await messageApi.sendMessage(targetPeerUser.id, newChatText.trim());
      if (res.success) {
        setNewChatText('');
        // Re-fetch conversations and select the newly created one
        const updatedList = await messageApi.getConversations();
        if (updatedList.success && updatedList.data) {
          setConversations(updatedList.data);
          const newConv = updatedList.data.find(
            (c: any) => c.user1?.id === targetPeerUser.id || c.user2?.id === targetPeerUser.id || (c.peer && c.peer.id === targetPeerUser.id)
          );
          if (newConv) {
            handleSelectConversation(newConv.id);
          }
        }
      }
    } catch (err) {
      console.error('Error sending first message:', err);
    } finally {
      setIsSendingFirst(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-3">
      {/* Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] overflow-hidden min-h-[75vh]">
        {/* Left Column: Conversation List */}
        <div className="md:col-span-4 border-r border-[#e0dfdc] dark:border-[#383b40] flex flex-col h-full bg-white dark:bg-[#1d2226]">
          <div className="p-3 border-b border-slate-100 dark:border-[#383b40] flex items-center justify-between">
            <h1 className="text-base font-bold text-slate-900 dark:text-white">Messaging</h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{conversations.length} chats</span>
            </div>
          </div>

          {/* Search bar inside conversation list */}
          <div className="p-2 border-b border-slate-100 dark:border-[#383b40] bg-slate-50/50 dark:bg-[#15191c]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search messages"
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-[#282c31] rounded-md border border-slate-200 dark:border-[#383b40] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#0a66c2]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 space-y-3 animate-pulse">
                <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-md" />
                <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-md" />
                <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-md" />
              </div>
            ) : conversations.length === 0 && !targetPeerUser ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500 space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">No conversations yet</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Connect with peers to start messaging.</p>
              </div>
            ) : (
              <ConversationList
                conversations={conversations}
                selectedId={selectedConversationId}
                onSelect={handleSelectConversation}
                onlineUsers={onlineUsers}
              />
            )}
          </div>
        </div>

        {/* Right Column: Chat Window or Placeholder */}
        <div className="md:col-span-8 flex flex-col h-full bg-[#f4f2ee] dark:bg-[#15191c]">
          {selectedConversationId === 'new' && targetPeerUser ? (
            <div className="flex-1 flex flex-col bg-white dark:bg-[#1d2226]">
              {/* Header */}
              <div className="p-3 border-b border-[#e0dfdc] dark:border-[#383b40] flex items-center justify-between bg-white dark:bg-[#1d2226]">
                <Link to={`/profile/${targetPeerUser.id}`} className="flex items-center gap-2.5 group">
                  <Avatar src={targetPeerUser.avatarUrl} name={targetPeerUser.fullName} size="sm" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0a66c2] dark:group-hover:text-[#70b5f9] leading-none">
                      {targetPeerUser.fullName}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {targetPeerUser.headline || 'LinkedIn Member'}
                    </p>
                  </div>
                </Link>
              </div>

              {/* Start conversation prompt */}
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 bg-white dark:bg-[#1d2226]">
                <Avatar src={targetPeerUser.avatarUrl} name={targetPeerUser.fullName} size="xl" className="ring-2 ring-slate-200 dark:ring-slate-700" />
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{targetPeerUser.fullName}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-0.5">{targetPeerUser.headline || 'LinkedIn Member'}</p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 bg-blue-50 dark:bg-[#0a66c2]/20 px-4 py-2 rounded-full border border-blue-100 dark:border-[#0a66c2]/40">
                  Say hello! Send your first direct message to begin a conversation.
                </p>
              </div>

              {/* Input */}
              <form onSubmit={handleStartNewConversation} className="p-3 border-t border-[#e0dfdc] dark:border-[#383b40] bg-white dark:bg-[#1d2226] flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Write a message..."
                  value={newChatText}
                  onChange={(e) => setNewChatText(e.target.value)}
                  className="flex-1 px-4 py-2 text-xs rounded-full border border-slate-300 dark:border-[#383b40] bg-white dark:bg-[#282c31] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#0a66c2]"
                />
                <button
                  type="submit"
                  disabled={!newChatText.trim() || isSendingFirst}
                  className="px-5 py-2 bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-semibold rounded-full transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Send
                </button>
              </form>
            </div>
          ) : currentChatData ? (
            <ChatWindow
              conversationId={currentChatData.conversationId}
              peer={currentChatData.peer}
              initialMessages={currentChatData.messages}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 dark:text-slate-500 space-y-2 bg-white dark:bg-[#1d2226]">
              <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No message selected</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                Select a conversation from the left or visit a member's profile to start a new message.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
