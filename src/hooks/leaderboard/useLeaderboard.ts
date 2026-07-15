import { useQuery } from "@tanstack/react-query";

import {
    LEADERBOARD_ENDPOINTS,
    LEADERBOARD_PERIOD,
    LEADERBOARD_POLLING,
    LEADERBOARD_QUERY_KEYS,
} from "@/constants/leaderboard";

import {
    LeaderboardPeriod,
    LeaderboardResponse,
} from "@/types/leaderboard";

interface Params {
    period?: LeaderboardPeriod;

    wallet?: string;
}

const ENDPOINT_MAP = {
    all: LEADERBOARD_ENDPOINTS.ALL,
    week: LEADERBOARD_ENDPOINTS.WEEK,
    day: LEADERBOARD_ENDPOINTS.DAY,
    yap: LEADERBOARD_ENDPOINTS.YAP,
} as const;

const fetchLeaderboard = async ({
    period = LEADERBOARD_PERIOD.ALL,
    wallet,
}: Params): Promise<LeaderboardResponse> => {
    const headers: HeadersInit = {};

    if (wallet) {
        headers["X-Yap-Wallet"] = wallet;
    }

    const res = await fetch(
        ENDPOINT_MAP[period],
        {
            headers,
        }
    );

    if (!res.ok) {
        throw new Error(
            "Failed to fetch leaderboard."
        );
    }

    return res.json();
};

export default function useLeaderboard({
    period = LEADERBOARD_PERIOD.ALL,
    wallet,
}: Params) {
    return useQuery({
        queryKey: [
            ...LEADERBOARD_QUERY_KEYS.LIST,
            period,
            wallet ?? null,
        ],

        queryFn: () =>
            fetchLeaderboard({
                period,
                wallet,
            }),

        refetchInterval:
            LEADERBOARD_POLLING.ENABLED
                ? LEADERBOARD_POLLING.INTERVAL
                : false,

        refetchOnWindowFocus: false,

        staleTime: LEADERBOARD_POLLING.INTERVAL,
    });
}