import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Check,
  X,
  Sparkles,
  MessageSquare,
  Trash2,
  Clock,
  Briefcase,
  Contact,
  Building2,
  Calendar,
  Newspaper,
  Hash,
} from 'lucide-react';
import { ConnectionItem, PendingRequestItem } from '../types';
import { connectionApi } from '../api/connection.api';
import { userApi } from '../api/user.api';
import { useToast } from '../contexts/ToastContext';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';

export const NetworkPage: React.FC = () => {
  const { success, error } = useToast();

  const [connections, setConnections] = useState<ConnectionItem[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<PendingRequestItem[]>([]);
  const [sentRequests, setSentRequests] = useState<PendingRequestItem[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [connRes, pendingRes, recRes] = await Promise.all([
        connectionApi.getMyConnections(),
        connectionApi.getPendingRequests(),
        userApi.getRecommendations(),
      ]);

      if (connRes.success && connRes.data) setConnections(connRes.data);
      if (pendingRes.success && pendingRes.data) {
        setReceivedRequests(pendingRes.data.received);
        setSentRequests(pendingRes.data.sent);
      }
      if (recRes.success && recRes.data) setRecommendations(recRes.data);
    } catch (err: any) {
      error(err.message || 'Failed to load network data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAccept = async (id: string, name: string) => {
    try {
      await connectionApi.acceptRequest(id);
      success(`Connected with ${name}!`);
      fetchData();
    } catch (err: any) {
      error(err.message || 'Failed to accept invitation');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await connectionApi.rejectRequest(id);
      setReceivedRequests((prev) => prev.filter((r) => r.id !== id));
      success('Invitation ignored');
    } catch (err: any) {
      error(err.message || 'Failed to reject invitation');
    }
  };

  const handleSendRequest = async (userId: string, name: string) => {
    try {
      await connectionApi.sendRequest(userId);
      success(`Connection request sent to ${name}!`);
      setRecommendations((prev) => prev.filter((u) => u.id !== userId));
    } catch (err: any) {
      error(err.message || 'Failed to send request');
    }
  };

  const handleRemove = async (id: string, name: string) => {
    if (!window.confirm(`Remove ${name} from your connections?`)) return;
    try {
      await connectionApi.removeConnection(id);
      setConnections((prev) => prev.filter((c) => c.connectionId !== id));
      success('Connection removed');
    } catch (err: any) {
      error(err.message || 'Failed to remove connection');
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left Sidebar: Manage my network */}
      <aside className="lg:col-span-4 space-y-3">
        <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none p-4 space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-[#383b40] pb-2">
            Manage my network
          </h2>

          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#282c31] text-slate-700 dark:text-slate-300 font-medium">
              <span className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                Connections
              </span>
              <span className="font-bold text-slate-900 dark:text-white">{connections.length}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#282c31] text-slate-700 dark:text-slate-300 font-medium">
              <span className="flex items-center gap-2.5">
                <Contact className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                Contacts
              </span>
              <span className="font-bold text-slate-900 dark:text-white">184</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#282c31] text-slate-700 dark:text-slate-300 font-medium">
              <span className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                Following & Followers
              </span>
              <span className="font-bold text-slate-900 dark:text-white">420</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#282c31] text-slate-700 dark:text-slate-300 font-medium">
              <span className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                Pages
              </span>
              <span className="font-bold text-slate-900 dark:text-white">18</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#282c31] text-slate-700 dark:text-slate-300 font-medium">
              <span className="flex items-center gap-2.5">
                <Newspaper className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                Newsletters
              </span>
              <span className="font-bold text-slate-900 dark:text-white">6</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#282c31] text-slate-700 dark:text-slate-300 font-medium">
              <span className="flex items-center gap-2.5">
                <Hash className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                Hashtags
              </span>
              <span className="font-bold text-slate-900 dark:text-white">12</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content (8 cols) */}
      <section className="lg:col-span-8 space-y-4">
        {/* Invitations / Pending Requests Card */}
        {receivedRequests.length > 0 && (
          <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#383b40] pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Invitations ({receivedRequests.length})
              </h3>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-[#383b40]">
              {receivedRequests.map((req) => (
                <div key={req.id} className="py-3 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                  <Link to={`/profile/${req.sender?.id}`} className="flex items-center gap-3 min-w-0 group">
                    <Avatar src={req.sender?.avatarUrl} name={req.sender?.fullName || 'User'} size="md" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0a66c2] truncate">
                        {req.sender?.fullName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{req.sender?.headline || 'LinkedIn Member'}</p>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleReject(req.id)}
                      className="px-4 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#282c31] rounded-full transition-colors"
                    >
                      Ignore
                    </button>
                    <button
                      onClick={() => handleAccept(req.id, req.sender?.fullName || 'Member')}
                      className="px-4 py-1.5 text-xs font-semibold text-[#0a66c2] border border-[#0a66c2] hover:bg-blue-50 dark:hover:bg-[#0a66c2]/20 rounded-full transition-colors"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* People You May Know Grid */}
        <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              People you may know based on your profile
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">See all</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {recommendations.map((person) => (
              <div
                key={person.id}
                className="bg-white dark:bg-[#23272c] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow relative"
              >
                {/* Mini banner */}
                <div className="h-14 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
                  {person.bannerUrl && (
                    <img src={person.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                  )}
                </div>

                {/* Avatar */}
                <div className="px-3 pb-3 text-center -mt-8 flex-1 flex flex-col items-center">
                  <Link to={`/profile/${person.id}`}>
                    <Avatar
                      src={person.avatarUrl}
                      name={person.fullName}
                      size="lg"
                      className="ring-2 ring-white dark:ring-[#23272c] shadow-sm"
                    />
                  </Link>

                  <Link to={`/profile/${person.id}`} className="mt-2 block font-bold text-xs text-slate-900 dark:text-white hover:text-[#0a66c2] hover:underline line-clamp-1">
                    {person.fullName}
                  </Link>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-tight">
                    {person.headline || 'LinkedIn Member'}
                  </p>

                  {person.commonSkills && person.commonSkills.length > 0 && (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 line-clamp-1">
                      Shared skills: {person.commonSkills.slice(0, 2).join(', ')}
                    </p>
                  )}
                </div>

                <div className="p-3 pt-0">
                  <button
                    onClick={() => handleSendRequest(person.id, person.fullName)}
                    className="w-full py-1 rounded-full border border-[#0a66c2] text-[#0a66c2] hover:bg-blue-50 dark:hover:bg-[#0a66c2]/20 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Existing Connections Section */}
        {connections.length > 0 && (
          <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none p-4 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Your Connections ({connections.length})
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-[#383b40]">
              {connections.map((item) => (
                <div key={item.connectionId} className="py-3 flex items-center justify-between gap-3">
                  <Link to={`/profile/${item.user.id}`} className="flex items-center gap-3 min-w-0 group">
                    <Avatar src={item.user.avatarUrl} name={item.user.fullName} size="md" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0a66c2] truncate">
                        {item.user.fullName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {item.user.headline || 'LinkedIn Member'}
                      </p>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2">
                    <Link to={`/messages/${item.user.id}`}>
                      <button className="px-3 py-1 rounded-full border border-slate-400 dark:border-slate-600 hover:border-slate-800 dark:hover:border-slate-300 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#282c31]">
                        Message
                      </button>
                    </Link>
                    <button
                      onClick={() => handleRemove(item.connectionId, item.user.fullName)}
                      className="p-1.5 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      title="Remove connection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
