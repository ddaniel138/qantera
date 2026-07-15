import { useQuery } from "@tanstack/react-query";

import {
    TASK_API,
    TASK_POLLING,
    TASK_QUERY_KEY,
} from "@/constants/tasks";

import { MeResponse } from "@/types/task";

interface GetMeParams {
    wallet: string;
    withCredentials?: boolean;
}

async function getMe({
    wallet,
    withCredentials = true,
}: GetMeParams): Promise<MeResponse> {
    const url = new URL(
        `${TASK_API.BASE_URL}${TASK_API.ME}`,
    );

    url.searchParams.set("wallet", wallet);

    const response = await fetch(url.toString(), {
        credentials: withCredentials ? "include" : "omit",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user.");
    }

    return response.json();
}

interface UseMeProps {
    wallet?: string;
    enabled?: boolean;
    withCredentials?: boolean;
    polling?: boolean;
}

export function useMe({
    wallet,
    enabled = true,
    withCredentials = true,
    polling = true,
}: UseMeProps) {
    return useQuery({
        queryKey: TASK_QUERY_KEY.ME(wallet),

        enabled: enabled && !!wallet,

        retry: false,

        queryFn: () =>
            getMe({
                wallet: wallet!,
                withCredentials,
            }),

        refetchInterval: polling
            ? TASK_POLLING.ME
            : false,

        refetchIntervalInBackground: true,

        refetchOnWindowFocus: true,

        staleTime: 10_000,
    });
}