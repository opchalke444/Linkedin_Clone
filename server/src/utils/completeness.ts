export interface ProfileCompletenessResult {
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

export function calculateProfileCompleteness(user: {
  fullName?: string | null;
  avatarUrl?: string | null;
  headline?: string | null;
  location?: string | null;
  profile?: { about?: string | null; industry?: string | null; githubUrl?: string | null } | null;
  educations?: any[];
  experiences?: any[];
  skills?: any[];
}): ProfileCompletenessResult {
  const checks = [
    {
      key: 'avatar',
      label: 'Profile Photo',
      action: 'Upload a professional profile photo',
      points: 15,
      isDone: Boolean(user.avatarUrl && user.avatarUrl.trim().length > 0),
    },
    {
      key: 'headline',
      label: 'Professional Headline',
      action: 'Add a descriptive headline (e.g. "Full-Stack Engineer at...")',
      points: 15,
      isDone: Boolean(user.headline && user.headline.trim().length > 5),
    },
    {
      key: 'about',
      label: 'About / Summary',
      action: 'Write a short bio describing your expertise and background',
      points: 15,
      isDone: Boolean(user.profile?.about && user.profile.about.trim().length > 15),
    },
    {
      key: 'location',
      label: 'Location',
      action: 'Add your city or preferred work location',
      points: 10,
      isDone: Boolean(user.location && user.location.trim().length > 2),
    },
    {
      key: 'experience',
      label: 'Work Experience',
      action: 'Add at least one professional work experience or internship',
      points: 15,
      isDone: Boolean(user.experiences && user.experiences.length > 0),
    },
    {
      key: 'education',
      label: 'Education',
      action: 'Add your degree, university, or college',
      points: 15,
      isDone: Boolean(user.educations && user.educations.length > 0),
    },
    {
      key: 'skills',
      label: 'Key Skills (at least 3)',
      action: 'Add at least 3 skills to enable network discovery and opportunity matching',
      points: 15,
      isDone: Boolean(user.skills && user.skills.length >= 3),
    },
  ];

  let totalScore = 0;
  const completed: string[] = [];
  const missing: ProfileCompletenessResult['missing'] = [];

  for (const check of checks) {
    if (check.isDone) {
      totalScore += check.points;
      completed.push(check.label);
    } else {
      missing.push({
        key: check.key,
        label: check.label,
        action: check.action,
        points: check.points,
      });
    }
  }

  // Cap at 100
  const percentage = Math.min(100, Math.round(totalScore));

  let level: ProfileCompletenessResult['level'] = 'Beginner';
  if (percentage >= 85) {
    level = 'All-Star';
  } else if (percentage >= 50) {
    level = 'Intermediate';
  }

  const nextStep =
    missing.length > 0
      ? `To boost your profile to ${Math.min(100, percentage + missing[0].points)}%, ${missing[0].action.toLowerCase()}.`
      : 'Your profile is 100% complete! You have achieved All-Star status.';

  return {
    percentage,
    level,
    completed,
    missing,
    nextStep,
  };
}
