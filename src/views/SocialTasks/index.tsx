import React, { useMemo, useState } from "react";

import { Box, Tabs, Tab, Card, Stack, Typography, styled } from "@mui/material";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { useAccount } from "wagmi";

import { useClaimSocialBonus, useSocialTasks, useVerifySocialTask } from "@/hooks/SocialTask";
import { useMe } from "@/hooks/tasks";

import {
    SOCIAL_TASK_STATUS,
    SOCIAL_TELEGRAM_TASK_KEYS,
    SOCIAL_X_TASK_KEYS,
} from "@/constants/socialTask";

import {
    SOCIAL_TASK_DESCRIPTIONS,
    SOCIAL_TASK_LINKS,
    TABS_OPTIONS,
    TELEGRAM_VERIFY_DELAY_MS,
    type SocialTaskKey,
} from "./constants";

import { TaskHeader } from "./components/TaskHeader";
import { StatsDashboard } from "./components/StatsDashboard";
import { MilestoneBanner } from "./components/MilestoneBanner";
import { TaskGrid } from "./components/TaskGrid";

const StyledTab = styled(Tab)({
    textTransform: "none",
    fontWeight: 600,
    fontSize: "13px",
    borderRadius: "24px",
    minHeight: "34px",
    padding: "6px 18px",
    color: "#4B5563",
    marginRight: "8px",
    border: "1px solid #DEE1E6",
    backgroundColor: "#FFFFFF",
    transition: "all 0.2s ease",

    "&.Mui-selected": {
        backgroundColor: "#003EC7",
        color: "#FFFFFF",
        borderColor: "#003EC7",
    },
});

export default function SocialTasksView() {
    const [activeTab, setActiveTab] = useState(0);
    const { address } = useAccount();

    const {
        data: meData,
        isSuccess: meLoaded,
        isLoading: loadingUseMe,
        refetch: refetchMe,
    } = useMe({
        wallet: address,
        enabled: !!address,
    });

    const accountReady = meLoaded && !!meData?.user;

    const { tasks, overview, isLoading, refetch } = useSocialTasks({
        wallet: address,
        enabled: accountReady,
    });

    const [verifyingTaskKey, setVerifyingTaskKey] = useState<string | null>(null);

    const {
        mutateAsync: claimBonus,
        isPending: isClaimingBonus,
    } = useClaimSocialBonus();

    const refreshAfterMutation = async () => {
        await Promise.all([refetch(), refetchMe()]);
    };

    const handleClaimMilestone = async () => {
        if (!address) return;
        if (!overview?.points.all_tasks_bonus_eligible) return;

        try {
            await claimBonus({ wallet: address });
            await refreshAfterMutation();
        } catch (error) {
            console.error(error);
        }
    };

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            switch (activeTab) {
                case 1:
                    return SOCIAL_X_TASK_KEYS.includes(
                        task.key as (typeof SOCIAL_X_TASK_KEYS)[number]
                    );

                case 2:
                    return SOCIAL_TELEGRAM_TASK_KEYS.includes(
                        task.key as (typeof SOCIAL_TELEGRAM_TASK_KEYS)[number]
                    );

                case 3:
                    return task.status === SOCIAL_TASK_STATUS.VERIFIED;

                default:
                    return true;
            }
        });
    }, [tasks, activeTab]);

    const displayTasks = useMemo(() => {
        return filteredTasks.map((task) => ({
            ...task,
            descriptions: SOCIAL_TASK_DESCRIPTIONS[task.key] ?? "",
            link: SOCIAL_TASK_LINKS[task.key] ?? "",
        }));
    }, [filteredTasks]);

    const {
        mutateAsync: verifyTask,
        isPending: isVerifyingTask,
    } = useVerifySocialTask();

    const handleVerifyTask = async (taskKey: string) => {
        if (!address) return;

        setVerifyingTaskKey(taskKey);

        const isTelegramTask = SOCIAL_TELEGRAM_TASK_KEYS.includes(
            taskKey as (typeof SOCIAL_TELEGRAM_TASK_KEYS)[number]
        );

        try {
            // Telegram: link already opened via Join / card click — only delay then verify
            // if (!isTelegramTask) {
            //     const link = SOCIAL_TASK_LINKS[taskKey as SocialTaskKey];
            //     if (link) {
            //         window.open(link, "_blank", "noopener,noreferrer");
            //     }
            // }

            if (isTelegramTask) {
                await new Promise((resolve) =>
                    setTimeout(resolve, TELEGRAM_VERIFY_DELAY_MS)
                );
            }

            await verifyTask({
                wallet: address,
                taskKey,
            });

            await refreshAfterMutation();
        } catch (error) {
            console.error(error);
        } finally {
            setVerifyingTaskKey(null);
        }
    };

    return (
        <Box
            sx={{
                py: { xs: 3, md: 4 },
                px: { xs: 2 },
                maxWidth: "1440px",
                backgroundColor: "#F7F7F7",
                minHeight: "100vh",
                mx: "auto",
            }}
        >
            <TaskHeader totalEarned={overview?.points.earned ?? 0} />

            <StatsDashboard
                completed={overview?.progress.completed ?? 0}
                total={overview?.progress.total ?? 0}
                percentage={overview?.progress.percentage ?? 0}
                pointsEarned={overview?.points.earned ?? 0}
                availablePoints={overview?.points.available ?? 0}
                connections={overview?.connections.total_connected ?? 0}
            />

            <MilestoneBanner
                bonusPoints={
                    overview?.points.all_tasks_bonus_points ?? 0
                }
                disabled={
                    !overview?.points.all_tasks_bonus_eligible ||
                    overview?.points.all_tasks_bonus_claimed ||
                    isClaimingBonus
                }
                loading={isClaimingBonus}
                onClaim={handleClaimMilestone}
            />

            <Box sx={{ mt: 5, mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, value) => setActiveTab(value)}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{
                        minHeight: "auto",
                        "& .MuiTabs-indicator": {
                            display: "none",
                        },
                    }}
                >
                    {TABS_OPTIONS.map((label, idx) => (
                        <StyledTab key={idx} label={label} />
                    ))}
                </Tabs>
            </Box>

            <TaskGrid
                loading={loadingUseMe || isLoading}
                tasks={displayTasks}
                onVerify={handleVerifyTask}
                verifyingTaskKey={verifyingTaskKey}
                isVerifying={isVerifyingTask}
            />

            <Card
                sx={{
                    mt: 5,
                    p: 3,
                    border: "1px solid #DEE1E6",
                    borderRadius: "16px",
                    boxShadow: "none",
                    backgroundColor: "#EEEEEE",
                }}
            >
                <Stack
                    direction="row"
                    sx={{
                        mb: 2,
                        gap: "8px",
                        alignItems: "flex-start",
                    }}
                >
                    <InfoOutlinedIcon
                        sx={{
                            color: "#6B7280",
                            fontSize: "20px",
                            mt: "2px",
                        }}
                    />

                    <Typography
                        sx={{
                            fontWeight: 700,
                            color: "#374151",
                        }}
                    >
                        Mission Guidelines & Policies
                    </Typography>
                </Stack>

                <Stack
                    component="ul"
                    spacing={1.2}
                    sx={{
                        pl: 2.5,
                        m: 0,
                        color: "#6B7280",
                        lineHeight: 1.6,
                    }}
                >
                    <li>
                        All social tasks are verified periodically. Points may take up to 24
                        hours to reflect in your dashboard.
                    </li>

                    <li>
                        Detection of bot activity or multi-account farming will result in
                        permanent disqualification from the testnet rewards.
                    </li>

                    <li>
                        Unfollowing or leaving groups after verification will lead to point
                        deduction and potential blacklisting.
                    </li>

                    <li>
                        Terms and conditions apply as per the Qantera Institutional
                        Participant Agreement.
                    </li>
                </Stack>
            </Card>
        </Box>
    );
}
