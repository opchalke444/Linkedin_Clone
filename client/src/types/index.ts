export interface User {
  id: string;
  email: string;
  fullName: string;
  headline?: string | null;
  location?: string | null;
  dateOfBirth?: string | null;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
  profile?: Profile | null;
  educations?: Education[];
  experiences?: Experience[];
  skills?: UserSkill[];
  connectionCount?: number;
  postsCount?: number;
  connectionStatus?: 'SELF' | 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'CONNECTED';
  connectionId?: string | null;
  sharedSkills?: string[];
  completeness?: ProfileCompleteness;
  unreadNotificationsCount?: number;
}

export interface Profile {
  id: string;
  userId: string;
  about?: string | null;
  industry?: string | null;
  preferredRole?: string | null;
  portfolioUrl?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  resumeUrl?: string | null;
  profileCompleteness: number;
  isOpenToWork?: boolean;
}

export interface Education {
  id: string;
  userId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number | null;
  grade?: string | null;
  description?: string | null;
}

export interface Experience {
  id: string;
  userId: string;
  company: string;
  position: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  currentlyWorking: boolean;
  description?: string | null;
}

export interface Skill {
  id: string;
  name: string;
  category?: string | null;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  endorsements: number;
  skill: Skill;
}

export interface ProfileCompleteness {
  percentage: number;
  level: 'Beginner' | 'Intermediate' | 'All-Star';
  completed: string[];
  missing: {
    key: string;
    label: string;
    action: string;
    points: number;
  }[];
  nextStep: string;
}

export type ReactionType = 'LIKE' | 'CELEBRATE' | 'SUPPORT' | 'LOVE' | 'INSIGHTFUL';

export interface Post {
  id: string;
  authorId: string;
  content: string;
  imageUrl?: string | null;
  linkUrl?: string | null;
  tags?: string | null;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    fullName: string;
    headline?: string | null;
    avatarUrl?: string | null;
    location?: string | null;
  };
  userReaction?: ReactionType | null;
  _count?: {
    reactions: number;
    comments: number;
  };
  _ranking?: {
    feedScore: number;
    breakdown: {
      connectionScore: number;
      recencyScore: number;
      engagementScore: number;
      interestScore: number;
    };
  };
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  parentId?: string | null;
  content: string;
  createdAt: string;
  author: {
    id: string;
    fullName: string;
    headline?: string | null;
    avatarUrl?: string | null;
  };
  replies?: Comment[];
}

export interface ConnectionItem {
  connectionId: string;
  connectedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    headline?: string | null;
    avatarUrl?: string | null;
    location?: string | null;
    skills?: { skill: Skill }[];
  };
}

export interface PendingRequestItem {
  id: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  sender?: {
    id: string;
    fullName: string;
    headline?: string | null;
    avatarUrl?: string | null;
    location?: string | null;
    skills?: { skill: Skill }[];
  };
  receiver?: {
    id: string;
    fullName: string;
    headline?: string | null;
    avatarUrl?: string | null;
    location?: string | null;
    skills?: { skill: Skill }[];
  };
}

export interface ConversationItem {
  id: string;
  peer: {
    id: string;
    fullName: string;
    avatarUrl?: string | null;
    headline?: string | null;
    isOnline: boolean;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
    senderId: string;
  } | null;
  unreadCount: number;
  lastMessageAt: string;
}

export interface MessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    fullName: string;
    avatarUrl?: string | null;
  };
}

export interface NotificationItem {
  id: string;
  recipientId: string;
  actorId: string;
  type:
    | 'CONNECTION_REQUEST'
    | 'CONNECTION_ACCEPTED'
    | 'POST_REACTION'
    | 'POST_COMMENT'
    | 'COMMENT_REPLY'
    | 'MESSAGE_RECEIVED'
    | 'GROUP_INVITE';
  referenceId?: string | null;
  isRead: boolean;
  createdAt: string;
  actor: {
    id: string;
    fullName: string;
    avatarUrl?: string | null;
    headline?: string | null;
  };
}

export interface GroupItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  creatorId: string;
  memberCount: number;
  isMember?: boolean;
  myRole?: 'ADMIN' | 'MEMBER' | null;
  creator?: {
    id: string;
    fullName: string;
    avatarUrl?: string | null;
  };
  members?: any[];
  posts?: any[];
  _count?: {
    members: number;
    posts: number;
  };
}

export interface OpportunityItem {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'INTERNSHIP' | 'FULL_TIME' | 'PROJECT' | 'PART_TIME';
  description: string;
  requiredSkills: string;
  experienceLevel: string;
  stipend?: string | null;
  externalUrl?: string | null;
  createdAt: string;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  hasApplied: boolean;
  applicationDetails?: {
    id: string;
    status: string;
    appliedAt: string;
  } | null;
}
