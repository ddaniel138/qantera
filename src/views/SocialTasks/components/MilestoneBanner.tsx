import React from "react";
import { Box, Typography, Stack, Button, styled } from "@mui/material";
import { TrophyIcon } from "@/components/icons";

const BannerWrapper = styled(Box)(({ theme }) => ({
    background: "#0A0B0D",
    borderRadius: "24px",
    padding: "32px",
    color: "#FFFFFF",
    position: "relative",
    overflow: "hidden",
    marginTop: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "24px",
    },
}));

interface Props {
    bonusPoints: number;

    disabled: boolean;

    loading?: boolean;

    onClaim: () => void;
}

export const MilestoneBanner = ({
    bonusPoints,
    disabled,
    loading = false,
    onClaim,
}: Props) => {
    return (
        <BannerWrapper>
            <Box
                sx={{
                    position: "absolute",
                    top: "-50%",
                    right: "-10%",
                    width: "350px",
                    height: "350px",
                    background:
                        "radial-gradient(circle, rgba(219,39,119,0.2) 0%, rgba(0,0,0,0) 70%)",
                    filter: "blur(30px)",
                    pointerEvents: "none",
                }}
            />

            <Box>
                <Box
                    sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        bgcolor: "#FFFFFF1A",
                        px: 2,
                        py: 1,
                        borderRadius: "99px",
                        mb: 1.5,
                        gap: '8px'
                    }}
                >
                    <TrophyIcon />
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontWeight: 600,
                            letterSpacing: "0.5px",
                        }}
                    >
                        Special Reward
                    </Typography>
                </Box>
                <Typography
                    sx={{ fontWeight: 700, mb: 1, fontSize: { xs: "28px", md: "32px" } }}
                >
                    Complete All Social Tasks
                </Typography>
                <Typography
                    sx={{
                        fontSize: "16px",
                        maxWidth: "520px",
                        lineHeight: 1.5,
                    }}
                >
                    Master the community ecosystem by finishing every mission. Unlock a
                    unique participant badge and earn a massive points bonus.
                </Typography>
            </Box>

            <Stack
                sx={{
                    zIndex: 1,
                    width: { xs: "100%", md: "auto" },
                    alignItems: { xs: "flex-start", md: "flex-end" },
                    gap: 1.5,
                }}
            >
                <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
                    <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#FFFFFF99" }}>
                        Bonus Reward
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "#FFFFFF",
                            fontFamily: "var(--font-jetBrain-mono)",
                        }}
                    >
                        +{bonusPoints} QP
                    </Typography>
                </Box>
                <Button
                    disabled={disabled}
                    onClick={onClaim}
                    sx={{
                        textTransform: "none",
                        bgcolor: "#FFFFFF",
                        color: "#111827",
                        borderRadius: "24px",
                        fontWeight: 400,
                        px: 4,
                        py: 1.5,
                        width: {
                            xs: "100%",
                            sm: "auto",
                        },
                        borderRight: "999px",
                        "&:disabled": {
                            bgcolor: "#E5E7EB",
                            color: "#9CA3AF",
                        },
                    }}
                >
                    {loading
                        ? "Claiming..."
                        : "Claim Milestone"}
                </Button>
            </Stack>
        </BannerWrapper>
    );
};
