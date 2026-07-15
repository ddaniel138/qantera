import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { useAccount } from "wagmi";

import {
    TASK_API,
    TASK_QUERY_KEY,
} from "@/constants/tasks";

import { SubmitPostResponse } from "@/types/task";

interface SubmitPostPayload {
    tweet_url: string;
}

async function submitPost(
    wallet: string,
    payload: SubmitPostPayload,
): Promise<SubmitPostResponse> {
    const response = await fetch(
        `${TASK_API.BASE_URL}${TASK_API.SUBMISSIONS}`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-Yap-Wallet": wallet,
            },
            body: JSON.stringify(payload),
        },
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ?? "Submit post failed.",
        );
    }

    return data;
}

export function useSubmitPost() {
    const queryClient = useQueryClient();

    const { address } = useAccount();

    return useMutation({
        mutationFn: (payload: SubmitPostPayload) => {
            if (!address) {
                throw new Error("Wallet not connected.");
            }

            return submitPost(address, payload);
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: TASK_QUERY_KEY.ME(address),
            });

            queryClient.invalidateQueries({
                queryKey: TASK_QUERY_KEY.SUBMISSIONS(address),
            });
        },
    });
}