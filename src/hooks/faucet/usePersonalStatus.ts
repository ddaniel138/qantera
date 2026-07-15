import { useQuery } from "@tanstack/react-query";
import { FAUCET_CACHE, FAUCET_QUERY_KEYS } from "@/constants/faucet";
import { FaucetService } from "@/services/faucet";

export function usePersonalStatus(address?: string) {
    return useQuery({
        queryKey: address ? FAUCET_QUERY_KEYS.STATUS.PERSONAL(address) : ['STATUS', 'PERSONAL', 'DISABLED'],

        enabled: !!address,

        queryFn: () => FaucetService.personalStatus(address!),

        staleTime: FAUCET_CACHE.STATUS_STALE,
        refetchOnWindowFocus: false,
    });
}