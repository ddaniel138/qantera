export interface ReferralLinks {
    local?: string;
    production?: string;
}

export interface ReferralPayload {
    code: string;
    link: string;
    links: ReferralLinks;

    reward_rate_percent: number;

    invited_users: number;

    invitee_approved_posts: number;

    referral_qp_earned: number;
}

export interface ReferralCardData {
    link: string;

    invitedUsers: number;

    approvedPosts: number;

    earnedQP: number;
}

export interface YapUser {
    wallet_address: string;

    x_username: string | null;

    yap_points: number;

    referral_points: number;

    total_points: number;

    referral_code: string | null;

    referral_link: string | null;

    referral_links: ReferralLinks;

    rank: string | number | null;

    account_ready: boolean;
}

export interface MeResponse {
    user: YapUser;

    referral: ReferralPayload;
}

export interface ConnectWalletRequest {
    address: string;

    ref?: string | null;
}

export interface ConnectWalletResponse {
    pending_x: boolean;

    account_exists: boolean;

    referrer_captured?: boolean;
}

export interface LeaderboardItem {
    rank: number;

    x_username: string;

    yap_points: number;

    referral_points: number;

    total_points: number;
}

export interface LeaderboardResponse {
    items: LeaderboardItem[];
}