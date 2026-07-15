import { SocialTaskKey } from "@/views/SocialTasks/constants";

export type SocialTaskStatus =
    | "available"
    | "verified"
    | "done";

export interface SocialTaskTarget {
    username: string | null;

    tweet_url: string | null;

    chat_id: string | null;
}

export interface SocialTaskItem {
    key: SocialTaskKey;

    title: string;

    reward_points: number;

    descriptions: string;

    link?: string;

    status: SocialTaskStatus;

    verified: boolean;

    verified_at: string | null;

    claimed: boolean;

    target: SocialTaskTarget;
}

export interface SocialProgress {
    completed: number;

    total: number;

    completed_label: string;

    percentage: number;
}

export interface SocialPoints {
    earned: number;

    available: number;

    total_possible: number;

    all_tasks_bonus_points: number;

    all_tasks_bonus_eligible: boolean;

    all_tasks_bonus_claimed: boolean;
}

export interface SocialConnections {
    x: boolean;

    telegram: boolean;

    total_connected: number;

    total_possible: number;
}

export interface SocialOverview {
    progress: SocialProgress;

    points: SocialPoints;

    connections: SocialConnections;
}

export interface SocialTaskListResponse {
    items: SocialTaskItem[];

    overview: SocialOverview;
}

export interface SocialUser {
    yap_points: number;

    social_points: number;

    referral_points: number;

    total_points: number;
}

export interface VerifyTaskResponse {
    verified: boolean;

    first_time_rewarded: boolean;

    task: SocialTaskItem;

    user: SocialUser;
}

export interface ClaimBonusResponse {
    claimed: boolean;

    already_claimed: boolean;

    bonus_points: number;

    overview: SocialOverview;

    user: SocialUser;
}

export interface ConnectTelegramBody {
    id: string;

    first_name: string;

    username?: string;

    auth_date: number;

    hash: string;
}

export interface ConnectTelegramResponse {
    success: boolean;

    telegram_user_id: string;

    telegram_username: string;
}