export const LEADERBOARD_BASE_URL =
    "https://yap.qantera.network";

export const LEADERBOARD_ENDPOINTS = {
    ALL: `${LEADERBOARD_BASE_URL}/api/leaderboard/all`,

    WEEK: `${LEADERBOARD_BASE_URL}/api/leaderboard/week`,

    DAY: `${LEADERBOARD_BASE_URL}/api/leaderboard/day`,

    YAP: `${LEADERBOARD_BASE_URL}/api/leaderboard/yap`,
} as const;

export const LEADERBOARD_PERIOD = {
    ALL: "all",
    WEEK: "week",
    DAY: "day",
    YAP: "yap",
} as const;

export const LEADERBOARD_QUERY_KEYS = {
    LIST: ["leaderboard"] as const,
};

export const LEADERBOARD_POLLING = {
    ENABLED: true,

    INTERVAL: 30_000, // 30s
};