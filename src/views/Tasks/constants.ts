export interface TaskStatsData {
  points: number;
  rank: string;
  mShare: number;
  streak: number;
  approvedPost: number;
}

export interface DailyChallengeData {
  title: string;
  endTime: string;
  reward: string;
  xLink: string;
}

export interface PostRewardDetail {
  baseReward: number;
  qualityMultiplier: number;
  engagementBonus: number;
  streakBonus: number;
  xTransactionBonus: any;
  totalEarned: number;
}

export const MOCK_TASK_STATS: TaskStatsData = {
  points: 1280,
  rank: '#184',
  mShare: 3.4,
  streak: 4,
  approvedPost: 12,
};

export const MOCK_DAILY_CHALLENGE: DailyChallengeData = {
  title: 'Share why quantum-resistant security matters',
  endTime: '08h 42m',
  reward: '100 QP',
  xLink: 'https://x.com',
};

export const MOCK_REWARD_DETAIL: PostRewardDetail = {
  baseReward: 30,
  qualityMultiplier: 25,
  engagementBonus: 18,
  streakBonus: 10,
  xTransactionBonus: 'Pending (24h)',
  totalEarned: 83,
};


export interface ScoredPost {
  id: string;
  title: string;
  url: string;
  submittedAt: string;
  status: 'Approved' | 'Pending Review' | 'Rejected';
  rewards: {
    base: number | string;
    q: number | string;
    e: number | string;
    s: number | string;
  };
  total: number | string;
}

export const MOCK_SCORED_POSTS: ScoredPost[] = [
  {
    id: '1',
    title: 'Why quantum-resistant security matters...',
    url: 'x.com/status/182...',
    submittedAt: '2 hours ago',
    status: 'Approved',
    rewards: { base: 30, q: 25, e: 18, s: 10 },
    total: 83,
  },
  {
    id: '2',
    title: 'The future of L1 scaling is here...',
    url: 'x.com/status/181...',
    submittedAt: '5 hours ago',
    status: 'Pending Review',
    rewards: { base: '--', q: '--', e: '--', s: '--' },
    total: '--',
  }
];