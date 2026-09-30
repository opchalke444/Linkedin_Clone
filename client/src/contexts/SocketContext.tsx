import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { MessageItem, NotificationItem } from '../types';

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: Set<string>;
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  sendMessage: (receiverId: string, content: string) => void;
  sendTyping: (receiverId: string, isTyping: boolean) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { info } = useToast();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    if (user?.unreadNotificationsCount !== undefined) {
      setUnreadCount(user.unreadNotificationsCount);
    }
  }, [user?.unreadNotificationsCount]);

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const socketUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      newSocket.emit('join', user.id);
    });

    // Real-time online/offline presence
    newSocket.on('user:status', (data: { userId: string; status: 'online' | 'offline' }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (data.status === 'online') {
          next.add(data.userId);
        } else {
          next.delete(data.userId);
        }
        return next;
      });
    });

    // Real-time notification received
    newSocket.on('notification:new', (notif: NotificationItem) => {
      setUnreadCount((c) => c + 1);
      const actorName = notif.actor?.fullName || 'Someone';
      let text = 'New notification received';
      if (notif.type === 'CONNECTION_REQUEST') text = `${actorName} sent you a connection request`;
      if (notif.type === 'CONNECTION_ACCEPTED') text = `${actorName} accepted your connection request`;
      if (notif.type === 'POST_REACTION') text = `${actorName} reacted to your post`;
      if (notif.type === 'POST_COMMENT') text = `${actorName} commented on your post`;
      if (notif.type === 'COMMENT_REPLY') text = `${actorName} replied to your comment`;
      if (notif.type === 'MESSAGE_RECEIVED') text = `New message from ${actorName}`;

      info(text);
    });

    // Real-time direct message alert
    newSocket.on('message:receive', (msg: MessageItem) => {
      if (window.location.pathname !== '/messages') {
        const senderName = msg.sender?.fullName || 'A connection';
        info(`New message from ${senderName}: "${msg.content.slice(0, 35)}..."`);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user?.id]);

  const sendMessage = (receiverId: string, content: string) => {
    if (socket && user) {
      socket.emit('message:send', { receiverId, content });
    }
  };

  const sendTyping = (receiverId: string, isTyping: boolean) => {
    if (socket) {
      socket.emit(isTyping ? 'typing:start' : 'typing:stop', { receiverId });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        unreadCount,
        setUnreadCount,
        sendMessage,
        sendTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
