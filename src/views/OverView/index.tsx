import React, { useMemo, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useAccount, useBalance } from "wagmi";
import { WelcomeHeader } from "./components/WelcomeHeader";
import { StatsGrid } from "./components/StatsGrid";
import { ReferralCard } from "./components/ReferralCard";
import { TestnetJourney } from "./components/TestnetJourney";
import { MissionCard } from "./components/MissionCard";
import { SocialConnections } from "@/views/SocialTasks/components/SocialConnections";
import TelegramConnectDialog from "@/components/TelegramConnectDialog";
import {
    MOCK_STATS_DATA,
    MOCK_JOURNEY_DATA,
    REFERRAL_DATA,
    JourneyItem,
} from "./constants";
import { useOverview } from "@/hooks/overview";
import { useMintEligibility } from "@/hooks/mintNFT";
import { useConnectTelegram, useSocialTasks } from "@/hooks/SocialTask";
import { useConnectWallet, useMe } from "@/hooks/tasks";
import { ConnectTelegramBody } from "@/types/socialTask";
import { isRequirementMet, isWalletMatched } from "@/utils/mintNFT";

export default function OverViewView() {
    const { address, isConnected } = useAccount();
    const [telegramOpen, setTelegramOpen] = useState(false);

    const {
        data: meData,
        isSuccess: meLoaded,
        isLoading: loadingUseMe,
    } = useMe({
        wallet: address,
        enabled: isConnected,
    });

    const accountReady = meLoaded && !!meData?.user;

    const { data, isLoading } = useOverview({
        wallet: isConnected ? address : undefined,
        enabled: accountReady,
    });

    const { overview, refetch: refetchSocialTasks } = useSocialTasks({
        wallet: address,
        enabled: accountReady,
    });

    const {
        mutate: connectWallet,
        isPending: isConnectingX,
    } = useConnectWallet();

    const { mutate: connectTelegram, isPending: isConnectingTelegram } = useConnectTelegram();

    const {
        data: eligibility,
        isLoading: eligibilityLoading,
        refetch: refetchEligibility,
    } = useMintEligibility({
        wallet: address,
        enabled: accountReady,
    });

    const { data: balance } = useBalance({
        address,
        query: {
            enabled: !!address,
        },
    });

    const statsData = useMemo(() => {
        if (!isConnected) {
            return MOCK_STATS_DATA;
        }
        const alreadyMinted = eligibility?.already_minted ?? false;
        return [
            {
                ...MOCK_STATS_DATA[0],
                value: balance
                    ? Number(balance.formatted).toFixed(4)
                    : "0.0000",
                unit: balance?.symbol,
            },
            {
                ...MOCK_STATS_DATA[1],
                value: (data?.user.total_points ?? 0).toLocaleString(),
            },
            {
                ...MOCK_STATS_DATA[2],
                value: data?.user.rank
                    ? `#${data.user.rank}`
                    : "--",
            },
            {
                ...MOCK_STATS_DATA[3],
                value: alreadyMinted
                    ? "Eligible to Mint"
                    : "Not Eligible to Mint",
                isEligible: alreadyMinted,
            },
        ];
    }, [balance, data, eligibility, isConnected]);

    const referralData = useMemo(() => {
        if (!data) {
            return REFERRAL_DATA;
        }
        const refCode = data.referral.code;
        const origin = typeof window !== "undefined"
            ? window.location.origin
            : "";

        return {
            refCode,
            link: `${origin}/tasks?q=${refCode}`,
            shareLink: `${origin}/tasks?q=${refCode}`,
            invitedUsers: data.referral.invited_users,
            approvedPosts: data.referral.invitee_approved_posts,
            earnedQP: data.referral.referral_qp_earned,
        };
    }, [data]);

    const journeyData = useMemo<JourneyItem[]>(() => {
        if (!eligibility) {
            return [];
        }

        const requirements = eligibility.requirements;
        const alreadyMinted = eligibility.already_minted;
        const rank = data?.user?.rank;

        return [
            {
                key: "wallet_connected",
                label: "Connect Wallet",
                description: "",
                met: isWalletMatched(
                    address,
                    requirements.wallet_connected.wallet
                ),
            },
            {
                key: "faucet_claimed",
                label: "Claimed Faucet",
                description: "",
                met: requirements.faucet_claimed.claimed,
            },
            {
                key: "min_yap_points",
                label: "Complete Yap Task",
                description:
                    "Engage with the community to earn points.",
                met: isRequirementMet(
                    requirements.min_yap_points.current,
                    requirements.min_yap_points.required
                ),
            },
            {
                key: "mint",
                label: "Mint Genesis NFT",
                description: "",
                met: alreadyMinted,
            },
            // {
            //     key: "reach_top1000",
            //     label: "Reach Top 1,000",
            //     description: "",
            //     met:
            //         typeof rank === "number" &&
            //         rank <= 1000,
            // },
        ];
    }, [eligibility, data, address]);

    const handleTelegramSuccess = async (
        telegram: ConnectTelegramBody
    ) => {
        if (!address) return;
        connectTelegram(
            {
                wallet: address,
                telegram,
            },
            {
                onSuccess: async () => {
                    await refetchSocialTasks();
                    setTelegramOpen(false);
                },
            }
        );
    };

    const handleConnectX = () => {
        if (!isConnected) return;
        connectWallet();
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
            <WelcomeHeader />

            <StatsGrid
                stats={statsData}
                loading={loadingUseMe || isLoading}
            />

            <SocialConnections
                overview={overview}
                loading={isConnectingTelegram}
                onConnectTelegram={() => setTelegramOpen(true)}
                onConnectX={handleConnectX}
                disabled={!isConnected}
                loadingX={loadingUseMe || isConnectingX}
                xUsername={meData?.user?.x_username}
                telegramUsername={meData?.user?.telegram_username}
            />

            {/* <TelegramConnectDialog
                open={telegramOpen}
                onClose={() => setTelegramOpen(false)}
                onSuccess={handleTelegramSuccess}
            /> */}

            <ReferralCard
                data={referralData}
                loading={loadingUseMe || isLoading}
                disabled={!isConnected}
            />

            <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid size={{ xs: 12, md: 7, lg: 8 }}>
                    <TestnetJourney
                        steps={journeyData}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 5, lg: 4 }}>
                    <MissionCard />
                </Grid>
            </Grid>
        </Box>
    );
}