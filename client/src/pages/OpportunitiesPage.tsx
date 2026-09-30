import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  MapPin,
  Bookmark,
  CheckCircle2,
  Building2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { OpportunityItem } from '../types';
import { opportunityApi } from '../api/opportunity.api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';

export const OpportunitiesPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);

  // Apply modal
  const [activeApplyingJob, setActiveApplyingJob] = useState<OpportunityItem | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);

  const fetchOpportunities = async () => {
    try {
      setIsLoading(true);
      const res = await opportunityApi.getOpportunities();
      if (res.success && res.data) {
        setOpportunities(res.data);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleEasyApply = async () => {
    if (!activeApplyingJob) return;
    setIsApplying(true);
    try {
      await opportunityApi.apply(activeApplyingJob.id);
      setAppliedJobIds((prev) => [...prev, activeApplyingJob.id]);
      success(`Applied to ${activeApplyingJob.title} at ${activeApplyingJob.company}!`);
      setActiveApplyingJob(null);
    } catch (err: any) {
      error(err.message || 'Failed to apply');
    } finally {
      setIsApplying(false);
    }
  };

  const toggleSaveJob = (id: string) => {
    if (savedJobIds.includes(id)) {
      setSavedJobIds((prev) => prev.filter((jId) => jId !== id));
      success('Job removed from saved items');
    } else {
      setSavedJobIds((prev) => [...prev, id]);
      success('Job saved');
    }
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    if (selectedType !== 'ALL' && opp.type !== selectedType) return false;
    if (searchTitle.trim()) {
      const q = searchTitle.toLowerCase();
      const match =
        opp.title.toLowerCase().includes(q) ||
        opp.company.toLowerCase().includes(q) ||
        opp.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (searchLocation.trim()) {
      const locQ = searchLocation.toLowerCase();
      if (!opp.location.toLowerCase().includes(locQ)) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Top Search Bar */}
      <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none p-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
          {/* Title / Company input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, skill, or company"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-[#282c31] hover:bg-white dark:hover:bg-[#282c31] focus:bg-white dark:focus:bg-[#282c31] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-md border border-slate-200 dark:border-[#383b40] outline-none focus:border-[#0a66c2]"
            />
          </div>

          {/* Location input */}
          <div className="md:col-span-4 relative">
            <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Bengaluru, Mumbai, Hyderabad, Gurugram, or Remote"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-[#282c31] hover:bg-white dark:hover:bg-[#282c31] focus:bg-white dark:focus:bg-[#282c31] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-md border border-slate-200 dark:border-[#383b40] outline-none focus:border-[#0a66c2]"
            />
          </div>

          {/* Search Button */}
          <div className="md:col-span-2">
            <button
              onClick={() => {}}
              className="w-full h-full py-2 bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-semibold rounded-md transition-colors"
            >
              Search Jobs
            </button>
          </div>
        </div>

        {/* Quick Indian Tech Hub Filter Chips */}
        <div className="flex items-center gap-1.5 pt-2.5 overflow-x-auto text-[11px] font-medium border-t border-slate-100 dark:border-[#383b40] mt-2">
          <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider mr-1">Popular:</span>
          {['All India', 'Bengaluru', 'Mumbai', 'Hyderabad', 'Delhi NCR', 'Pune', 'Remote'].map((city) => {
            const isSelected = city === 'All India' ? !searchLocation : searchLocation.toLowerCase() === city.toLowerCase();
            return (
              <button
                key={city}
                onClick={() => setSearchLocation(city === 'All India' ? '' : city)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-[#0a66c2] text-white font-semibold'
                    : 'bg-slate-100 dark:bg-[#282c31] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#383b40]'
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Navigation */}
        <aside className="lg:col-span-4 space-y-3">
          <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-[#383b40] pb-2">
              <Briefcase className="w-4 h-4 text-[#0a66c2]" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Job Preferences</h2>
            </div>

            <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#282c31] font-medium cursor-pointer">
                <span>Saved Jobs</span>
                <span className="font-bold text-[#0a66c2] dark:text-[#70b5f9]">{savedJobIds.length}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#282c31] font-medium cursor-pointer">
                <span>Applied Jobs</span>
                <span className="font-bold text-slate-900 dark:text-white">{appliedJobIds.length}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#282c31] font-medium cursor-pointer">
                <span>Job Alerts</span>
                <span className="font-bold text-slate-900 dark:text-white">4</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#282c31] font-medium cursor-pointer">
                <span>Demonstrate Skills</span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Ready</span>
              </div>
            </div>
          </div>

          {/* Post Free Job Card */}
          <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none p-4 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Post a job for free</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Find qualified candidates fast with LinkedIn job listings.
            </p>
            <button className="w-full py-1.5 border border-[#0a66c2] text-[#0a66c2] dark:text-[#70b5f9] hover:bg-blue-50 dark:hover:bg-[#0a66c2]/20 text-xs font-semibold rounded-full transition-colors mt-2">
              Post a free job
            </button>
          </div>
        </aside>

        {/* Right Content: Job Listings */}
        <section className="lg:col-span-8 space-y-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap bg-white dark:bg-[#1d2226] p-3 rounded-lg border border-[#e0dfdc] dark:border-[#383b40] text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-semibold mr-1">Filter:</span>
            {['ALL', 'FULL_TIME', 'INTERNSHIP', 'PROJECT'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  selectedType === type
                    ? 'bg-[#0a66c2] text-white'
                    : 'bg-slate-100 dark:bg-[#282c31] hover:bg-slate-200 dark:hover:bg-[#383b40] text-slate-700 dark:text-slate-300'
                }`}
              >
                {type === 'ALL' ? 'All Roles' : type.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Header */}
          <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none p-4 space-y-1">
            <h1 className="text-base font-bold text-slate-900 dark:text-white">Top job picks for you</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Based on your profile, experience, and skill set.
            </p>
          </div>

          {/* Job List */}
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-32 bg-white rounded-lg border border-[#e0dfdc] animate-pulse" />
              <div className="h-32 bg-white rounded-lg border border-[#e0dfdc] animate-pulse" />
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-lg border border-[#e0dfdc] space-y-2">
              <p className="text-sm font-bold text-slate-800">No jobs match your criteria</p>
              <p className="text-xs text-slate-500">Try broadening your search keywords or role filters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOpportunities.map((job) => {
                const isApplied = appliedJobIds.includes(job.id);
                const isSaved = savedJobIds.includes(job.id);
                return (
                  <div
                    key={job.id}
                    className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none p-4 space-y-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-[#0a66c2]/20 border border-blue-100 dark:border-[#0a66c2]/30 flex items-center justify-center font-bold text-[#0a66c2] dark:text-[#70b5f9] text-sm flex-shrink-0">
                          {job.company.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:underline cursor-pointer">
                            {job.title}
                          </h3>
                          <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">{job.company}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                            {job.location} • {job.type.replace('_', ' ')}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-[#282c31]"
                        title={isSaved ? 'Unsave job' : 'Save job'}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-slate-800 dark:fill-white text-slate-800 dark:text-white' : ''}`} />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Match & Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-[#383b40] text-xs">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          Easy Apply
                        </span>
                        {job.matchScore && (
                          <span className="text-[11px] font-semibold text-[#0a66c2] dark:text-[#70b5f9] bg-blue-50 dark:bg-[#0a66c2]/20 px-2 py-0.5 rounded-full">
                            {job.matchScore}% skill match
                          </span>
                        )}
                        {job.stipend && (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {job.stipend}
                          </span>
                        )}
                      </div>

                      <div>
                        {isApplied ? (
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full">
                            Applied ✓
                          </span>
                        ) : (
                          <button
                            onClick={() => setActiveApplyingJob(job)}
                            className="px-4 py-1.5 text-xs font-semibold bg-[#0a66c2] hover:bg-[#004182] text-white rounded-full transition-colors"
                          >
                            Easy Apply
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Easy Apply Modal */}
      {activeApplyingJob && (
        <Modal
          isOpen={Boolean(activeApplyingJob)}
          onClose={() => setActiveApplyingJob(null)}
          title={`Apply to ${activeApplyingJob.company}`}
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{activeApplyingJob.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{activeApplyingJob.company} • {activeApplyingJob.location}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-[#282c31] rounded-lg border border-slate-200 dark:border-[#383b40] space-y-2 text-xs">
              <p className="font-semibold text-slate-800 dark:text-slate-200">Contact Info (from your LinkedIn Profile):</p>
              <p className="text-slate-600 dark:text-slate-400">Full Name: <span className="font-medium text-slate-900 dark:text-white">{user?.fullName}</span></p>
              <p className="text-slate-600 dark:text-slate-400">Email: <span className="font-medium text-slate-900 dark:text-white">{user?.email}</span></p>
              <p className="text-slate-600 dark:text-slate-400">Headline: <span className="font-medium text-slate-900 dark:text-white">{user?.headline || 'LinkedIn Member'}</span></p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Resume / Profile Summary</label>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your profile work experience, education, and verified skills will be submitted directly to {activeApplyingJob.company}.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#383b40]">
              <button
                type="button"
                onClick={() => setActiveApplyingJob(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#282c31] rounded-full"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isApplying}
                onClick={handleEasyApply}
                className="px-5 py-1.5 text-xs font-semibold bg-[#0a66c2] hover:bg-[#004182] text-white rounded-full transition-colors"
              >
                {isApplying ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
