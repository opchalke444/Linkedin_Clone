import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, Check, ArrowLeft, Send, MessageSquare, ShieldCheck, Share2 } from 'lucide-react';
import { GroupItem } from '../types';
import { groupApi } from '../api/group.api';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export const GroupDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { success, error, info } = useToast();

  const [group, setGroup] = useState<GroupItem | null>(null);
  const [postContent, setPostContent] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGroup = useCallback(async () => {
    if (!slug) return;
    try {
      setIsLoading(true);
      const res = await groupApi.getGroupBySlug(slug);
      if (res.success && res.data) {
        setGroup(res.data);
      }
    } catch (err) {
      console.error('Error fetching group:', err);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  const handleJoin = async () => {
    if (!group) return;
    try {
      await groupApi.joinGroup(group.id);
      success(`Joined ${group.name}!`);
      fetchGroup();
    } catch (err: any) {
      error(err.message || 'Failed to join');
    }
  };

  const handleLeave = async () => {
    if (!group) return;
    try {
      await groupApi.leaveGroup(group.id);
      success(`Left ${group.name}`);
      fetchGroup();
    } catch (err: any) {
      error(err.message || 'Failed to leave');
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!group || !postContent.trim()) return;

    setIsSubmittingPost(true);
    try {
      await groupApi.createGroupPost(group.id, postContent.trim());
      setPostContent('');
      success('Post published to group!');
      fetchGroup();
    } catch (err: any) {
      error(err.message || 'Failed to post in group');
    } finally {
      setIsSubmittingPost(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4 animate-pulse py-4">
        <div className="h-44 bg-slate-200 rounded-lg" />
        <div className="h-64 bg-slate-200 rounded-lg" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="max-w-md mx-auto p-12 text-center text-slate-500 dark:text-slate-400 space-y-3 bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] my-8">
        <p className="text-sm font-semibold text-slate-800 dark:text-white">Group not found.</p>
        <Link to="/groups">
          <Button size="sm" variant="primary">Return to Groups</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-2">
      <Link
        to="/groups"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0a66c2] dark:hover:text-[#70b5f9] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all groups
      </Link>

      {/* Group Banner Card */}
      <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none overflow-hidden">
        <div className="h-32 sm:h-40 bg-gradient-to-r from-[#004182] via-[#0a66c2] to-[#0073b1] relative">
          <div className="absolute -bottom-8 left-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-blue-50 dark:bg-[#1d2226] border-4 border-white dark:border-[#1d2226] shadow-md flex items-center justify-center font-bold text-2xl text-[#0a66c2] dark:text-[#70b5f9]">
              {group.name.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="pt-10 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-['Outfit']">
                  {group.name}
                </h1>
                {group.myRole === 'ADMIN' && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {group.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                  <Users className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  {group.memberCount} members
                </span>
                <span>Created by {group.creator?.fullName}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  info('Group link copied to clipboard');
                }}
                icon={<Share2 className="w-3.5 h-3.5" />}
              >
                Share
              </Button>

              {group.isMember ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                  onClick={handleLeave}
                  icon={<Check className="w-3.5 h-3.5" />}
                >
                  Joined (Leave)
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={handleJoin}>
                  Join group
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Discussion & Members Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Discussion Feed (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Post box if member */}
          {group.isMember ? (
            <form onSubmit={handleCreatePost} className="bg-white dark:bg-[#1d2226] p-4 rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none space-y-3">
              <div className="flex gap-3">
                <Avatar src={user?.avatarUrl} name={user?.fullName || 'Me'} size="sm" />
                <textarea
                  placeholder={`Start a discussion in ${group.name}...`}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={2}
                  className="flex-1 text-xs text-slate-900 dark:text-white p-2.5 rounded-lg bg-slate-50 dark:bg-[#282c31] border border-slate-200 dark:border-[#383b40] outline-none focus:bg-white dark:focus:bg-[#282c31] focus:border-[#0a66c2]"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  disabled={!postContent.trim()}
                  isLoading={isSubmittingPost}
                  icon={<Send className="w-3.5 h-3.5" />}
                >
                  Post to group
                </Button>
              </div>
            </form>
          ) : (
            <div className="p-4 bg-blue-50/70 dark:bg-[#0a66c2]/10 rounded-lg border border-blue-100 dark:border-[#0a66c2]/30 text-xs text-[#0a66c2] dark:text-[#70b5f9] text-center font-medium">
              Join this group to participate in discussions and share insights.
            </div>
          )}

          {/* Posts List */}
          <div className="space-y-3">
            {group.posts && group.posts.length > 0 ? (
              group.posts.map((post: any) => (
                <div key={post.id} className="p-5 rounded-lg bg-white dark:bg-[#1d2226] border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar src={post.author?.avatarUrl} name={post.author?.fullName || 'User'} size="sm" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{post.author?.fullName}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {post.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500 bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40]">
                No group discussions yet. Be the first to start a conversation!
              </div>
            )}
          </div>
        </div>

        {/* Members Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#1d2226] p-5 rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Group Members ({group.members?.length || 0})
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-[#383b40]">
            {group.members?.map((m: any) => (
              <div key={m.id} className="py-2.5 flex items-center justify-between">
                <Link to={`/in/${m.user?.id || m.userId}`} className="flex items-center gap-2.5 group min-w-0">
                  <Avatar src={m.user?.avatarUrl} name={m.user?.fullName} size="xs" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0a66c2] dark:group-hover:text-[#70b5f9] group-hover:underline truncate">
                      {m.user?.fullName}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{m.user?.headline || 'Member'}</p>
                  </div>
                </Link>
                {m.role === 'ADMIN' && (
                  <span className="text-[9px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 ml-2 flex-shrink-0">
                    Admin
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
