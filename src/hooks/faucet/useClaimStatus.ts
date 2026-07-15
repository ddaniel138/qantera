import { useMemo } from "react";
import { WalletType } from "@/constants/faucet";
import { useWalletType } from "./useWalletType";
import { usePersonalStatus } from "./usePersonalStatus";
import { useOkxStatus } from "./useOkxStatus";

interface Props {
    address?: string;
}

export function useClaimStatus({ address }: Props) {
    const walletType = useWalletType();

    const personal = usePersonalStatus(address);
    const okx = useOkxStatus(address);

    const current = useMemo(() => {
        if (!address) return null;

        if (walletType === WalletType.OKX) {
            return okx;
        }
        return personal;
    }, [address, walletType, personal, okx]);

    if (!address || !current) {
        return {
            claimed: false,
            claimedAt: undefined,
            status: undefined,
            isLoading: false,
            isFetching: false,
            refetch: async () => undefined,
        };
    }

    return {
        claimed: current.data?.claimed ?? false,
        claimedAt: current.data?.claimAt,
        status: current.data,
        refetch: current.refetch,
        isLoading: current.isLoading,
        isFetching: current.isFetching,
    };
}