import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import {
    MINT_NFT_ENDPOINTS,
    MINT_NFT_POLLING_INTERVAL,
    MINT_NFT_QUERY_KEYS,
} from "@/constants/mintNFT";

interface TotalMintedResponse {
    total_supply: string;
}

const CONTRACT = process.env.NEXT_PUBLIC_MINT_ADDRESS!;

const fetchTotalMinted = async (): Promise<TotalMintedResponse> => {
    const res = await fetch(
        MINT_NFT_ENDPOINTS.TOTAL_MINTED(CONTRACT),
    );

    if (!res.ok) {
        throw new Error("Failed to fetch total minted.");
    }

    return res.json();
};

export default function useTotalMinted() {
    const query = useQuery({
        queryKey: [
            ...MINT_NFT_QUERY_KEYS.ELIGIBILITY,
            "total-minted",
        ],

        queryFn: fetchTotalMinted,

        enabled: !!CONTRACT,

        refetchInterval: MINT_NFT_POLLING_INTERVAL,
    });

    
    const totalMinted = useMemo(() => {
        if (!query.data) return undefined;
        
        return Number(query.data.total_supply);
    }, [query.data]);
    
    return {
        ...query,
        totalMinted,
    };
}