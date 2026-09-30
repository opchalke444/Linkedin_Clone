import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, Check, Search, ShieldCheck } from 'lucide-react';
import { GroupItem } from '../types';
import { groupApi } from '../api/group.api';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { useToast } from '../contexts/ToastContext';

export const GroupsPage: React.FC = () => {
  const { success, error } = useToast();

  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'joined'>('all');

  // Create Group Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const res = await groupApi.getAllGroups();
      if (res.success && res.data) {
        setGroups(res.data);
      }
    } catch (err) {
      console.error('Error fetching groups:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleJoin = async (id: string, name: string) => {
    try {
      await groupApi.joinGroup(id);
      success(`Joined ${name}!`);
      setGroups((prev) =>
        prev.map((g) =>
          g.id === id ? { ...g, isMember: true, memberCount: g.memberCount + 1 } : g
        )
      );
    } catch (err: any) {
      error(err.message || 'Failed to join group');
    }
  };

  const handleLeave = async (id: string, name: string) => {
    try {
      await groupApi.leaveGroup(id);
      success(`Left ${name}`);
      setGroups((prev) =>
        prev.map((g) =>
          g.id === id ? { ...g, isMember: false, memberCount: Math.max(0, g.memberCount - 1) } : g
        )
      );
    } catch (err: any) {
      error(err.message || 'Failed to leave group');
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !newGroupDesc.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await groupApi.createGroup({
        name: newGroupName.trim(),
        description: newGroupDesc.trim(),
      });
      if (res.success && res.data) {
        success('Group created successfully!');
        setIsCreateOpen(false);
        setNewGroupName('');
        setNewGroupDesc('');
        fetchGroups();
      }
    } catch (err: any) {
      error(err.message || 'Failed to create group');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredGroups = groups.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description?.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'joined') return matchesSearch && g.isMember;
    return matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-2">
      {/* LinkedIn Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1d2226] p-5 rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white font-['Outfit'] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0a66c2]" />
            LinkedIn Groups
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Connect with trusted professionals, industry leaders, and specialized communities.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Create group
        </Button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#1d2226] p-3.5 rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              activeTab === 'all'
                ? 'bg-[#0a66c2] text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#282c31]'
            }`}
          >
            All groups ({groups.length})
          </button>
          <button
            onClick={() => setActiveTab('joined')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              activeTab === 'joined'
                ? 'bg-[#0a66c2] text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#282c31]'
            }`}
          >
            Your groups ({groups.filter((g) => g.isMember).length})
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-[#282c31] border border-transparent dark:border-[#383b40] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0a66c2] focus:bg-white dark:focus:bg-[#282c31] outline-none transition-all"
          />
        </div>
      </div>

      {/* Groups Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          <div className="h-40 bg-slate-200 dark:bg-[#282c31] rounded-lg" />
          <div className="h-40 bg-slate-200 dark:bg-[#282c31] rounded-lg" />
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="bg-white dark:bg-[#1d2226] p-12 rounded-lg border border-[#e0dfdc] dark:border-[#383b40] text-center space-y-3">
          <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No groups found</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {activeTab === 'joined'
              ? "You haven't joined any groups yet. Browse all groups above to discover communities."
              : 'Try changing your search terms or create a new group.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className="bg-white dark:bg-[#1d2226] rounded-lg p-5 border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-[#0a66c2]/20 text-[#0a66c2] dark:text-[#70b5f9] flex items-center justify-center font-bold text-lg border border-blue-200 dark:border-[#0a66c2]/30 flex-shrink-0">
                      {group.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <Link to={`/groups/${group.slug}`} className="group">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0a66c2] dark:group-hover:text-[#70b5f9] group-hover:underline transition-colors">
                          {group.name}
                        </h3>
                      </Link>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <Users className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        {group.memberCount} members
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-3 line-clamp-3">
                  {group.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#383b40] flex items-center justify-between">
                <Link
                  to={`/groups/${group.slug}`}
                  className="text-xs font-semibold text-[#0a66c2] dark:text-[#70b5f9] hover:underline"
                >
                  View group →
                </Link>

                {group.isMember ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                    onClick={() => handleLeave(group.id, group.name)}
                    icon={<Check className="w-3.5 h-3.5" />}
                  >
                    Joined
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#0a66c2] text-[#0a66c2] hover:bg-blue-50 dark:hover:bg-[#0a66c2]/20"
                    onClick={() => handleJoin(group.id, group.name)}
                  >
                    Join
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create a group" maxWidth="md">
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <Input
            label="Group name"
            placeholder="e.g. Next.js Architects & Cloud Engineers"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              rows={4}
              placeholder="What is the purpose of your group? What discussions happen here?"
              value={newGroupDesc}
              onChange={(e) => setNewGroupDesc(e.target.value)}
              className="w-full text-xs rounded-lg p-3 border border-slate-200 dark:border-[#383b40] bg-white dark:bg-[#282c31] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#383b40]">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
              Back
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
