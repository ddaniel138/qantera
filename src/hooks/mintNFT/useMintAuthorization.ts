import { useMutation } from "@tanstack/react-query";

import { MINT_NFT_ENDPOINTS } from "@/constants/mintNFT";

import { MintAuthorizationResponse } from "@/types/mintNFT";

interface Params {
    wallet: string;
}

const authorize = async ({
    wallet,
}: Params): Promise<MintAuthorizationResponse> => {
    const res = await fetch(
        MINT_NFT_ENDPOINTS.AUTHORIZATION,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",

                "X-Yap-Wallet": wallet,
            },
        }
    );

    if (!res.ok) {
        throw new Error("Authorization failed.");
    }

    return res.json();
};

export default function useMintAuthorization() {
    return useMutation({
        mutationFn: authorize,
    });
}