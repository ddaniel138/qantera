import React, { useState } from "react";
import {
    Grid,
    Card,
    Box,
    Typography,
    Stack,
    Button,
    Avatar,
    styled,
    CircularProgress,
    Skeleton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RepeatIcon from "@mui/icons-material/Repeat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import GroupsIcon from "@mui/icons-material/Groups";
import { SOCIAL_TELEGRAM_TASK_KEYS } from "@/constants/socialTask";
import { SocialTaskItem } from "@/types/socialTask";
import {
    canVerifySocialTask,
    TELEGRAM_JOIN_DELAY_MS,
    SocialTaskKey,
} from "../constants";

const TaskCard = styled(Card)({
    border: "1px solid #DEE1E6",
    borderRadius: "16px",
    boxShadow: "none",
    backgroundColor: "#FFFFFF",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "290px",
});

const getTaskIcon = (type: string) => {
    const iconStyle = { color: "#003EC7", fontSize: "20px" };
    switch (type) {
        case "follow_x":
            return <PersonAddAlt1Icon sx={iconStyle} />;
        case "like_post":
            return <FavoriteIcon sx={iconStyle} />;
        case "retweet_post":
        case "repost_post":
            return <RepeatIcon sx={iconStyle} />;
        case "telegram_join_channel":
            return <NotificationsIcon sx={iconStyle} />;
        case "telegram_join_group":
            return <GroupsIcon sx={iconStyle} />;
        default:
            return <PersonAddAlt1Icon sx={iconStyle} />;
    }
};

const isTelegramTask = (key: SocialTaskKey) =>
    SOCIAL_TELEGRAM_TASK_KEYS.includes(
        key as (typeof SOCIAL_TELEGRAM_TASK_KEYS)[number]
    );

const getTelegramJoinLabel = (key: SocialTaskKey) =>
    key === "telegram_join_channel" ? "Join channel" : "Join group";

interface TaskGridProps {
    loading: boolean;
    tasks: SocialTaskItem[];
    isVerifying: boolean;
    verifyingTaskKey: string | null;
    onVerify: (taskKey: string) => void;
}

const SKELETON_CARD_COUNT = 3;

export const TaskGrid = ({
    tasks,
    verifyingTaskKey,
    onVerify,
}: TaskGridProps) => {
    const [joinedTelegramKeys, setJoinedTelegramKeys] = useState<Set<string>>(
        () => new Set()
    );
    const [joiningTaskKey, setJoiningTaskKey] = useState<string | null>(null);

    const markTelegramJoined = (taskKey: string) => {
        setJoinedTelegramKeys((prev) => {
            if (prev.has(taskKey)) return prev;
            const next = new Set(prev);
            next.add(taskKey);
            return next;
        });
    };

    const openTelegramJoin = (taskKey: string, link: string) => {
        window.open(link, "_blank", "noopener,noreferrer");

        if (joinedTelegramKeys.has(taskKey) || joiningTaskKey) return;

        setJoiningTaskKey(taskKey);

        window.setTimeout(() => {
            markTelegramJoined(taskKey);
            setJoiningTaskKey(null);
        }, TELEGRAM_JOIN_DELAY_MS);
    };

    if (tasks.length === 0) {
        return (
            <Grid container spacing={3}>
                {Array.from({
                    length: SKELETON_CARD_COUNT,
                }).map((_, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                        <TaskCard>
                            <Box>
                                <Stack
                                    direction="row"
                                    sx={{
                                        mb: 2.5,
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Skeleton variant="circular" width={40} height={40} />
                                    <Skeleton
                                        variant="rounded"
                                        width={110}
                                        height={24}
                                        sx={{
                                            borderRadius: "99px",
                                        }}
                                    />
                                </Stack>
                                <Skeleton variant="text" width="70%" height={34} />
                                <Skeleton variant="text" width="100%" height={22} />
                                <Skeleton variant="text" width="85%" height={22} />
                            </Box>

                            <Box
                                sx={{
                                    borderTop: "1px solid #EEF0F3",
                                    my: 2,
                                    pt: 1,
                                }}
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Skeleton variant="text" width={70} height={30} />
                                <Skeleton
                                    variant="rounded"
                                    width={80}
                                    height={32}
                                    sx={{
                                        borderRadius: "99px",
                                    }}
                                />
                            </Box>
                        </TaskCard>
                    </Grid>
                ))}
            </Grid>
        );
    }

    return (
        <Grid container spacing={3}>
            {tasks.map((task) => {
                const isVerifying = verifyingTaskKey === task.key;
                const isJoining = joiningTaskKey === task.key;
                const buttonLoading = isVerifying || isJoining;
                const isVerified = task.status === "verified";
                const canVerify = canVerifySocialTask(task);
                const telegram = isTelegramTask(task.key);
                const hasJoinedTelegram = joinedTelegramKeys.has(task.key);

                const openTaskLink = () => {
                    if (!task.link) return;

                    if (telegram) {
                        openTelegramJoin(task.key, task.link);
                        return;
                    }

                    window.open(task.link, "_blank", "noopener,noreferrer");
                };

                const handleCardClick = () => {
                    if (isVerified || isJoining) return;
                    openTaskLink();
                };

                const handleActionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();

                    if (isVerified || !canVerify || buttonLoading) return;

                    if (telegram && !hasJoinedTelegram) {
                        openTaskLink();
                        return;
                    }

                    onVerify(task.key);
                };

                const buttonLabel = (() => {
                    if (isVerifying) return "Verifying...";
                    if (isJoining) return "Opening...";
                    if (telegram && !hasJoinedTelegram) {
                        return getTelegramJoinLabel(task.key);
                    }
                    return "Verify";
                })();

                const actionDisabled =
                    buttonLoading ||
                    !canVerify ||
                    (telegram && !hasJoinedTelegram && !task.link);

                return (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={task.key}>
                        <TaskCard
                            onClick={handleCardClick}
                            sx={{
                                cursor: !isVerified && task.link ? "pointer" : "default",
                            }}
                        >
                            <Box>
                                <Stack
                                    direction="row"
                                    sx={{
                                        mb: 2.5,
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            bgcolor: "#EFF6FF",
                                            border: "1px solid #EBF0FF",
                                        }}
                                    >
                                        {getTaskIcon(task.key)}
                                    </Avatar>

                                    <Box
                                        sx={{
                                            display: "inline-flex",
                                            bgcolor: isVerified ? "#F0FDF4" : "#EFF6FF",
                                            px: 1.2,
                                            py: 1,
                                            borderRadius: "99px",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: "10px",
                                                fontWeight: 700,
                                                color: isVerified ? "#2E7D32" : "#003EC7",
                                                letterSpacing: "0.3px",
                                            }}
                                        >
                                            {isVerified ? "VERIFIED" : "AVAILABLE"}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Typography
                                    sx={{
                                        fontSize: "18px",
                                        fontWeight: 700,
                                        color: "#111827",
                                        mb: 1,
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {task.title}
                                </Typography>

                                {task.key === "like_post" ? (
                                    <Box
                                        sx={{
                                            border: "1px solid #EEF0F3",
                                            borderRadius: "12px",
                                            p: 1.5,
                                            bgcolor: "#FAFAFA",
                                            mt: 1.5,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: "12px",
                                                color: "#737688",
                                                lineHeight: 1.4,
                                                fontStyle: "italic",
                                            }}
                                        >
                                            {task.descriptions}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Typography sx={{ color: "#737688", lineHeight: 1.5 }}>
                                        {task.descriptions}
                                    </Typography>
                                )}
                            </Box>

                            <Box sx={{ borderTop: "1px solid #EEF0F3", my: 2, pt: 1 }} />

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: "16px",
                                        fontWeight: 700,
                                        color: "#003EC7",
                                        fontFamily: "var(--font-jetBrain-mono)",
                                    }}
                                >
                                    +{task.reward_points} QP
                                </Typography>

                                {isVerified ? (
                                    <Stack
                                        direction="row"
                                        sx={{ color: "#2E7D32", alignItems: "center", gap: "4px" }}
                                    >
                                        <CheckCircleIcon sx={{ fontSize: "16px" }} />
                                        <Typography sx={{ fontSize: "13px", fontWeight: 700 }}>
                                            Done
                                        </Typography>
                                    </Stack>
                                ) : (
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            textTransform: "none",
                                            bgcolor: "#003EC7",
                                            color: "#FFFFFF",
                                            boxShadow: "none",
                                            borderRadius: "99px",
                                            fontWeight: 400,
                                            fontSize: "13px",
                                            py: 0.8,
                                            px: 2,
                                            "&:hover": {
                                                bgcolor: "#002BB0",
                                            },
                                        }}
                                        disabled={actionDisabled}
                                        onClick={handleActionClick}
                                        startIcon={
                                            buttonLoading ? (
                                                <CircularProgress size={14} color="inherit" />
                                            ) : undefined
                                        }
                                    >
                                        {buttonLabel}
                                    </Button>
                                )}
                            </Box>
                        </TaskCard>
                    </Grid>
                );
            })}
        </Grid>
    );
};
