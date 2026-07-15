import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import {
    FAUCET_CACHE,
    FAUCET_QUERY_KEYS,
    WalletType,
} from "@/constants/faucet";

import { FaucetService } from "@/services/faucet";

import { useWalletType } from "./useWalletType";

export function usePrefetchOkx() {
    const { address, isConnected } = useAccount();

    const walletType = useWalletType();

    return useQuery({
        queryKey: FAUCET_QUERY_KEYS.PREFETCH.OKX(
            address ?? ""
        ),

        enabled:
            !!address &&
            isConnected &&
            walletType === WalletType.OKX,

        queryFn: () =>
            FaucetService.prefetchOkx(address!),

        staleTime: FAUCET_CACHE.PREFETCH_STALE,

        retry: false,

        refetchOnReconnect: false,

        refetchOnWindowFocus: false,
    });
}