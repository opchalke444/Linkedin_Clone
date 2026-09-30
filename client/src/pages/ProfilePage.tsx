import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Edit3,
  Plus,
  Camera,
  Globe,
  Github,
  Linkedin,
  UserCheck,
  UserPlus,
  Clock,
  MessageSquare,
  ThumbsUp,
  Trash2,
  Eye,
  BarChart2,
  Search,
  Award,
} from 'lucide-react';
import { User } from '../types';
import { userApi } from '../api/user.api';
import { connectionApi } from '../api/connection.api';
import { postApi } from '../api/post.api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { PostCard } from '../components/feed/PostCard';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { ExperienceModal } from '../components/profile/ExperienceModal';
import { EducationModal } from '../components/profile/EducationModal';
import { SkillModal } from '../components/profile/SkillModal';

export const ProfilePage: React.FC = () => {
  const { id, userId } = useParams<{ id?: string; userId?: string }>();
  const { user: currentUser, refreshUser } = useAuth();
  const { success, error } = useToast();

  const profileId = userId || id;
  const isOwnProfile = !profileId || profileId === currentUser?.id;
  const targetUserId = isOwnProfile ? currentUser?.id : profileId;

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenToWork, setIsOpenToWork] = useState(() => {
    const saved = targetUserId ? localStorage.getItem(`linkedin_opentowork_${targetUserId}`) : null;
    return saved !== null ? saved === 'true' : true;
  });

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddExpOpen, setIsAddExpOpen] = useState(false);
  const [isAddEduOpen, setIsAddEduOpen] = useState(false);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);

  // File uploads
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!targetUserId) return;
    try {
      setIsLoading(true);
      const [userRes, postsRes] = await Promise.all([
        userApi.getUserById(targetUserId),
        postApi.getFeed(1, 10, targetUserId),
      ]);

      if (userRes.success && userRes.data) {
        setProfileUser(userRes.data);
        setIsOpenToWork(userRes.data.profile?.isOpenToWork ?? true);
      }
      if (postsRes.success && postsRes.data) {
        setUserPosts(postsRes.data);
      }
    } catch (err: any) {
      error(err.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }, [targetUserId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setIsUploadingMedia(true);
    try {
      const formData = new FormData();
      formData.append('avatar', e.target.files[0]);
      await userApi.uploadAvatar(formData);
      await refreshUser();
      await fetchProfile();
      success('Profile photo updated successfully!');
    } catch (err: any) {
      error(err.message || 'Failed to upload photo');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  // Handle banner upload
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setIsUploadingMedia(true);
    try {
      const formData = new FormData();
      formData.append('banner', e.target.files[0]);
      await userApi.uploadBanner(formData);
      await refreshUser();
      await fetchProfile();
      success('Cover banner updated successfully!');
    } catch (err: any) {
      error(err.message || 'Failed to upload banner');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  // Connection handlers
  const handleConnectAction = async () => {
    if (!profileUser) return;
    try {
      if (profileUser.connectionStatus === 'NONE') {
        await connectionApi.sendRequest(profileUser.id);
        success(`Connection request sent to ${profileUser.fullName}!`);
        setProfileUser((prev) => (prev ? { ...prev, connectionStatus: 'PENDING_SENT' } : null));
      } else if (profileUser.connectionStatus === 'PENDING_RECEIVED' && profileUser.connectionId) {
        await connectionApi.acceptRequest(profileUser.connectionId);
        success(`Connected with ${profileUser.fullName}!`);
        setProfileUser((prev) => (prev ? { ...prev, connectionStatus: 'CONNECTED' } : null));
      }
    } catch (err: any) {
      error(err.message || 'Action failed');
    }
  };

  const handleEndorseSkill = async (userSkillId: string) => {
    try {
      await userApi.endorseSkill(userSkillId);
      success('Skill endorsed!');
      fetchProfile();
    } catch (err: any) {
      error(err.message || 'Failed to endorse');
    }
  };

  const handleDeleteSkill = async (userSkillId: string) => {
    try {
      await userApi.removeSkill(userSkillId);
      success('Skill removed');
      fetchProfile();
      refreshUser();
    } catch (err: any) {
      error(err.message || 'Failed to remove');
    }
  };

  const handleDeleteExperience = async (expId: string) => {
    try {
      await userApi.deleteExperience(expId);
      success('Experience removed');
      fetchProfile();
    } catch (err: any) {
      error(err.message || 'Failed to delete experience');
    }
  };

  const handleDeleteEducation = async (eduId: string) => {
    try {
      await userApi.deleteEducation(eduId);
      success('Education removed');
      fetchProfile();
    } catch (err: any) {
      error(err.message || 'Failed to delete education');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 animate-pulse">
        <div className="h-64 bg-slate-200 dark:bg-[#282c31] rounded-lg" />
        <div className="h-48 bg-slate-200 dark:bg-[#282c31] rounded-lg" />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-3 bg-white dark:bg-[#1d2226] p-8 rounded-lg border border-[#e0dfdc] dark:border-[#383b40]">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Profile Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">The user profile you requested does not exist or has been removed.</p>
        <Link to="/feed">
          <Button size="sm" variant="primary">Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-3 pb-12">
      {/* Hidden file inputs for upload */}
      {isOwnProfile && (
        <>
          <input
            type="file"
            ref={avatarInputRef}
            onChange={handleAvatarUpload}
            accept="image/*"
            className="hidden"
          />
          <input
            type="file"
            ref={bannerInputRef}
            onChange={handleBannerUpload}
            accept="image/*"
            className="hidden"
          />
        </>
      )}

      {/* Main Profile Header Card */}
      <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none overflow-hidden relative">
        {/* Cover Photo */}
        <div className="h-48 sm:h-56 bg-gradient-to-r from-[#004182] via-[#0a66c2] to-[#3880c8] relative">
          {profileUser.bannerUrl && (
            <img
              src={profileUser.bannerUrl}
              alt="Profile Cover"
              className="w-full h-full object-cover"
            />
          )}

          {isOwnProfile && (
            <button
              onClick={() => bannerInputRef.current?.click()}
              disabled={isUploadingMedia}
              className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-[#1d2226]/90 hover:bg-white dark:hover:bg-[#282c31] text-slate-700 dark:text-slate-200 rounded-full shadow-md transition-colors"
              title="Change cover photo"
            >
              <Camera className="w-4 h-4 text-[#0a66c2]" />
            </button>
          )}
        </div>

        {/* Profile Details Container */}
        <div className="px-6 pb-6 pt-0 relative">
          {/* Avatar and Top Actions Bar */}
          <div className="flex justify-between items-end -mt-20 mb-4 flex-wrap gap-4">
            {/* Overlapping Avatar with authentic circular border */}
            <div className="relative group">
              <div
                className={`relative rounded-full p-1 bg-white dark:bg-[#1d2226] shadow-lg transition-all ${
                  isOpenToWork
                    ? 'ring-4 ring-[#057642] ring-offset-2 ring-offset-white dark:ring-offset-[#1d2226]'
                    : 'ring-4 ring-white dark:ring-[#1d2226]'
                }`}
              >
                <Avatar
                  src={profileUser.avatarUrl}
                  name={profileUser.fullName}
                  size="2xl"
                  className="rounded-full shadow-inner"
                />

                {/* Circular #OpenToWork badge anchored directly beneath the circle */}
                {isOpenToWork && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-[#057642] text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-md whitespace-nowrap border-2 border-white dark:border-[#1d2226] z-10">
                    #OpenToWork
                  </span>
                )}
              </div>

              {isOwnProfile && (
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={isUploadingMedia}
                  className="absolute bottom-1 right-1 p-2 bg-white dark:bg-[#282c31] hover:bg-slate-50 dark:hover:bg-[#383b40] text-[#0a66c2] rounded-full ring-2 ring-white dark:ring-[#1d2226] shadow-md transition-colors z-20"
                  title="Upload profile picture"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap pt-2 sm:pt-0">
              {isOwnProfile ? (
                <>
                  <button
                    onClick={async () => {
                      const next = !isOpenToWork;
                      setIsOpenToWork(next);
                      if (targetUserId) {
                        localStorage.setItem(`linkedin_opentowork_${targetUserId}`, String(next));
                      }
                      try {
                        await userApi.updateProfile({ isOpenToWork: next });
                        await refreshUser();
                      } catch {
                        // Keep optimistic state
                      }
                      success(next ? '#OpenToWork status enabled on profile!' : '#OpenToWork status removed');
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      isOpenToWork
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-[#0a66c2] text-white hover:bg-[#004182]'
                    }`}
                  >
                    {isOpenToWork ? 'Open to work: On' : 'Open to work'}
                  </button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddExpOpen(true)}
                  >
                    Add section
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditProfileOpen(true)}
                    icon={<Edit3 className="w-3.5 h-3.5" />}
                  >
                    Edit profile
                  </Button>
                </>
              ) : (
                <>
                  {profileUser.connectionStatus === 'CONNECTED' && (
                    <Button variant="outline" size="sm" icon={<UserCheck className="w-4 h-4 text-emerald-600" />}>
                      Connected
                    </Button>
                  )}
                  {profileUser.connectionStatus === 'PENDING_SENT' && (
                    <Button variant="ghost" size="sm" className="bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300" disabled>
                      <Clock className="w-4 h-4 mr-1.5" />
                      Pending
                    </Button>
                  )}
                  {profileUser.connectionStatus === 'PENDING_RECEIVED' && (
                    <Button variant="primary" size="sm" onClick={handleConnectAction}>
                      Accept
                    </Button>
                  )}
                  {profileUser.connectionStatus === 'NONE' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleConnectAction}
                      icon={<UserPlus className="w-4 h-4" />}
                    >
                      Connect
                    </Button>
                  )}
                  <Link to={`/messages/${profileUser.id}`}>
                    <Button variant="outline" size="sm" icon={<MessageSquare className="w-4 h-4" />}>
                      Message
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Name & Headline */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {profileUser.fullName}
              </h1>
              {isOwnProfile && (
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="p-1 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-[#282c31]"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug font-normal max-w-2xl">
              {profileUser.headline || 'LinkedIn Member'}
            </p>
          </div>

          {/* Location & Connections Count */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-2">
            {profileUser.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                {profileUser.location}
              </span>
            )}
            {profileUser.profile?.industry && (
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                {profileUser.profile.industry}
              </span>
            )}
            <span>•</span>
            <Link to="/network" className="font-bold text-[#0a66c2] hover:underline">
              {profileUser.connectionCount || 0} connections
            </Link>
          </div>

          {/* External Links */}
          {(profileUser.profile?.portfolioUrl || profileUser.profile?.githubUrl || profileUser.profile?.linkedinUrl) && (
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 dark:border-[#383b40] mt-3 text-xs">
              {profileUser.profile.portfolioUrl && (
                <a
                  href={profileUser.profile.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#0a66c2] hover:underline font-semibold"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Portfolio</span>
                </a>
              )}
              {profileUser.profile.githubUrl && (
                <a
                  href={profileUser.profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
              {profileUser.profile.linkedinUrl && (
                <a
                  href={profileUser.profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#0a66c2] hover:underline font-semibold"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn Profile</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Analytics Card (Private to You) */}
      {isOwnProfile && (
        <div className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none p-5 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Analytics</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Private to you</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="flex items-start gap-2.5">
              <Eye className="w-5 h-5 text-slate-600 dark:text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">142 profile views</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Discover who's viewed your profile</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <BarChart2 className="w-5 h-5 text-slate-600 dark:text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">1,894 post impressions</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Check out who's engaging with your posts</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Search className="w-5 h-5 text-slate-600 dark:text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">58 search appearances</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">See how often you appear in search results</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Section */}
      <section className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">About</h3>
          {isOwnProfile && (
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="p-1 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-[#282c31]"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
          {profileUser.profile?.about || 'No summary provided yet. Add an overview of your career and technical skills.'}
        </p>
      </section>

      {/* Experience Section */}
      <section className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Experience</h3>
          {isOwnProfile && (
            <button
              onClick={() => setIsAddExpOpen(true)}
              className="p-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-[#282c31]"
              title="Add experience"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>

        {profileUser.experiences && profileUser.experiences.length > 0 ? (
          <div className="space-y-4 divide-y divide-slate-100 dark:divide-[#383b40]">
            {profileUser.experiences.map((exp) => (
              <div key={exp.id} className="pt-4 first:pt-0 flex items-start justify-between gap-3 group">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-md bg-slate-100 dark:bg-[#282c31] border border-slate-200 dark:border-[#383b40] flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{exp.position}</h4>
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">{exp.company}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(exp.startDate).getFullYear()} -{' '}
                      {exp.currentlyWorking ? 'Present' : exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                      {exp.location && ` • ${exp.location}`}
                    </p>
                    {exp.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 pt-1 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>

                {isOwnProfile && (
                  <button
                    onClick={() => handleDeleteExperience(exp.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 p-1 transition-opacity"
                    title="Delete experience"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No work experience listed yet.</p>
        )}
      </section>

      {/* Education Section */}
      <section className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Education</h3>
          {isOwnProfile && (
            <button
              onClick={() => setIsAddEduOpen(true)}
              className="p-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-[#282c31]"
              title="Add education"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>

        {profileUser.educations && profileUser.educations.length > 0 ? (
          <div className="space-y-4 divide-y divide-slate-100 dark:divide-[#383b40]">
            {profileUser.educations.map((edu) => (
              <div key={edu.id} className="pt-4 first:pt-0 flex items-start justify-between gap-3 group">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-md bg-slate-100 dark:bg-[#282c31] border border-slate-200 dark:border-[#383b40] flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{edu.institution}</h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {edu.degree}, {edu.fieldOfStudy}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {edu.startYear} - {edu.endYear || 'Present'} {edu.grade ? ` • Grade: ${edu.grade}` : ''}
                    </p>
                  </div>
                </div>

                {isOwnProfile && (
                  <button
                    onClick={() => handleDeleteEducation(edu.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 p-1 transition-opacity"
                    title="Delete education"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No education history added yet.</p>
        )}
      </section>

      {/* Skills Section */}
      <section className="bg-white dark:bg-[#1d2226] rounded-lg border border-[#e0dfdc] dark:border-[#383b40] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-none p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Skills</h3>
          {isOwnProfile && (
            <button
              onClick={() => setIsAddSkillOpen(true)}
              className="p-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-[#282c31]"
              title="Add skill"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>

        {profileUser.skills && profileUser.skills.length > 0 ? (
          <div className="space-y-3 divide-y divide-slate-100 dark:divide-[#383b40]">
            {profileUser.skills.map((s) => (
              <div key={s.id} className="pt-3 first:pt-0 flex items-center justify-between group">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{s.skill.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {s.endorsements || 0} endorsement{s.endorsements !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!isOwnProfile && (
                    <button
                      onClick={() => handleEndorseSkill(s.id)}
                      className="px-3 py-1 rounded-full border border-[#0a66c2] text-[#0a66c2] hover:bg-blue-50 dark:hover:bg-[#0a66c2]/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Endorse</span>
                    </button>
                  )}
                  {isOwnProfile && (
                    <button
                      onClick={() => handleDeleteSkill(s.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 p-1.5 transition-opacity"
                      title="Remove skill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No skills added yet.</p>
        )}
      </section>

      {/* User's Recent Posts */}
      {userPosts.length > 0 && (
        <section className="space-y-3 pt-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Activity ({userPosts.length} post{userPosts.length !== 1 ? 's' : ''})
          </h3>
          <div className="space-y-3">
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSuccess={fetchProfile}
      />
      <ExperienceModal
        isOpen={isAddExpOpen}
        onClose={() => setIsAddExpOpen(false)}
        onSuccess={fetchProfile}
      />
      <EducationModal
        isOpen={isAddEduOpen}
        onClose={() => setIsAddEduOpen(false)}
        onSuccess={fetchProfile}
      />
      <SkillModal
        isOpen={isAddSkillOpen}
        onClose={() => setIsAddSkillOpen(false)}
        onSuccess={fetchProfile}
      />
    </div>
  );
};
