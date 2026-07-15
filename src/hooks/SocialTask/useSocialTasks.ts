import { useQuery } from "@tanstack/react-query";

import {
    SOCIAL_TASK_ENDPOINTS,
    SOCIAL_TASK_POLLING,
    SOCIAL_TASK_QUERY_KEYS,
} from "@/constants/socialTask";

import { SocialTaskListResponse } from "@/types/socialTask";

const getSocialTasks = async (
    wallet: string
): Promise<SocialTaskListResponse> => {
    const res = await fetch(
        SOCIAL_TASK_ENDPOINTS.TASKS.LIST,
        {
            method: "GET",
            headers: {
                "X-Yap-Wallet": wallet,
            },
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch social tasks.");
    }

    return res.json();
};

interface UseSocialTasksParams {
    wallet?: string;
    enabled?: boolean;
}

export default function useSocialTasks({
    wallet,
    enabled = true,
}: UseSocialTasksParams = {}) {
    const query = useQuery({
        queryKey: [
            ...SOCIAL_TASK_QUERY_KEYS.LIST,
            wallet,
        ],

        enabled: enabled && !!wallet,
    
        queryFn: () => getSocialTasks(wallet!),
    
        refetchInterval:
            SOCIAL_TASK_POLLING.REFETCH_INTERVAL,
    
        refetchIntervalInBackground: true,
    
        refetchOnWindowFocus: true,
    
        refetchOnReconnect: true,
    
        staleTime:
            SOCIAL_TASK_POLLING.STALE_TIME,
    });

    return {
        ...query,

        tasks: query.data?.items ?? [],

        overview: query.data?.overview,
    };
}