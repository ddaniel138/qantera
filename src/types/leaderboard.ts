export type LeaderboardPeriod =
    | "all"
    | "week"
    | "day"
    | "yap";

export type LeaderboardTier =
    | "top_100"
    | "top_10"
    | "top_1"
    | "champion";

export interface LeaderboardItem {
    rank: number;

    wallet_address: string | null;

    x_username: string | null;

    yap_points: number;

    streak_days: number;

    total_points: number;
}

export interface LeaderboardNextTarget {
    tier: LeaderboardTier;

    target_rank: number;

    target_points: number;

    points_needed: number;
}

export interface LeaderboardMe extends LeaderboardItem {
    next_target: LeaderboardNextTarget;
}

export interface LeaderboardResponse {
    period: LeaderboardPeriod;

    limit: number;

    items: LeaderboardItem[];

    me: LeaderboardMe | null;
}