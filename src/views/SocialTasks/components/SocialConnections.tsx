import React from "react";

import {
    Card,
    Grid,
    Stack,
    Avatar,
    Box,
    Button,
    Typography,
    styled,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TwitterIcon from "@mui/icons-material/Twitter";
import TelegramIcon from "@mui/icons-material/Telegram";

import { ConnectTelegramBody, SocialOverview } from "@/types/socialTask";

const ConnectionCard = styled(Card)({
    border: "1px solid #DEE1E6",
    borderRadius: "24px",
    boxShadow: "none",
    backgroundColor: "#FFFFFF",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
});

interface Props {
    overview?: SocialOverview;

    loading?: boolean;

    onConnectTelegram(): void;
    onConnectX: () => void;
    disabled?: boolean;
    loadingX?: boolean;
    xUsername?: string | null;
    telegramUsername?: string | null;
}

export const SocialConnections = ({
    overview,
    loading = false,
    onConnectTelegram,
    onConnectX,
    disabled,
    loadingX,
    xUsername,
    telegramUsername,
}: Props) => {
    const isXConnected = overview?.connections.x ?? false;
    const isTelegramConnected = overview?.connections.telegram ?? false;

    return (
        <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 6 }}>
                <ConnectionCard>
                    <Stack
                        sx={{
                            gap: "16px",
                            alignItems: "center",
                        }}
                        direction="row"
                    >
                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: "#EFF6FF",
                            }}
                        >
                            <TwitterIcon
                                sx={{
                                    color: "#1DA1F2",
                                }}
                            />
                        </Avatar>

                        <Box>
                            <Stack
                                sx={{
                                    gap: "8px",
                                    alignItems: "center",
                                }}
                                direction="row"
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: "14px",
                                        color: "#111827",
                                    }}
                                >
                                    X (Twitter)
                                </Typography>

                                {isXConnected && (
                                    <CheckCircleIcon
                                        sx={{
                                            color: "#10B981",
                                            fontSize: "16px",
                                        }}
                                    />
                                )}
                            </Stack>

                            <Typography
                                sx={{
                                    color: "#737688",
                                    fontFamily: "var(--font-jetBrain-mono)",
                                }}
                            >
                                {isXConnected
                                    ? xUsername
                                        ? `@${xUsername}`
                                        : "Connected"
                                    : "Not connected"}
                            </Typography>
                        </Box>
                    </Stack>

                    <Button
                        variant="outlined"
                        // disabled={!isOverviewReady}
                        disabled={disabled || loadingX}
                        onClick={onConnectX}
                        sx={{
                            textTransform: "none",
                            background: "#0052FF",
                            borderRadius: "99px",
                            color: "#FFFFFF",
                            border: "1px solid #E5E7EB",
                            fontWeight: 400,
                            px: 5,
                            visibility: isXConnected ? "hidden" : "visible",

                            "&:hover": {
                                background: "#0052FF",
                            },

                            "&.Mui-disabled": {
                                background: "#FFFFFF",
                                color: "#737688",
                                border: "1px solid #DEE1E6",
                            },
                        }}
                    >
                        Connect X
                    </Button>
                </ConnectionCard>
            </Grid>

            {/* <Grid size={{ xs: 12, md: 6 }}>
                <ConnectionCard>
                    <Stack
                        sx={{
                            gap: "16px",
                            alignItems: "center",
                        }}
                        direction="row"
                    >
                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: isTelegramConnected ? "#EFF6FF" : "#F3F4F6",
                            }}
                        >
                            <TelegramIcon
                                sx={{
                                    color: isTelegramConnected ? "#229ED9" : "#9CA3AF",
                                }}
                            />
                        </Avatar>

                        <Box>
                            <Stack
                                direction="row"
                                sx={{
                                    gap: "8px",
                                    alignItems: "center",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: "14px",
                                        color: "#111827",
                                    }}
                                >
                                    Telegram
                                </Typography>

                                {isTelegramConnected && (
                                    <CheckCircleIcon
                                        sx={{
                                            color: "#10B981",
                                            fontSize: "16px",
                                        }}
                                    />
                                )}
                            </Stack>

                            <Typography
                                sx={{
                                    color: "#737688",
                                    fontFamily: "var(--font-jetBrain-mono)",
                                }}
                            >
                                {isTelegramConnected
                                    ? telegramUsername
                                        ? `@${telegramUsername}`
                                        : "Connected"
                                    : "Not connected"}
                            </Typography>
                        </Box>
                    </Stack>

                    <Button
                        onClick={onConnectTelegram}
                        variant="outlined"
                        disabled={disabled || loading}
                        sx={{
                            textTransform: "none",
                            background: "#0052FF",
                            borderRadius: "99px",
                            color: "#FFFFFF",
                            border: "1px solid #E5E7EB",
                            boxShadow: "none",
                            fontWeight: 400,
                            px: 5,
                            visibility: isTelegramConnected ? "hidden" : "visible",
                            "&:hover": {
                                background: "#0052FF",
                            },

                            "&.Mui-disabled": {
                                background: "#FFFFFF",
                                color: "#737688",
                                border: "1px solid #DEE1E6",
                            },
                        }}
                    >
                        Connect Telegram
                    </Button>
                </ConnectionCard>
            </Grid> */}
        </Grid>
    );
};
