export interface ScoredPost {
  post: any;
  feedScore: number;
  scoreBreakdown: {
    connectionScore: number;
    recencyScore: number;
    engagementScore: number;
    interestScore: number;
  };
}

export function rankFeedPosts(
  posts: any[],
  currentUserId?: string,
  connectionIds: Set<string> = new Set(),
  userSkillNames: Set<string> = new Set()
): any[] {
  const scoredPosts: ScoredPost[] = posts.map((post) => {
    // 1. Connection Score (0 to 40)
    let connectionScore = 0;
    if (currentUserId) {
      if (post.authorId === currentUserId) {
        connectionScore = 30; // Own posts
      } else if (connectionIds.has(post.authorId)) {
        connectionScore = 40; // Direct connection posts
      }
    }

    // 2. Recency Score (0 to 30) - 30 points for immediate, decay by 1 pt per 2 hours
    const ageHours = (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
    const recencyScore = Math.max(0, Math.round(30 - ageHours * 0.5));

    // 3. Engagement Score (0 to 20)
    const engagementRaw =
      (post.likeCount || 0) * 1.5 +
      (post.commentCount || 0) * 3 +
      (post.shareCount || 0) * 2;
    const engagementScore = Math.min(20, Math.round(engagementRaw));

    // 4. Interest / Skill Score (0 to 10)
    let interestScore = 0;
    if (userSkillNames.size > 0) {
      const textToScan = `${post.content} ${post.tags || ''}`.toLowerCase();
      for (const skill of userSkillNames) {
        if (textToScan.includes(skill.toLowerCase())) {
          interestScore = 10;
          break;
        }
      }
    }

    const feedScore = connectionScore + recencyScore + engagementScore + interestScore;

    return {
      post,
      feedScore,
      scoreBreakdown: {
        connectionScore,
        recencyScore,
        engagementScore,
        interestScore,
      },
    };
  });

  // Sort descending by feedScore
  scoredPosts.sort((a, b) => b.feedScore - a.feedScore);

  return scoredPosts.map((sp) => ({
    ...sp.post,
    _ranking: {
      feedScore: sp.feedScore,
      breakdown: sp.scoreBreakdown,
    },
  }));
}
