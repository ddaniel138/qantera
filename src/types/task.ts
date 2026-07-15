import { SubmissionStatus } from "@/constants/tasks";

export interface UserShares {
    m_shares: number;
    user_points: number;
    total_points_pool: number;
}

export interface TaskUser {
    id: number;
    wallet_address: string | null;

    wallet_linked: boolean;
    x_linked: boolean;

    x_username: string | null;
    telegram_username: string | null;

    total_points: number;
    approved_posts: number;

    rank: number;
    streak_days: number;
    m_shares: number;
}

export interface ShareInfo {
    m_shares: number;
    user_points: number;
    total_points_pool: number;
}

export interface MeResponse {
    user: TaskUser | null;

    submissions_today: number;

    daily_limit: number;

    m_shares: ShareInfo;
}

export interface SubmitResult {
    submission: {
        status: "approved" | "rejected" | string;

        earned_now: number;

        total_score: number;

        reason?: string;

        rewards: {
            base_reward: number;
            quality_multiplier: number;
            engagement_bonus: number;
            streak_bonus: number;
            x_traction_bonus: number;
            x_traction_pending: boolean;
        };
    };

    user?: Record<string, unknown>;

    traction_pending?: boolean;
}

export interface WalletNonceResponse {
    message: string;
    nonce: string;
}

export interface WalletVerifyResponse {
    user: TaskUser;
}

export interface ScoreLine {
    points: number;
    max: number;
    label: string;
}

export interface MetricLine {
    points: number;
    max: number;
    count: number | null;
    threshold: number;
}

export interface TractionMetrics {
    like_count: number;
    reply_count: number;
    retweet_count: number;
    view_count: number;

    likes_score: number;
    replies_score: number;
    retweets_score: number;
    views_score: number;

    total: number;
}

export interface SubmissionRewards {
    base_reward: number;
    quality_multiplier: number;
    engagement_bonus: number;
    streak_bonus: number;
    x_traction_bonus: number;
    x_traction_pending: boolean;
}

export interface Submission {
    id: number;

    tweet_url: string;
    tweet_id: string;

    tweet_text_snippet: string | null;

    status: "approved" | "rejected";

    traction_status:
        | "pending"
        | "scored"
        | "skipped"
        | null;

    traction_check_at: string | null;

    traction_metrics: TractionMetrics | null;

    created_at: string;

    total_score: number;
    earned_now: number;

    max_post_score: number;

    rewards: SubmissionRewards;

    score_breakdown: {
        base_reward: ScoreLine;
        quality_multiplier: ScoreLine;
        engagement_bonus: ScoreLine;
        streak_bonus: ScoreLine;

        x_traction_bonus: ScoreLine & {
            pending: boolean;
            pending_label: string | null;

            likes: MetricLine;
            replies: MetricLine;
            retweets: MetricLine;
            views: MetricLine;
        };
    };
    message?: string | null;
    reason: string | null;

    reject_reasons: string[];

    moderation: {
        on_topic_qantera: boolean;
        mentions_qantera: boolean;
        factual_accuracy: boolean;
        has_image: boolean;
        spam: boolean;
        tweet_text_snippet: string | null;
    } | null;
}

export interface SubmitPostResponse {
    submission: Submission;

    user: TaskUser;

    traction_pending?: boolean;

    rejected?: boolean;

    message?: string;
}

export interface SubmissionItem {
    id: number;

    tweet_url: string;

    tweet_text_snippet?: string;

    status: Exclude<SubmissionStatus, "all">;

    traction_status?: string | null;

    total_score: number;

    earned_now: number;

    created_at: string;

    rewards?: {
        base_reward: number;
        quality_multiplier: number;
        engagement_bonus: number;
        streak_bonus: number;
        x_traction_bonus: number;
        x_traction_pending: boolean;
    };
}

export interface SubmissionListResponse {
    items: SubmissionItem[];

    page: number;

    per_page: number;

    total: number;

    total_pages: number;

    counts: {
        all: number;
        approved: number;
        rejected: number;
        pending: number;
    };
}

export interface SubmissionDetailResponse {
    submission: Submission;
}

export type TractionStatus =
    | "pending"
    | "scored"
    | null;