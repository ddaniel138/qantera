export interface StatItem {
    label: string;
    value: string | number;
    unit?: string;
    change?: string;
    statusText?: string;
    isEligible?: boolean;
}

export interface JourneyStep {
    id: number;
    title: string;
    description?: string;
    status: 'completed' | 'current' | 'locked';
}

export interface JourneyItem {
    key:
        | "wallet_connected"
        | "faucet_claimed"
        | "min_yap_points"
        | "mint"
        | "reach_top1000";

    label: string;

    description: string;

    met: boolean;
}

export const MOCK_STATS_DATA: StatItem[] = [
    { label: 'Wallet Balance', value: '0', unit: 'QTER' },
    { label: 'Total Points', value: '0', unit: 'QP' },
    { label: 'Leaderboard Rank', value: '#', change: '' },
    { label: 'NFT Status', value: 'Not Eligible to Mint', isEligible: false },
];

export const MOCK_JOURNEY_DATA: JourneyStep[] = [
    { id: 1, title: 'Connect Wallet', status: 'completed' },
    { id: 2, title: 'Claim Faucet', status: 'completed' },
    { id: 3, title: 'Complete Yap Task', description: 'Engage with the community to earn points.', status: 'current' },
    { id: 4, title: 'Mint Genesis NFT', status: 'locked' },
    // { id: 5, title: 'Reach Top 1,000', status: 'locked' },
];

export const REFERRAL_DATA = {
    link: "",
    shareLink: "",
    invitedUsers: 0,
    approvedPosts: 0,
    earnedQP: 0,
};

export const FILTER_TABS = ['All', 'Approved', 'Pending', 'Rejected'];