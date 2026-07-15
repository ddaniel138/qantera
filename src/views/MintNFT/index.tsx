import React, { useCallback, useMemo, useState } from "react";
import { Box, Typography, Button, Grid, Paper, Skeleton } from "@mui/material";
import { MOCK_NFT_STATS, MOCK_ATTRIBUTES, MOCK_CHECKLIST } from "./constants";
import { CardLabel, JetBrainMonoText } from "./components/StyledComponents";
import NFTPreviewCard from "./components/NFTPreviewCard";
import EligibilityChecklist from "./components/EligibilityChecklist";
import AttributesTable from "./components/AttributesTable";
import { useAccount, useConfig, useWriteContract } from "wagmi";
import {
    useConfirmMint,
    useMintAuthorization,
    useMintEligibility,
} from "@/hooks/mintNFT";
import { useMe } from "@/hooks/tasks";
import {
    getMintAuthorization,
    isRequirementMet,
    isWalletMatched,
} from "@/utils/mintNFT";
import { MintAuthorizationResponse, MintChecklistItem } from "@/types/mintNFT";
import { BaseError } from "viem";
import mintABI from "@/constants/abi/mint.json";
import useTotalMinted from "@/hooks/mintNFT/useTotalMinted";

export default function MintNFTView() {
    const { address } = useAccount();

    const [authorization, setAuthorization] = useState<MintAuthorizationResponse | null>(null);

    const [authorizationExpiredAt, setAuthorizationExpiredAt] = useState<number>(0);

    const { data: meData, isSuccess: meLoaded } = useMe({
        wallet: address,
        enabled: !!address,
    });

    const accountReady = meLoaded && !!meData?.user;

    const {
        data: eligibility,
        refetch: refetchEligibility,
    } = useMintEligibility({
        wallet: address,
        enabled: accountReady,
    });

    const {
        totalMinted,
        isLoading,
        refetch: refetchTotalMinted,
    } = useTotalMinted();

    const { mutateAsync: authorizeMint, isPending: authorizing } = useMintAuthorization();

    const { mutateAsync: confirmMint, isPending: confirming } = useConfirmMint();

    const config = useConfig();

    const { writeContractAsync, isPending: writingContract } = useWriteContract();

    const handleMint = useCallback(async () => {
        if (!address) return;
        const wallet = address;
        if (!eligibility) return;
        if (!eligibility.eligible) return;
        if (eligibility.already_minted) return;
        try {
            const auth = await getMintAuthorization({
                wallet,
                authorization,
                authorizationExpiredAt,
                authorizeMint,
                setAuthorization,
                setAuthorizationExpiredAt,
            });
            const txHash = await writeContractAsync({
                address: auth.nft.mint.contract,
                abi: mintABI,
                functionName: auth.nft.mint.function,
                args: [
                    auth.authorization.wallet,
                    BigInt(auth.authorization.deadline),
                    auth.authorization.signature,
                ],
            });
            const res = await confirmMint({
                wallet,
                body: {
                    tx_hash: txHash,
                },
            });
            setAuthorization(null);
            setAuthorizationExpiredAt(0);
            await Promise.all([
                refetchEligibility(),
                refetchTotalMinted()

                /**
                 * TODO
                 * refetchLeaderboard()
                 * refetchProfile()
                 * refetchNFT()
                 */

            ]);
        } catch (err) {
            if (
                err instanceof BaseError &&
                err.shortMessage.toLowerCase().includes("expired")
            ) {
                setAuthorization(null);

                setAuthorizationExpiredAt(0);
            }
            if (
                err instanceof BaseError &&
                err.shortMessage.toLowerCase().includes("rejected")
            ) {
                return;
            }
            if (
                err instanceof BaseError &&
                err.shortMessage.toLowerCase().includes("denied")
            ) {
                return;
            }

            console.error(err);
        }
    }, [address, eligibility, authorization, authorizationExpiredAt, authorizeMint, writeContractAsync, confirmMint, refetchEligibility, refetchTotalMinted]);
    const isMintLoading = authorizing || writingContract || confirming;
    
    const checklist = useMemo<MintChecklistItem[]>(() => {
        if (!eligibility) return MOCK_CHECKLIST;
        const requirements = eligibility.requirements;
        return [
            {
                key: "wallet_connected",
                label: "Wallet Connected",
                met: isWalletMatched(address, requirements.wallet_connected.wallet),
            },
            {
                key: "faucet_claimed",
                label: "Claimed Faucet",
                met: requirements.faucet_claimed.claimed,
            },
            {
                key: "min_yap_points",
                label: "Minimum 1000 QP Yap ",
                met: isRequirementMet(
                    requirements.min_yap_points.current,
                    requirements.min_yap_points.required
                ),
            },
            {
                key: "social_tasks_complete",
                label: "Completed Social Tasks",
                met: isRequirementMet(
                    requirements.social_tasks_complete.completed,
                    requirements.social_tasks_complete.total
                ),
            },
        ];
    }, [eligibility, address]);

    const canMint = useMemo(() => {
        if (!eligibility) return false;
        if (eligibility.already_minted) return false;
        const {
            wallet_connected,
            faucet_claimed,
            min_yap_points,
            social_tasks_complete,
        } = eligibility.requirements;
        return (
            wallet_connected.met &&
            faucet_claimed.met &&
            faucet_claimed.claimed &&
            min_yap_points.current >= min_yap_points.required &&
            social_tasks_complete.completed >= social_tasks_complete.total
        );
    }, [eligibility]);
    
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
            <Grid container spacing={{ xs: 3, md: 6 }} sx={{ alignItems: "stretch" }}>
                <Grid size={{ xs: 12, md: 5 }} sx={{ display: "flex" }}>
                    <NFTPreviewCard />
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 3, md: 4 },
                            borderRadius: "32px",
                            border: "1px solid #DEE1E6",
                            backgroundColor: "#FFFFFF",
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 400,
                                mb: 1,
                                fontSize: { xs: "42px", md: "52px" },
                                color: "#0A0B0D",
                            }}
                        >
                            Qantera Origin NFT
                        </Typography>
                        <Typography
                            sx={{
                                color: "#5E5E61",
                                fontSize: { xs: "14px", md: "16px" },
                                mb: 4,
                            }}
                        >
                            Proof that you were here before the quantum-safe era began.
                        </Typography>

                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Box
                                    sx={{
                                        p: 2,
                                        backgroundColor: "#F9FAFB",
                                        borderRadius: "12px",
                                        border: "1px solid #F3F4F6",
                                    }}
                                >
                                    <CardLabel>Total minted</CardLabel>
                                    <JetBrainMonoText sx={{ fontSize: "18px" }}>
                                        {totalMinted !== undefined ? (
                                            <>
                                                {totalMinted}
                                            </>
                                        ) : (
                                            <>
                                                <Skeleton
                                                    variant="text"
                                                    width={50}
                                                    sx={{
                                                        display: "inline-block",
                                                        verticalAlign: "middle",
                                                    }}
                                                />
                                            </>
                                        )}
                                    </JetBrainMonoText>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Box
                                    sx={{
                                        p: 2,
                                        backgroundColor: "#F9FAFB",
                                        borderRadius: "12px",
                                        border: "1px solid #F3F4F6",
                                    }}
                                >
                                    <CardLabel>Price</CardLabel>
                                    <JetBrainMonoText sx={{ fontSize: "15px" }}>
                                        {MOCK_NFT_STATS.price}
                                    </JetBrainMonoText>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Box
                                    sx={{
                                        p: 2,
                                        backgroundColor: "#F9FAFB",
                                        borderRadius: "12px",
                                        border: "1px solid #F3F4F6",
                                    }}
                                >
                                    <CardLabel>Limit</CardLabel>
                                    <JetBrainMonoText sx={{ fontSize: "15px" }}>
                                        {MOCK_NFT_STATS.limit}
                                    </JetBrainMonoText>
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Checklist Component */}
                        <EligibilityChecklist items={checklist} />

                        {/* Action Mint Button */}
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleMint}
                            disabled={
                                !canMint ||
                                isMintLoading
                            }
                            sx={{
                                backgroundColor: "#003EC7",
                                color: "#FFFFFF",
                                fontWeight: 700,
                                py: { xs: 1, md: 1.8 },
                                borderRadius: "100px",
                                textTransform: "none",
                                boxShadow: "0px 4px 12px 0px #0000000A",
                                fontSize: { xs: "14px", md: "18px" },
                                "&:hover": {
                                    backgroundColor: "#002da3",
                                },
                            }}
                        >
                            {isMintLoading
                                ? "Minting..."
                                : eligibility?.already_minted
                                    ? "Already Minted"
                                    : "Mint Origin NFT"}
                        </Button>
                    </Paper>

                    <AttributesTable attributes={MOCK_ATTRIBUTES} />
                </Grid>
            </Grid>
        </Box>
    );
}
