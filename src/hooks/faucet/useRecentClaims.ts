import {
    keepPreviousData,
    useInfiniteQuery,
} from "@tanstack/react-query";

import {
    FAUCET_ENDPOINTS,
    FAUCET_QUERY_KEYS,
} from "@/constants/faucet";

import { FaucetClaimsResponse } from "@/types/faucet";

export interface RecentClaimsParams {
    limit?: number;
    polling?: number | false;
}

interface FetchClaimsParams {
    limit: number;
    offset: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_FAUCET_API

export const fetchClaims = async ({
    limit,
    offset,
}: FetchClaimsParams): Promise<FaucetClaimsResponse> => {
    const res = await fetch(
        `${BASE_URL}${FAUCET_ENDPOINTS.CLAIMS}?limit=${limit}&offset=${offset}`
    );

    if (!res.ok) {
        throw new Error("Failed to fetch recent claims");
    }

    return res.json();
};

export const useRecentClaims = ({
    limit = 50,
    polling = false,
}: RecentClaimsParams = {}) => {
    return useInfiniteQuery({
        queryKey: [...FAUCET_QUERY_KEYS.CLAIMS, limit],

        initialPageParam: 0,

        queryFn: ({ pageParam }) =>
            fetchClaims({
                limit,
                offset: pageParam,
            }),

        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.claims.length < limit) {
                return undefined;
            }

            return allPages.length * limit;
        },

        refetchInterval: polling || false,

        placeholderData: keepPreviousData,

        staleTime: polling || 0,
    });
};