import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  Users,
  ChevronDown,
  Layers,
  Info,
  Plus,
  UserPlus,
  ArrowUpRight,
} from 'lucide-react';
import { Post } from '../types';
import { postApi } from '../api/post.api';
import { userApi } from '../api/user.api';
import { connectionApi } from '../api/connection.api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { CreatePostCard } from '../components/feed/CreatePostCard';
import { PostCard } from '../components/feed/PostCard';
import { PostSkeleton } from '../components/common/Skeleton';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';

export const FeedPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [posts, setPosts] = useState<Post[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState<'top' | 'recent'>('top');
  const [showMoreNews, setShowMoreNews] = useState(false);

  const fetchFeed = useCallback(async (pageNum = 1) => {
    try {
      if (pageNum === 1) setIsLoading(true);
      else setIsLoadingMore(true);

      const res = await postApi.getFeed(pageNum, 10);
      if (res.success && res.data) {
        if (pageNum === 1) {
          setPosts(res.data);
        } else {
          setPosts((prev) => [...prev, ...res.data]);
        }
        setHasMore(res.meta?.hasMore || false);
      }
    } catch (err) {
      console.error('Error fetching feed:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  const fetchRecommendations = useCallback(async () => {
    if (!user) return;
    try {
      const res = await userApi.getRecommendations();
      if (res.success && res.data) {
        setRecommendations(res.data.slice(0, 3));
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchFeed(1);
    fetchRecommendations();
  }, [fetchFeed, fetchRecommendations]);

  const handlePostCreated = () => {
    fetchFeed(1);
  };

  const handlePostDeleted = (deletedId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== deletedId));
  };

  const handlePostUpdated = (updated: Post) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleQuickConnect = async (targetId: string, name: string) => {
    try {
      await connectionApi.sendRequest(targetId);
      success(`Connection request sent to ${name}!`);
      setRecommendations((prev) => prev.filter((u) => u.id !== targetId));
    } catch (err: any) {
      error(err.message || 'Failed to send connection request');
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    // Top: by reactions + comments
    const scoreA = (a.likeCount || 0) * 2 + (a.commentCount || 0) * 3;
    const scoreB = (b.likeCount || 0) * 2 + (b.commentCount || 0) * 3;
    return scoreB - scoreA;
  });

  const newsItems = [
    { title: 'India SaaS ecosystem crosses $10B ARR milestone', time: '1d ago', readers: '28,450 readers' },
    { title: 'GCCs in Bengaluru & Hyderabad expand engineering hiring', time: '18h ago', readers: '21,920 readers' },
    { title: 'UPI international linkages surge across 12 countries', time: '2d ago', readers: '34,410 readers' },
    { title: 'Indian AI labs release Indic multilingual speech models', time: '3d ago', readers: '19,180 readers' },
    { title: 'High-scale architectures: Scaling Swiggy & Zomato peaks', time: '4h ago', readers: '18,330 readers' },
    { title: 'Bengaluru Outer Ring Road tech corridors return to office', time: '12h ago', readers: '22,840 readers' },
    { title: 'FinTech funding in Mumbai & Gurugram gathers fresh momentum', time: '2d ago', readers: '14,100 readers' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-7xl mx-auto">
      {/* Left Sidebar (Desktop 3 cols) */}
      <aside className="lg:col-span-3 space-y-2">
        {/* User Identity Card */}
        {user && (
          <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] overflow-hidden transition-colors">
            {/* Banner Cover */}
            <div className="h-14 bg-gradient-to-r from-[#004182] to-[#0a66c2] relative">
              {user.bannerUrl && (
                <img
                  src={user.bannerUrl}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Avatar & Name */}
            <div className="px-4 pb-4 text-center relative border-b border-slate-100 dark:border-[#383b40]">
              <div className="-mt-9 mb-2 flex justify-center">
                <Link to={`/profile/${user.id}`}>
                  <Avatar
                    src={user.avatarUrl}
                    name={user.fullName}
                    size="lg"
                    className="ring-2 ring-white dark:ring-[#1d2226] shadow-sm"
                  />
                </Link>
              </div>

              <Link to={`/profile/${user.id}`} className="group block">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:underline">
                  {user.fullName}
                </h3>
              </Link>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                {user.headline || 'LinkedIn Member'}
              </p>
            </div>

            {/* Profile Metrics */}
            <div className="py-2 text-xs border-b border-slate-100 dark:border-[#383b40]">
              <Link to={`/profile/${user.id}`} className="flex items-center justify-between px-4 py-1.5 hover:bg-slate-50 dark:hover:bg-[#282c31] transition-colors">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Profile viewers</span>
                <span className="font-bold text-[#0a66c2] dark:text-[#70b5f9]">{Math.floor(((user.connectionCount || 3) + 7) * 4.2)}</span>
              </Link>
              <Link to={`/profile/${user.id}`} className="flex items-center justify-between px-4 py-1.5 hover:bg-slate-50 dark:hover:bg-[#282c31] transition-colors">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Post impressions</span>
                <span className="font-bold text-[#0a66c2] dark:text-[#70b5f9]">{Math.floor(((user.connectionCount || 3) + 12) * 18.5)}</span>
              </Link>
            </div>

            {/* Premium upsell */}
            <div className="p-3 border-b border-slate-100 dark:border-[#383b40] hover:bg-slate-50 dark:hover:bg-[#282c31] transition-colors">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Strengthen your profile with AI</p>
              <Link to="/opportunities" className="text-xs font-semibold text-[#915907] dark:text-[#f8c77e] flex items-center gap-1 hover:underline mt-0.5">
                <span className="w-2.5 h-2.5 bg-[#f8c77e] rounded-[2px] inline-block" />
                Try Premium for $0
              </Link>
            </div>

            {/* My Items */}
            <Link to="/settings" className="flex items-center gap-2 p-3 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#282c31] transition-colors">
              <Bookmark className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Saved items</span>
            </Link>
          </div>
        )}

        {/* Shortcuts / Groups Card */}
        <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] p-3 text-xs space-y-2 hidden sm:block">
          <p className="font-semibold text-slate-900 dark:text-white">Recent</p>
          <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
            <Link to="/groups" className="flex items-center gap-2 hover:text-[#0a66c2] dark:hover:text-[#70b5f9] transition-colors">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">React & TypeScript Engineers</span>
            </Link>
            <Link to="/groups" className="flex items-center gap-2 hover:text-[#0a66c2] dark:hover:text-[#70b5f9] transition-colors">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">AI & Deep Learning Hub</span>
            </Link>
            <Link to="/groups" className="flex items-center gap-2 hover:text-[#0a66c2] dark:hover:text-[#70b5f9] transition-colors">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">Full-Stack Tech Leads</span>
            </Link>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-[#383b40]">
            <Link to="/groups" className="text-xs font-semibold text-[#0a66c2] dark:text-[#70b5f9] hover:underline block text-center">
              Discover more
            </Link>
          </div>
        </div>
      </aside>

      {/* Center Feed (Desktop 6 cols) */}
      <section className="lg:col-span-6 space-y-3">
        {/* Create Post Widget */}
        <CreatePostCard onPostCreated={handlePostCreated} />

        {/* Sort By Filter Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <div className="w-full flex items-center">
            <div className="flex-1 h-px bg-slate-300 dark:bg-[#383b40]" />
            <div className="px-2 flex items-center gap-1">
              <span>Sort by:</span>
              <button
                onClick={() => setSortBy(sortBy === 'top' ? 'recent' : 'top')}
                className="font-bold text-slate-800 dark:text-slate-200 hover:text-[#0a66c2] dark:hover:text-[#70b5f9] flex items-center gap-0.5 cursor-pointer"
              >
                <span>{sortBy === 'top' ? 'Top' : 'Recent'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Posts Stream */}
        {isLoading ? (
          <div className="space-y-3">
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : sortedPosts.length === 0 ? (
          <div className="p-10 text-center bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] space-y-2">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No posts in your feed yet</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Follow professionals or publish your first update to build your feed.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPostDeleted={handlePostDeleted}
                onPostUpdated={handlePostUpdated}
              />
            ))}

            {/* Load More Pagination */}
            {hasMore && (
              <div className="pt-2 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  isLoading={isLoadingMore}
                  onClick={() => {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    fetchFeed(nextPage);
                  }}
                  icon={<Layers className="w-4 h-4" />}
                >
                  Load More Posts
                </Button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Right Sidebar (Desktop 3 cols) */}
      <aside className="lg:col-span-3 space-y-3">
        {/* LinkedIn News Card */}
        <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">LinkedIn News</h3>
            <Info className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          </div>

          <div className="space-y-2 text-xs">
            {(showMoreNews ? newsItems : newsItems.slice(0, 5)).map((item, idx) => (
              <div key={idx} className="group cursor-pointer">
                <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#0a66c2] dark:group-hover:text-[#70b5f9] leading-snug">
                  • {item.title}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 pl-2.5">
                  {item.time} • {item.readers}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowMoreNews(!showMoreNews)}
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 pt-1 cursor-pointer"
          >
            <span>{showMoreNews ? 'Show less' : 'Show more'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMoreNews ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Add to your feed (Recommended People) */}
        {recommendations.length > 0 && (
          <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] p-4 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add to your feed</h3>

            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div key={rec.id} className="flex items-start gap-3">
                  <Link to={`/profile/${rec.id}`}>
                    <Avatar src={rec.avatarUrl} name={rec.fullName} size="md" className="flex-shrink-0" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/profile/${rec.id}`} className="block font-bold text-xs text-slate-900 dark:text-white hover:text-[#0a66c2] dark:hover:text-[#70b5f9] truncate">
                      {rec.fullName}
                    </Link>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-snug">
                      {rec.headline || 'LinkedIn Member'}
                    </p>
                    <button
                      onClick={() => handleQuickConnect(rec.id, rec.fullName)}
                      className="mt-1.5 inline-flex items-center gap-1 px-3.5 py-1 rounded-full border border-slate-600 dark:border-slate-400 hover:border-slate-900 dark:hover:border-white text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#282c31] transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Connect</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/network" className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 pt-1">
              <span>View all recommendations</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* LinkedIn Mini Footer */}
        <div className="px-2 text-[11px] text-slate-500 dark:text-slate-400 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <Link to="/about" className="hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:underline">About</Link>
            <a href="#" className="hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:underline">Accessibility</a>
            <a href="#" className="hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:underline">Help Center</a>
            <a href="#" className="hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:underline">Privacy & Terms</a>
            <a href="#" className="hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:underline">Ad Choices</a>
            <a href="#" className="hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:underline">Advertising</a>
            <a href="#" className="hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:underline">Business Services</a>
          </div>
          <div className="flex items-center justify-center gap-1 font-bold text-slate-700 dark:text-slate-300 pt-1">
            <span className="text-[#0a66c2] dark:text-[#70b5f9]">Linked</span>
            <span className="bg-[#0a66c2] dark:bg-[#70b5f9] text-white dark:text-slate-900 px-1 py-0.5 rounded-[2px] text-[10px]">in</span>
            <span className="font-normal text-slate-500 dark:text-slate-400 ml-1">LinkedIn Corporation © 2025</span>
          </div>
        </div>
      </aside>
    </div>
  );
};
