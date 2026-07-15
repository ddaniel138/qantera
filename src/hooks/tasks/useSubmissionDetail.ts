import { useQuery } from "@tanstack/react-query";

import {
    TASK_API,
    TASK_QUERY_KEY,
} from "@/constants/tasks";

import { SubmissionDetailResponse } from "@/types/task";

async function getSubmission(
    id: number,
): Promise<SubmissionDetailResponse> {
    const response = await fetch(
        `${TASK_API.BASE_URL}${TASK_API.SUBMISSIONS}/${id}`,
        {
            credentials: "include",
        },
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch submission.",
        );
    }

    return response.json();
}

export function useSubmissionDetail(
    id?: number,
) {
    return useQuery({
        enabled: !!id,

        queryKey:
            TASK_QUERY_KEY.SUBMISSION_DETAIL(
                id ?? 0,
            ),

        queryFn: () =>
            getSubmission(id!),
    });
}