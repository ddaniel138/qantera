import { useQuery } from "@tanstack/react-query";
import { FAUCET_CACHE, FAUCET_QUERY_KEYS } from "@/constants/faucet";
import { FaucetService } from "@/services/faucet";

export function useOkxStatus(address?: string) {
    return useQuery({
        queryKey: address ? FAUCET_QUERY_KEYS.STATUS.OKX(address) : ['STATUS', 'OKX', 'DISABLED'],

        enabled: !!address,

        queryFn: () => FaucetService.okxStatus(address!),

        staleTime: FAUCET_CACHE.STATUS_STALE,
        refetchOnWindowFocus: false,
    });
}