import React, { useState, useEffect, useRef } from 'react';
import { Send, CheckCheck } from 'lucide-react';
import { MessageItem } from '../../types';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { messageApi } from '../../api/message.api';

interface ChatWindowProps {
  conversationId: string;
  peer: {
    id: string;
    fullName: string;
    avatarUrl?: string | null;
    headline?: string | null;
    isOnline: boolean;
  };
  initialMessages: MessageItem[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
  peer,
  initialMessages,
}) => {
  const { user } = useAuth();
  const { socket, sendMessage, sendTyping } = useSocket();

  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync initial messages when conversation changes
  useEffect(() => {
    setMessages(initialMessages);
  }, [conversationId, initialMessages]);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPeerTyping]);

  // Socket listeners for incoming messages in this conversation
  useEffect(() => {
    if (!socket) return;

    const handleReceive = (msg: MessageItem) => {
      if (msg.conversationId === conversationId || msg.senderId === peer.id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleSent = (msg: MessageItem) => {
      if (msg.conversationId === conversationId || msg.receiverId === peer.id) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    };

    const handleTyping = (data: { senderId: string; isTyping: boolean }) => {
      if (data.senderId === peer.id) {
        setIsPeerTyping(data.isTyping);
      }
    };

    socket.on('message:receive', handleReceive);
    socket.on('message:sent', handleSent);
    socket.on('typing:indicator', handleTyping);

    return () => {
      socket.off('message:receive', handleReceive);
      socket.off('message:sent', handleSent);
      socket.off('typing:indicator', handleTyping);
    };
  }, [socket, conversationId, peer.id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const content = inputText.trim();
    setInputText('');
    sendTyping(peer.id, false);

    // Real-time socket send
    sendMessage(peer.id, content);

    // Also persist via REST API if socket not connected
    if (!socket?.connected) {
      try {
        const res = await messageApi.sendMessage(peer.id, content);
        if (res.success && res.data) {
          setMessages((prev) => [...prev, res.data]);
        }
      } catch (_) {}
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    sendTyping(peer.id, e.target.value.length > 0);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1d2226] overflow-hidden">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-100 dark:border-[#383b40] flex items-center justify-between bg-white dark:bg-[#1d2226]">
        <div className="flex items-center gap-3">
          <Avatar
            src={peer.avatarUrl}
            name={peer.fullName}
            size="md"
            isOnline={peer.isOnline}
          />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{peer.fullName}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{peer.headline || 'LinkedIn Member'}</p>
          </div>
        </div>
        <span
          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
            peer.isOnline
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}
        >
          {peer.isOnline ? '● Online' : 'Offline'}
        </span>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8f9fa] dark:bg-[#15191c]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-xs text-slate-400 dark:text-slate-500 space-y-1">
            <p className="font-semibold text-slate-600 dark:text-slate-300">Start a conversation with {peer.fullName}.</p>
            <p className="text-[11px]">Direct messages are stored securely and synced in real-time.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                    isMe
                      ? 'bg-[#0a66c2] text-white rounded-br-sm'
                      : 'bg-white dark:bg-[#282c31] border border-slate-200/80 dark:border-[#383b40] text-slate-800 dark:text-slate-100 rounded-bl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 dark:text-slate-500 px-1">
                  <span>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {isMe && <CheckCheck className="w-3.5 h-3.5 text-[#0a66c2] dark:text-[#70b5f9]" />}
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {isPeerTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 italic py-1">
            <span className="w-1.5 h-1.5 bg-[#0a66c2] rounded-full animate-bounce" />
            <span className="w-1.5 h-1.5 bg-[#0a66c2] rounded-full animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 bg-[#0a66c2] rounded-full animate-bounce [animation-delay:0.4s]" />
            <span>{peer.fullName} is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-100 dark:border-[#383b40] bg-white dark:bg-[#1d2226] flex gap-2">
        <input
          type="text"
          placeholder={`Message ${peer.fullName}...`}
          value={inputText}
          onChange={handleInputChange}
          className="flex-1 rounded-full bg-slate-100/90 dark:bg-[#282c31] px-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-[#383b40] outline-none focus:bg-white dark:focus:bg-[#1d2226] focus:border-[#0a66c2] dark:focus:border-[#70b5f9] transition-all"
        />
        <Button
          type="submit"
          size="sm"
          variant="primary"
          disabled={!inputText.trim()}
          icon={<Send className="w-4 h-4" />}
        >
          Send
        </Button>
      </form>
    </div>
  );
};
