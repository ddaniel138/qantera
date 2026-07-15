import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
    TASK_API,
    TASK_POLLING,
    TASK_QUERY_KEY,
    SubmissionStatus,
} from "@/constants/tasks";

import {
    SubmissionListResponse,
} from "@/types/task";

interface GetHistoryParams {
    wallet: string;

    status: SubmissionStatus;

    page: number;

    perPage: number;
}

async function getHistory({
    wallet,
    status,
    page,
    perPage,
}: GetHistoryParams): Promise<SubmissionListResponse> {
    const url = new URL(
        `${TASK_API.BASE_URL}${TASK_API.SUBMISSIONS}`,
    );

    url.searchParams.set("wallet", wallet);

    url.searchParams.set("status", status);

    url.searchParams.set(
        "page",
        page.toString(),
    );

    url.searchParams.set(
        "per_page",
        perPage.toString(),
    );

    const response = await fetch(url.toString(), {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            "Failed to fetch submission history.",
        );
    }

    return response.json();
}

interface UseSubmissionHistoryProps {
    wallet?: string;

    status?: SubmissionStatus;

    page?: number;

    perPage?: number;

    enabled?: boolean;
}

export function useSubmissionHistory({
    wallet,
    status = "all",
    page = 1,
    perPage = 10,
    enabled = true,
}: UseSubmissionHistoryProps) {
    return useQuery({
        queryKey: TASK_QUERY_KEY.SUBMISSIONS(
            wallet,
            status,
            page,
            perPage,
        ),

        enabled:
            enabled &&
            !!wallet,

        queryFn: () =>
            getHistory({
                wallet: wallet!,
                status,
                page,
                perPage,
            }),

        refetchInterval(query) {
            const submissions =
                query.state.data?.items;

            if (!submissions?.length) {
                return TASK_POLLING.SUBMISSIONS;
            }

            const hasPending =
                submissions.some(
                    (submission) =>
                        submission.traction_status ===
                        "pending",
                );

            return hasPending
                ? TASK_POLLING.PENDING_SUBMISSION
                : TASK_POLLING.SUBMISSIONS;
        },

        placeholderData: keepPreviousData,
    });
}