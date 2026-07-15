import React, {
    useMemo,
    useState,
} from "react";
import {
    Box,
    Grid,
} from "@mui/material";
import { useAccount } from "wagmi";
import TaskHeader from "./components/TaskHeader";
import TaskStats from "./components/TaskStats";
import DailyChallenge from "./components/DailyChallenge";
import SubmitPostForm from "./components/SubmitPostForm";
import RulesGuidelines from "./components/RulesGuidelines";
import ScoredPostHistory from "./components/ScoredPostHistory";
import {
    MOCK_DAILY_CHALLENGE,
    TaskStatsData,
} from "./constants";
import {
    useConnectWallet,
    useMe,
    useSubmissionHistory,
    useSubmitPost,
} from "@/hooks/tasks";
import {
    SubmissionStatus,
} from "@/constants/tasks";
import { useSearchParams } from "next/navigation";

export default function TasksView() {
    const { address, isConnected } = useAccount();

    const searchParams = useSearchParams();

    const refCode = searchParams.get("q") ?? searchParams.get("ref") ?? undefined;

    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [historyStatus, setHistoryStatus] = useState<SubmissionStatus>("all");

    const {
        data,
        isLoading,
    } = useMe({
        wallet: address,
        enabled: isConnected,
    });

    const user = data?.user;
    const isXLinked = user?.x_linked ?? false;
    const isWalletLinked = user?.wallet_linked ?? false;
    const canSubmit = isConnected && isXLinked && isWalletLinked;

    const {
        mutate: connectWallet,
        isPending: isConnecting,
    } = useConnectWallet({
        refCode,
    });

    const {
        mutate: submitPost,
        data: submitResult,
        error: submitError,
        isPending: isSubmitting,
    } = useSubmitPost();

    const {
        data: historyData,
        isLoading: historyLoading,
        isFetching: historyFetching,
    } = useSubmissionHistory({
        wallet: address,
        status: historyStatus,
        page,
        perPage,
        enabled: canSubmit,
    });

    const formattedStats =
        useMemo<TaskStatsData | null>(() => {
            if (!user) return null;
            return {
                points: user.total_points,
                rank: String(user.rank),
                mShare: user.m_shares,
                streak: user.streak_days,
                approvedPost: user.approved_posts,
            };
        }, [user]);

    const handleHeaderClick = () => {
        if (!isConnected) return;
        connectWallet();
    };

    const handleSubmitPost = (
        tweet_url: string,
    ) => {
        submitPost({ tweet_url });
    };

    const handleStatusChange = (
        status: SubmissionStatus,
    ) => {
        setHistoryStatus(status);
        setPage(1);
    };

    return (
        <Box
            sx={{
                py: { xs: 3, md: 4 },
                px: { xs: 2 },
                maxWidth: "1440px",
                mx: "auto",
                minHeight: "100vh",
                backgroundColor: "#F7F7F7",
            }}
        >
            <TaskHeader
                onClick={handleHeaderClick}
                disabled={!isConnected}
                loading={isLoading || isConnecting}
                connectedX={isXLinked}
                userName={user?.x_username}
            />
            <TaskStats
                stats={formattedStats}
                loading={isLoading}
            />
            <DailyChallenge
                challenge={
                    MOCK_DAILY_CHALLENGE
                }
            />
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 7.5 }}>
                    <SubmitPostForm
                        onSubmit={handleSubmitPost}
                        disabled={!canSubmit}
                        loading={isSubmitting}
                        result={submitResult}
                        error={submitError}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4.5 }}>
                    <RulesGuidelines />
                </Grid>
            </Grid>

            <ScoredPostHistory
                submissions={historyData?.items ?? []}
                loading={historyLoading}
                status={historyStatus}
                page={historyData?.page ?? page}
                perPage={historyData?.per_page ?? perPage}
                total={historyData?.total ?? 0}
                onPageChange={setPage}
                onStatusChange={handleStatusChange}
            />
        </Box>
    );
}