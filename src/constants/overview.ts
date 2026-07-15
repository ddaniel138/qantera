export const API_URL =
    process.env.NEXT_PUBLIC_API_URL ??
    "https://yap.qantera.network";

export const OVERVIEW_API = {
    CONNECT_WALLET: `${API_URL}/api/auth/wallet/connect`,

    ME: `${API_URL}/api/me`,

    REFERRAL: `${API_URL}/api/referral`,

    LEADERBOARD: `${API_URL}/api/leaderboard`,
} as const;

export const OVERVIEW_QUERY_KEYS = {
    me: ["overview", "me"],

    referral: ["overview", "referral"],

    leaderboard: ["overview", "leaderboard"],
} as const;

export const REFERRAL_STORAGE_KEY = "yap_ref";

export const X_LOGIN_URL = `${API_URL}/api/auth/x/login`;