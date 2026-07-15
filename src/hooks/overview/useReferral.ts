import { useQuery } from "@tanstack/react-query";
import {
    OVERVIEW_API,
    OVERVIEW_QUERY_KEYS,
} from "@/constants/overview";
import { ReferralPayload } from "@/types/overview";

interface Props {
    wallet?: string;
}

export function useReferral({ wallet }: Props) {
    return useQuery({
        queryKey: [...OVERVIEW_QUERY_KEYS.referral, wallet],

        enabled: !!wallet,

        queryFn: async (): Promise<ReferralPayload> => {
            const res = await fetch(OVERVIEW_API.REFERRAL, {
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