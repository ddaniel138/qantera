import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    SOCIAL_TASK_ENDPOINTS,
    SOCIAL_TASK_QUERY_KEYS,
} from "@/constants/socialTask";

import { ClaimBonusResponse } from "@/types/socialTask";

interface ClaimBonusParams {
    wallet: string;
}

const claimBonus = async ({
    wallet,
}: ClaimBonusParams): Promise<ClaimBonusResponse> => {
    const res = await fetch(
        SOCIAL_TASK_ENDPOINTS.TASKS.CLAIM_BONUS,
        {
            method: "POST",

            headers: {
                "X-Yap-Wallet": wallet,
            },
        }
    );

    if (!res.ok) {
        throw new Error(
            "Failed to claim social bonus."
        );
    }

    return res.json();
};

export default function useClaimSocialBonus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: claimBonus,

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [
                    ...SOCIAL_TASK_QUERY_KEYS.LIST,
                    variables.wallet,
                ],
            });
        },
    });
}