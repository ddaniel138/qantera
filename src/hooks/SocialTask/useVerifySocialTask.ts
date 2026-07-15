import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    SOCIAL_TASK_ENDPOINTS,
    SOCIAL_TASK_QUERY_KEYS,
} from "@/constants/socialTask";

import {
    VerifyTaskResponse,
} from "@/types/socialTask";

interface VerifyTaskParams {
    wallet: string;

    taskKey: string;
}

const verifyTask = async ({
    wallet,
    taskKey,
}: VerifyTaskParams): Promise<VerifyTaskResponse> => {
    const res = await fetch(
        SOCIAL_TASK_ENDPOINTS.TASKS.VERIFY(taskKey),
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json",

                "X-Yap-Wallet": wallet,
            },
        }
    );

    if (!res.ok) {
        throw new Error(
            "Failed to verify task."
        );
    }

    return res.json();
};

export default function useVerifySocialTask() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: verifyTask,

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