import { useQuery } from "@tanstack/react-query";

import { FaucetService } from "@/services/faucet";
import { FAUCET_QUERY_KEYS } from "@/constants/faucet";

export function useFaucetConfig() {
    return useQuery({
        queryKey: FAUCET_QUERY_KEYS.CONFIG,

        queryFn: () => FaucetService.getConfig(),

        staleTime: Infinity,

        gcTime: Infinity,

        retry: 1,

        refetchOnReconnect: false,

        refetchOnWindowFocus: false,
    });
}