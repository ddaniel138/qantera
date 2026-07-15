import { useMemo } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";

import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

import { SubmissionItem } from "@/types/task";
import {
    SubmissionStatus,
} from "@/constants/tasks";

import TableHistory, {
    TableHistoryRow,
} from "./TableHistory";

import { formatRelativeTime } from "@/helpers";

interface Props {
    submissions?: SubmissionItem[];
    loading?: boolean;
    status: SubmissionStatus;
    page: number;
    perPage: number;
    total: number;
    onPageChange: (
        page: number,
    ) => void;
    onStatusChange: (
        status: SubmissionStatus,
    ) => void;
}

const FILTERS: {
    label: string;
    value: SubmissionStatus;
}[] = [
    {
        label: "All",
        value: "all",
    },
    {
        label: "Approved",
        value: "approved",
    },
    {
        label: "Pending",
        value: "pending",
    },
    {
        label: "Rejected",
        value: "rejected",
    },
];

function buildRewards(
    item: SubmissionItem,
) {
    if (item.status === "rejected") {
        return "-- / -- / -- / -- / --";
    }
    const rewards = item.rewards ?? {
        base_reward: 0,
        quality_multiplier: 0,
        engagement_bonus: 0,
        streak_bonus: 0,
        x_traction_bonus: 0,
        x_traction_pending: false,
    };
    return [
        rewards.base_reward > 0
            ? `+${rewards.base_reward}`
            : "--",
        rewards.quality_multiplier > 0
            ? `+${rewards.quality_multiplier}`
            : "--",
        rewards.engagement_bonus > 0
            ? `+${rewards.engagement_bonus}`
            : "--",
        rewards.streak_bonus > 0
            ? `+${rewards.streak_bonus}`
            : "--",
        rewards.x_traction_pending
            ? "Pending"
            : `+${rewards.x_traction_bonus}`,
    ].join(" / ");
}

export default function ScoredPostHistory({
    submissions = [],
    loading = false,
    status,
    page,
    perPage,
    total,
    onPageChange,
    onStatusChange,
}: Props) {
    const rows =
        useMemo<TableHistoryRow[]>(() => {
            return submissions.map(
                (item) => ({
                    id: item.id,
                    url: item.tweet_url,
                    content: item.tweet_text_snippet ?? "",
                    createdAt: formatRelativeTime( item.created_at),
                    status: item.status,
                    score: item.status === "rejected"
                            ? "--"
                            : item.total_score,
                    rewards: buildRewards(item),
                }),
            );
        }, [submissions]);

    return (
        <Box
            sx={{
                mt: 5,
                p: 4,
                borderRadius: "24px",
                bgcolor: "#FFF",
                border: "1px solid #EAECEF",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    mb: 4,
                    flexWrap: "wrap",
                }}
            >
                <Typography
                    sx={{
                        fontSize: 18,
                        fontWeight: 600,
                    }}
                >
                    Scored Post History
                </Typography>

                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ flexWrap: "wrap"}}
                >
                    {FILTERS.map(
                        (item) => (
                            <Button
                                key={item.value}
                                onClick={() => onStatusChange(item.value)}
                                sx={{
                                    borderRadius: '100px',
                                    px: 2.5,
                                    py: 0.75,
                                    fontSize: '12px',
                                    fontWeight: status === item.value ? 700 : 600,
                                    textTransform: 'none',
                                    backgroundColor: status === item.value ? '#003EC7' : '#EEF0F3',
                                    color: status === item.value ? '#FFFFFF' : '#6B7280',
                                    '&:hover': {
                                        backgroundColor: status === item.value ? '#003EC7' : '#dce1e7',
                                    },
                                }}
                            >
                                {item.label}
                            </Button>
                        ),
                    )}
                </Stack>
            </Box>

            {loading ? (
                <Stack
                    sx={{
                        py: 8,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CircularProgress />
                </Stack>
            ) : rows.length === 0 ? (
                <Typography
                    sx={{
                        py: 8,
                        textAlign: "center",
                        color: "#6B7280",
                    }}
                >
                    No submissions found.
                </Typography>
            ) : (
                <TableHistory
                    rows={rows}
                    page={page}
                    pageSize={perPage}
                    total={total}
                    onPageChange={ onPageChange}
                />
            )}
        </Box>
    );
}