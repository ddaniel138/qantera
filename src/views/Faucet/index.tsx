import { Box } from "@mui/material";
import { useAccount, useBalance, useSwitchChain } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import FaucetHero from "./components/FaucetHero";
import FaucetCard from "./components/FaucetCard";
import RecentClaimsTable from "./components/RecentClaimsTable";

import {
    fetchClaims,
    useClaimStatus,
    useFaucet,
    useFaucetHistory,
    usePrefetchOkx,
    useRecentClaims,
} from "@/hooks/faucet";
import { formatAmount, formatDate } from "@/helpers";
import { useActiveChainCurrency } from "@/chains/utils";
import { qantera } from "@/chains";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FAUCET_QUERY_KEYS } from "@/constants/faucet";

interface RecentClaimItem {
    amount: string;
    faucet: boolean;
    date: string;
    tx: string;
}

export default function FaucetView() {
    usePrefetchOkx()
    const { address, isConnected, chainId } = useAccount();

    const { switchChainAsync } = useSwitchChain();

    const { openConnectModal } = useConnectModal();

    const faucet = useFaucet();

    const {
        data: balanceData,
        refetch: refetchBalance,
    } = useBalance({
        address,
    });

    const currentBalance =
        isConnected && balanceData
            ? parseFloat(balanceData.formatted).toFixed(2)
            : "0.00";

    const claimStatus = useClaimStatus({
        address,
    });

    const LIMIT = 5;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
    } = useRecentClaims({
        limit: LIMIT,
        polling: 60_000,
    });

    const recentClaims: RecentClaimItem[] =
        data?.pages.flatMap((page) =>
            page.claims.map((item) => ({
                amount: `${item.amount}`,
                faucet: true,
                date: formatDate(new Date(item.claimedAt).getTime()),
                tx: item.txHash,
            }))
        ) ?? [];

    const isWrongNetwork = chainId !== qantera.id;

    const handleClaim = async () => {
        if (!isConnected) {
            openConnectModal?.();
            return;
        }

        try {
            if (isWrongNetwork) {
                await switchChainAsync({
                    chainId: qantera.id,
                });
            }

            await faucet.claim();

            refetchBalance();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 900,
                mx: "auto",
                pt: { xs: 3, md: 4 },
                pb: 8,
                px: { xs: 2, md: 0 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <FaucetHero />

            {/* <FaucetCard
                connected={isConnected}
                address={address}
                networkName={"Qantera Testnet"}
                claimAmount={"1"}
                currentBalance={currentBalance}
                loading={faucet.isPending}
                onClaim={handleClaim}
                onConnect={() => openConnectModal?.()}
            /> */}
            <FaucetCard
                connected={isConnected}
                address={address}
                networkName="Qantera Testnet"
                currentBalance={currentBalance}
                loading={faucet.isPending}
                claimed={claimStatus.claimed}
                claimedAt={claimStatus.claimedAt}
                onClaim={handleClaim}
                onConnect={() => openConnectModal?.()}
            />

            <RecentClaimsTable
                data={recentClaims}
                hasMore={!!hasNextPage}
                loading={isFetching && !data}
                onLoadMore={() => {
                    if (!isFetchingNextPage && hasNextPage) {
                        fetchNextPage();
                    }
                }}
            />
        </Box>
    );
}