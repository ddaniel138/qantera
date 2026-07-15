import { useMemo } from "react";

import { WalletType } from "@/constants/faucet";

import { useWalletType } from "./useWalletType";
import { usePersonalFaucet } from "./usePersonalFaucet";
import { useOkxFaucet } from "./useOkxFaucet";

export function useFaucet() {
    const walletType = useWalletType();

    const personal = usePersonalFaucet();

    const okx = useOkxFaucet();

    return useMemo(() => {
        if (walletType === WalletType.OKX) {
            return {
                claim: okx.mutateAsync,
                isPending: okx.isPending,
                error: okx.error,
                reset: okx.reset,
            };
        }

        return {
            claim: personal.mutateAsync,
            isPending: personal.isPending,
            error: personal.error,
            reset: personal.reset,
        };
    }, [
        walletType,
        personal,
        okx,
    ]);
}