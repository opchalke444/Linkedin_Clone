import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Users, Compass, FileText, Filter, MapPin, Briefcase } from 'lucide-react';
import { searchApi } from '../api/search.api';
import { Avatar } from '../components/common/Avatar';
import { PostCard } from '../components/feed/PostCard';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const typeParam = searchParams.get('type') || 'all';

  const [query, setQuery] = useState(queryParam);
  const [activeTab, setActiveTab] = useState(typeParam);
  const [locationFilter, setLocationFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

  const [results, setResults] = useState<{
    users: any[];
    posts: any[];
    groups: any[];
    skills: any[];
  }>({
    users: [],
    posts: [],
    groups: [],
    skills: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const performSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await searchApi.search({
        q: query,
        type: activeTab as any,
        location: locationFilter || undefined,
        skill: skillFilter || undefined,
      });
      if (res.success && res.data) {
        setResults(res.data);
      }
    } catch (err) {
      console.error('Error during search:', err);
    } finally {
      setIsLoading(false);
    }
  }, [query, activeTab, locationFilter, skillFilter]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query, type: activeTab });
    performSearch();
  };

  const tabs = [
    { key: 'all', label: 'All Results' },
    { key: 'users', label: 'People' },
    { key: 'posts', label: 'Posts' },
    { key: 'groups', label: 'Groups' },
    { key: 'skills', label: 'Skills' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Search Bar & Filters Card */}
      <div className="bg-white dark:bg-[#1d2226] p-4 rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute inset-y-0 left-0 pl-3 w-4 h-4 my-auto text-slate-400" />
            <input
              type="text"
              placeholder="Search by keywords, names, technologies, or topics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-md bg-slate-50 dark:bg-[#282c31] border border-slate-200 dark:border-[#383b40] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:bg-white dark:focus:bg-[#282c31] focus:border-[#0a66c2]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-[#0a66c2] hover:bg-[#004182] rounded-md transition-colors"
          >
            Search
          </button>
        </form>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-[#383b40]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setSearchParams({ q: query, type: tab.key });
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                activeTab === tab.key
                  ? 'bg-[#0a66c2] text-white'
                  : 'bg-slate-100 dark:bg-[#282c31] hover:bg-slate-200 dark:hover:bg-[#383b40] text-slate-700 dark:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {isLoading ? (
        <div className="p-8 text-center text-slate-400 dark:text-slate-500 space-y-2 bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40]">
          <div className="w-6 h-6 border-2 border-[#0a66c2] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">Searching LinkedIn network...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* People Results */}
          {(activeTab === 'all' || activeTab === 'users') && results.users.length > 0 && (
            <section className="bg-white dark:bg-[#1d2226] rounded-lg p-5 border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0a66c2]" />
                People ({results.users.length})
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-[#383b40]">
                {results.users.map((u) => (
                  <div key={u.id} className="py-3 first:pt-0 flex items-center justify-between gap-3">
                    <Link to={`/profile/${u.id}`} className="flex items-center gap-3 min-w-0 group">
                      <Avatar src={u.avatarUrl} name={u.fullName} size="md" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0a66c2] truncate">
                          {u.fullName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{u.headline || 'LinkedIn Member'}</p>
                        {u.location && (
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{u.location}</p>
                        )}
                      </div>
                    </Link>

                    <Link to={`/profile/${u.id}`}>
                      <button className="px-3 py-1 rounded-full border border-[#0a66c2] text-[#0a66c2] hover:bg-blue-50 dark:hover:bg-[#0a66c2]/20 text-xs font-semibold transition-colors">
                        View Profile
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Posts Results */}
          {(activeTab === 'all' || activeTab === 'posts') && results.posts.length > 0 && (
            <section className="space-y-3">
              <div className="bg-white dark:bg-[#1d2226] p-3 rounded-lg border border-[#e0dfdc] dark:border-[#383b40]">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0a66c2]" />
                  Posts ({results.posts.length})
                </h3>
              </div>
              <div className="space-y-3">
                {results.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* Groups Results */}
          {(activeTab === 'all' || activeTab === 'groups') && results.groups.length > 0 && (
            <section className="bg-white dark:bg-[#1d2226] rounded-lg p-5 border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#0a66c2]" />
                Groups ({results.groups.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.groups.map((g) => (
                  <Link
                    key={g.id}
                    to={`/groups/${g.slug}`}
                    className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#282c31] border border-slate-200 dark:border-[#383b40] hover:bg-blue-50/40 dark:hover:bg-[#0a66c2]/10 hover:border-blue-200 dark:hover:border-[#0a66c2]/30 transition-all space-y-1 group"
                  >
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0a66c2]">{g.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{g.description}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{g.memberCount} members</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* No results banner */}
          {results.users.length === 0 && results.posts.length === 0 && results.groups.length === 0 && (
            <div className="p-12 text-center bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] space-y-2">
              <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-800 dark:text-white">No results found for "{query}"</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Check your spelling or try different keywords.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
