import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  UserPlus,
  Heart,
  MessageSquare,
  Sparkles,
  MoreHorizontal,
  Trash2,
  Check,
} from 'lucide-react';
import { NotificationItem } from '../types';
import { notificationApi } from '../api/notification.api';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { useSocket } from '../contexts/SocketContext';
import { useToast } from '../contexts/ToastContext';

export const NotificationsPage: React.FC = () => {
  const { setUnreadCount } = useSocket();
  const { success } = useToast();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'POSTS' | 'MENTIONS'>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await notificationApi.getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      success('All notifications marked as read');
    } catch (_) {}
  };

  const handleMarkSingleRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (_) {}
  };

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'CONNECTION_REQUEST':
      case 'CONNECTION_ACCEPTED':
        return (
          <div className="w-5 h-5 rounded-full bg-[#0a66c2] text-white flex items-center justify-center shadow-sm">
            <UserPlus className="w-3 h-3" />
          </div>
        );
      case 'POST_REACTION':
        return (
          <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm">
            <Heart className="w-3 h-3" />
          </div>
        );
      case 'POST_COMMENT':
      case 'COMMENT_REPLY':
        return (
          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <MessageSquare className="w-3 h-3" />
          </div>
        );
      default:
        return (
          <div className="w-5 h-5 rounded-full bg-[#0a66c2] text-white flex items-center justify-center shadow-sm">
            <Bell className="w-3 h-3" />
          </div>
        );
    }
  };

  const getNotificationText = (n: NotificationItem) => {
    const name = n.actor?.fullName || 'A member';
    switch (n.type) {
      case 'CONNECTION_REQUEST':
        return `${name} sent you an invitation to connect.`;
      case 'CONNECTION_ACCEPTED':
        return `${name} accepted your invitation to connect.`;
      case 'POST_REACTION':
        return `${name} reacted to your post.`;
      case 'POST_COMMENT':
        return `${name} commented on your post.`;
      case 'COMMENT_REPLY':
        return `${name} replied to your comment.`;
      case 'MESSAGE_RECEIVED':
        return `${name} sent you a message.`;
      default:
        return `${name} engaged with your professional activity.`;
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'POSTS') {
      return n.type === 'POST_REACTION' || n.type === 'POST_COMMENT' || n.type === 'COMMENT_REPLY';
    }
    if (filter === 'MENTIONS') {
      return n.type === 'POST_COMMENT' || n.type === 'COMMENT_REPLY';
    }
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none p-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Stay updated on your network and activity</p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-[#282c31] text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
        >
          <CheckCheck className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white dark:bg-[#1d2226] px-4 py-2 rounded-lg border border-[#e0dfdc] dark:border-[#383b40] text-xs">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1 rounded-full font-semibold transition-colors ${
            filter === 'ALL' ? 'bg-[#0a66c2] text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#282c31]'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('POSTS')}
          className={`px-3 py-1 rounded-full font-semibold transition-colors ${
            filter === 'POSTS' ? 'bg-[#0a66c2] text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#282c31]'
          }`}
        >
          My posts
        </button>
        <button
          onClick={() => setFilter('MENTIONS')}
          className={`px-3 py-1 rounded-full font-semibold transition-colors ${
            filter === 'MENTIONS' ? 'bg-[#0a66c2] text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#282c31]'
          }`}
        >
          Mentions
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none divide-y divide-slate-100 dark:divide-[#383b40] overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3 animate-pulse">
            <div className="h-12 bg-slate-100 dark:bg-[#282c31] rounded-md" />
            <div className="h-12 bg-slate-100 dark:bg-[#282c31] rounded-md" />
            <div className="h-12 bg-slate-100 dark:bg-[#282c31] rounded-md" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
            <Bell className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-semibold text-slate-800 dark:text-white">No notifications right now</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              When members connect, react, or comment, you'll see alerts here.
            </p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-[#282c31] transition-colors ${
                !n.isRead ? 'bg-blue-50/40 dark:bg-[#0a66c2]/10' : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Actor Avatar with Icon Overlay */}
                <div className="relative flex-shrink-0">
                  <Avatar src={n.actor?.avatarUrl} name={n.actor?.fullName || 'User'} size="md" />
                  <div className="absolute -bottom-1 -right-1">
                    {getNotificationIcon(n.type)}
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-snug">
                    <span className="font-bold text-slate-900 dark:text-white">{n.actor?.fullName || 'A member'} </span>
                    {getNotificationText(n).replace(n.actor?.fullName || 'A member', '')}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkSingleRead(n.id)}
                    className="p-1.5 text-slate-400 hover:text-[#0a66c2] hover:bg-white dark:hover:bg-[#282c31] rounded-full transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                {!n.isRead && (
                  <span className="w-2 h-2 rounded-full bg-[#0a66c2]" title="Unread" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
