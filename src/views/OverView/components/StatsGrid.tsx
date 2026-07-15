/* eslint-disable react/jsx-key */

import React from "react";
import {
    Box,
    Typography,
    Card,
    Skeleton,
} from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import { StatItem } from "../constants";
import {
    StarIcon,
    TotalCoinIcon,
} from "@/components/icons";

interface Props {
    stats: StatItem[];
    loading?: boolean;
}

export const StatsGrid = ({
    stats,
    loading = false,
}: Props) => {
    const icons = [
        <AccountBalanceWalletOutlinedIcon
            sx={{
                fontSize: 16,
                color: "#6B7280",
            }}
        />,
        <TotalCoinIcon />,
        <EmojiEventsOutlinedIcon
            sx={{
                fontSize: 16,
                color: "#6B7280",
            }}
        />,
        <StarIcon />,
    ];
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2,1fr)",
                    md: "repeat(4,1fr)",
                },
                gap: 4,
                mb: 4,
            }}
        >
            {stats.map((item, index) => (
                <Card
                    key={index}
                    sx={{
                        p: 2.5,
                        borderRadius: "24px",
                        border: "1px solid #DEE1E6",
                        boxShadow: "none",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: "100px",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 500,
                                color: "#5E5E61",
                            }}
                        >
                            {item.label}
                        </Typography>

                        <Box
                            sx={{
                                p: 1,
                                bgcolor: "#F7F7F7",
                                borderRadius:
                                    "99px",
                                display: "flex",
                            }}
                        >
                            {icons[index]}
                        </Box>
                    </Box>

                    {loading ? (
                        <Skeleton
                            width={140}
                            height={42}
                        />
                    ) : (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems:
                                    "baseline",
                                gap: 0.5,
                            }}
                        >
                            {item.label === "NFT Status" ? (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 6,
                                            height: 6,
                                            bgcolor: item.isEligible ? "#05B169" : "#EF4444",
                                            borderRadius: "50%",
                                        }}
                                    />

                                    <Typography
                                        sx={{
                                            fontSize: "18px",
                                            fontWeight: 700,
                                            color: "#111827",
                                        }}
                                    >
                                        {item.value}
                                    </Typography>
                                </Box>
                            ) : (
                                <>
                                    <Typography
                                        sx={{
                                            fontFamily:
                                                "var(--font-jetBrain-mono)",
                                            fontSize:
                                                "32px",
                                            fontWeight: 700,
                                            color:
                                                "#111827",
                                        }}
                                    >
                                        {item.value}
                                    </Typography>

                                    {item.unit && (
                                        <Typography
                                            sx={{
                                                fontFamily:
                                                    "var(--font-jetBrain-mono)",
                                                fontSize:
                                                    "32px",
                                                fontWeight: 700,
                                                color:
                                                    "#111827",
                                                ml: 0.5,
                                            }}
                                        >
                                            {
                                                item.unit
                                            }
                                        </Typography>
                                    )}

                                    {item.change && (
                                        <Typography
                                            sx={{
                                                fontSize:
                                                    "12px",
                                                fontWeight: 600,
                                                color:
                                                    "#05B169",
                                                ml: 1,
                                            }}
                                        >
                                            ↑
                                            {item.change}
                                        </Typography>
                                    )}
                                </>
                            )}
                        </Box>
                    )}
                </Card>
            ))}
        </Box>
    );
};