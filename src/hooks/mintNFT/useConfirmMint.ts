import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    MINT_NFT_ENDPOINTS,
    MINT_NFT_QUERY_KEYS,
} from "@/constants/mintNFT";

import {
    ConfirmMintBody,
    ConfirmMintResponse,
} from "@/types/mintNFT";

interface Params {
    wallet: string;

    body: ConfirmMintBody;
}

const confirmMint = async ({
    wallet,
    body,
}: Params): Promise<ConfirmMintResponse> => {
    const res = await fetch(
        MINT_NFT_ENDPOINTS.CONFIRM,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",

                "X-Yap-Wallet": wallet,
            },

            body: JSON.stringify(body),
        }
    );

    if (!res.ok) {
        throw new Error("Confirm mint failed.");
    }

    return res.json();
};

export default function useConfirmMint() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: confirmMint,

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [
                    ...MINT_NFT_QUERY_KEYS.ELIGIBILITY,
                    variables.wallet,
                ],
            });
        },
    });
}