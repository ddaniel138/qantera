import { useQuery } from "@tanstack/react-query";
import {
    MINT_NFT_ENDPOINTS,
    MINT_NFT_POLLING_INTERVAL,
    MINT_NFT_QUERY_KEYS,
} from "@/constants/mintNFT";
import { MintEligibilityResponse } from "@/types/mintNFT";

interface Params {
    wallet?: string;
    enabled?: boolean;
}

const fetchEligibility = async ({
    wallet,
}: Params): Promise<MintEligibilityResponse> => {
    const res = await fetch(
        MINT_NFT_ENDPOINTS.ELIGIBILITY,
        {
            headers: wallet
                ? { "X-Yap-Wallet": wallet }
                : undefined,
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch mint eligibility.");
    }

    return res.json();
};

export default function useMintEligibility({
    wallet,
    enabled = true,
}: Params) {
    return useQuery({
        queryKey: [
            ...MINT_NFT_QUERY_KEYS.ELIGIBILITY,
            wallet,
        ],

        queryFn: () =>
            fetchEligibility({
                wallet,
            }),

        enabled: enabled && !!wallet,

        refetchInterval: MINT_NFT_POLLING_INTERVAL,
    });
}