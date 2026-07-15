import { QueryKey } from "@tanstack/react-query";

export const TASK_API = {
    BASE_URL: "https://yap.qantera.network",

    HEALTH: "/api/health",

    ME: "/api/me",

    LOGOUT: "/api/auth/logout",

    CONNECT_WALLET: "/api/auth/wallet/connect",

    LOGIN_X: "/api/auth/x/login",

    SUBMISSIONS: "/api/submissions",

    LEADERBOARD: "/api/leaderboard",
} as const;

export const TASK_QUERY_KEY = {
    ME: (wallet?: string) =>
        ["task", "me", wallet] as const,

    SUBMISSIONS: (
        wallet?: string,
        status: SubmissionStatus = "all",
        page = 1,
        perPage = 10,
    ) =>
        [
            "task",
            "submissions",
            wallet,
            status,
            page,
            perPage,
        ] as const,

    SUBMISSION_DETAIL: (id: number) =>
        ["task", "submission", id] satisfies QueryKey,

    LEADERBOARD: ["task", "leaderboard"] satisfies QueryKey,
} as const;

export const TASK_POLLING = {
    ME: 60_000,

    SUBMISSIONS: 60_000,

    PENDING_SUBMISSION: 60_000,
} as const;

export type SubmissionStatus =
    | "all"
    | "approved"
    | "rejected"
    | "pending"