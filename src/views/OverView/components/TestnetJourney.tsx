import React from "react";
import { Box, Typography, Card } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { JourneyItem } from "../constants";

const DEFAULT_STEPS: JourneyItem[] = [
    {
        key: "wallet_connected",
        label: "Connect Wallet",
        description: "",
        met: false,
    },
    {
        key: "faucet_claimed",
        label: "Claimed Faucet",
        description: "",
        met: false,
    },
    {
        key: "min_yap_points",
        label: "Complete Yap Task",
        description: "Engage with the community to earn points.",
        met: false,
    },
    {
        key: "mint",
        label: "Mint Genesis NFT",
        description: "",
        met: false,
    },
    // {
    //     key: "reach_top1000",
    //     label: "Reach Top 1,000",
    //     description: "",
    //     met: false,
    // },
];

interface Props {
    steps?: JourneyItem[];
}

export const TestnetJourney = ({ steps }: Props) => {
    const items = steps && steps.length > 0 ? steps : DEFAULT_STEPS;

    return (
        <Card
            sx={{
                p: 4,
                borderRadius: "16px",
                border: "1px solid #DEE1E6",
                boxShadow: "none",
                height: "100%",
            }}
        >
            <Typography
                sx={{
                    fontWeight: 700,
                    color: "#111827",
                    mb: 4,
                    fontSize: "18px",
                }}
            >
                Testnet Journey
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                }}
            >
                {items.map((step, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <Box
                            key={step.key}
                            sx={{
                                display: "flex",
                                gap: 2,
                                minHeight: "64px",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                {step.met ? (
                                    <CheckCircleIcon
                                        sx={{
                                            color: "#05B169",
                                            fontSize: 22,
                                        }}
                                    />
                                ) : (
                                    <Box 
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        backgroundColor: "#F7F7F7",
                                        borderRadius: '99px'
                                    }}
                                    >
                                        <LockOutlinedIcon
                                            sx={{
                                                color: "#9CA3AF",
                                                fontSize: 22,
                                                p: "2px",
                                            }}
                                        />
                                    </Box>
                                )}

                                {!isLast && (
                                    <Box
                                        sx={{
                                            width: "2px",
                                            flexGrow: 1,
                                            bgcolor: step.met ? "#10B981" : "#E5E7EB",
                                            my: 0.5,
                                        }}
                                    />
                                )}
                            </Box>

                            <Box
                                sx={{
                                    pb: isLast ? 0 : 3,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: "16px",
                                        fontWeight: step.met ? 400 : 400,
                                        color: step.met ? "#374151" : "#9CA3AF",
                                        // textDecoration: step.met ? "line-through" : "none",
                                    }}
                                >
                                    {step.label}
                                </Typography>

                                {!!step.description && (
                                    <Typography
                                        sx={{
                                            fontWeight: 500,
                                            color: step.met ? "#6B7280" : "#9CA3AF",
                                            mt: 0.5,
                                        }}
                                    >
                                        {step.description}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Card>
    );
};
