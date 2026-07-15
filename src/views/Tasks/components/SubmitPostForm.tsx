import React, { useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    InputAdornment,
    Skeleton,
    TextField,
    Typography,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import ErrorIcon from "@mui/icons-material/Error";

import { CheckCircleIcon } from "@/components/icons";
import { SubmitPostResponse } from "@/types/task";

interface SubmitPostFormProps {
    onSubmit: (url: string) => void;
    disabled?: boolean;
    loading?: boolean;
    result?: SubmitPostResponse;
    error?: Error | null;
}

export default function SubmitPostForm({
    onSubmit,
    disabled = false,
    loading = false,
    result,
    error,
}: SubmitPostFormProps) {
    const [url, setUrl] = useState("");

    const submission = result?.submission;

    const approved = submission?.status === "approved";

    const rewardRows = useMemo(() => {
        if (!submission?.rewards) {
            return [
                {
                    label: "Base Reward",
                    value: null,
                },
                {
                    label: "Quality Multiplier",
                    value: null,
                },
                {
                    label: "Engagement Bonus",
                    value: null,
                },
                {
                    label: "Streak Bonus",
                    value: null,
                },
                {
                    label: "X Traction Bonus",
                    value: null,
                },
            ];
        }

        const {
            base_reward,
            quality_multiplier,
            engagement_bonus,
            streak_bonus,
            x_traction_bonus,
            x_traction_pending,
        } = submission.rewards;

        return [
            {
                label: "Base Reward",
                value: `+${base_reward} QP`,
            },
            {
                label: "Quality Multiplier",
                value: `+${quality_multiplier} QP`,
            },
            {
                label: "Engagement Bonus",
                value: `+${engagement_bonus} QP`,
            },
            {
                label: "Streak Bonus",
                value: `+${streak_bonus} QP`,
            },
            {
                label: "X Traction Bonus",
                value: x_traction_pending ? "Pending (24h)" : `+${x_traction_bonus} QP`,
            },
        ];
    }, [submission]);

    const handleVerify = () => {
        const value = url.trim();

        if (!value) return;

        onSubmit(value);
    };

    return (
        <Box
            sx={{
                background: "#fff",
                borderRadius: "24px",
                border: "1px solid #EAECEF",
                p: 4,
            }}
        >
            <Typography
                sx={{
                    fontWeight: 600,
                    fontSize: 18,
                    mb: 1,
                }}
            >
                Submit Your Post
            </Typography>

            <Typography
                sx={{
                    color: "#5E5E61",
                    mb: 3,
                }}
            >
                Paste the URL of your X post below to verify and claim your ecosystem
                points.
            </Typography>

            <Typography
                sx={{
                    mb: 1,
                    fontWeight: 500,
                }}
            >
                X Post URL
            </Typography>

            <TextField
                fullWidth
                value={url}
                disabled={disabled || loading}
                placeholder="https://x.com/username/status/..."
                onChange={(e) => setUrl(e.target.value)}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <LinkIcon />
                            </InputAdornment>
                        ),
                    },
                }}
                sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                        background: "#EEF0F3",
                        borderRadius: "12px",
                        "& fieldset": {
                            border: "none",
                        },
                    },
                }}
            />

            <Button
                fullWidth
                variant="contained"
                onClick={handleVerify}
                disabled={disabled || loading || !url.trim()}
                sx={{
                    borderRadius: "999px",
                    py: 1.5,
                    mb: 4,
                    textTransform: "none",
                }}
            >
                {loading ? "Verifying..." : "Verify Post"}
            </Button>

            <Box
                sx={{
                    background: "#F9FAFB",
                    borderRadius: "12px",
                    border: "1px solid #EAECEF",
                    p: 2.5,
                }}
            >
                {approved ? (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "#05B169",
                            mb: 2,
                        }}
                    >
                        <CheckCircleIcon />

                        <Typography
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            Post Verified Successfully
                        </Typography>
                    </Box>
                ) : loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "#003EC7",
                            mb: 2,
                        }}
                    >
                        <CircularProgress
                            size={18}
                            thickness={5}
                            sx={{
                                color: "#003EC7",
                            }}
                        />

                        <Typography
                            sx={{
                                fontWeight: 700,
                                color: "#003EC7",
                            }}
                        >
                            Loading
                            <Box
                                component="span"
                                sx={{
                                    display: "inline-block",
                                    width: "1.2em",
                                    overflow: "hidden",
                                    verticalAlign: "bottom",
                                    "&::after": {
                                        content: '"..."',
                                        display: "inline-block",
                                        animation: "loadingDots 1.4s steps(4, end) infinite",
                                    },
                                    "@keyframes loadingDots": {
                                        "0%": {
                                            width: "0ch",
                                        },
                                        "25%": {
                                            width: "1ch",
                                        },
                                        "50%": {
                                            width: "2ch",
                                        },
                                        "75%": {
                                            width: "3ch",
                                        },
                                        "100%": {
                                            width: "0ch",
                                        },
                                    },
                                }}
                            />
                        </Typography>
                    </Box>
                ) : error ? (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "#DC2626",
                            mb: 2,
                        }}
                    >
                        <ErrorIcon
                            sx={{
                                color: "#DC2626",
                                fontSize: 20,
                            }}
                        />

                        <Typography
                            sx={{
                                fontWeight: 700,
                                color: "#DC2626",
                            }}
                        >
                            Verify Post Failed
                        </Typography>
                    </Box>
                ) : null}

                {rewardRows.map((row) => (
                    <Box
                        key={row.label}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1.5,
                        }}
                    >
                        <Typography
                            sx={{
                                color: "#5E5E61",
                                fontFamily: "var(--font-jetBrain-mono)",
                            }}
                        >
                            {row.label}
                        </Typography>

                        {loading ? (
                            <Skeleton variant="text" width={70} height={28} />
                        ) : row.value !== null ? (
                            <Typography
                                sx={{
                                    color: "#0A0B0D",
                                    fontWeight: 600,
                                    fontFamily: "var(--font-jetBrain-mono)",
                                }}
                            >
                                {row.value}
                            </Typography>
                        ) : (
                            <Typography
                                sx={{
                                    color: "#0A0B0D",
                                    fontWeight: 600,
                                    fontFamily: "var(--font-jetBrain-mono)",
                                }}
                            >
                                0 QP
                            </Typography>
                        )}
                    </Box>
                ))}

                <Box
                    sx={{
                        mt: 2,
                        pt: 2,
                        borderTop: "1px solid #EAECEF",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography>Total Earned</Typography>

                    {loading ? (
                        <Skeleton variant="text" width={80} height={30} />
                    ) : submission?.earned_now != null ? (
                        <Typography
                            sx={{
                                color: "#003EC7",
                                fontWeight: 700,
                            }}
                        >
                            +{submission.earned_now} QP
                        </Typography>
                    ) : (
                        <Typography
                            sx={{
                                color: "#003EC7",
                                fontWeight: 700,
                            }}
                        >
                            +0 QP
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
