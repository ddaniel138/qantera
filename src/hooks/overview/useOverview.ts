import { useQuery } from "@tanstack/react-query";
import {
    OVERVIEW_API,
    OVERVIEW_QUERY_KEYS,
} from "@/constants/overview";
import { MeResponse } from "@/types/overview";

interface Props {
    wallet?: string;
    enabled?: boolean;
}

export function useOverview({
    wallet,
    enabled = true,
}: Props) {
    return useQuery({
        queryKey: [...OVERVIEW_QUERY_KEYS.me, wallet],

        enabled: enabled && !!wallet,

        queryFn: async (): Promise<MeResponse> => {
            const res = await fetch(OVERVIEW_API.ME, {
                method: "GET",

                credentials: "include",

                headers: {
                    "Content-Type": "application/json",
                    "X-Yap-Wallet": wallet!,
                },
            });

            if (!res.ok) {
                throw await res.json();
            }

            return res.json();
        },
    });
}