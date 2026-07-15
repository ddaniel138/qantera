import { Box } from "@mui/material";
import { useAccount, useBalance, useSwitchChain } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import FaucetHero from "./components/FaucetHero";
import FaucetCard from "./components/FaucetCard";
import RecentClaimsTable from "./components/RecentClaimsTable";

import {
    useClaimStatus,
    useFaucet,
    useFaucetHistory,
    usePrefetchOkx,
} from "@/hooks/faucet";
import { formatAmount, formatDate } from "@/helpers";
import { useActiveChainCurrency } from "@/chains/utils";
import { qantera } from "@/chains";
import { useEffect } from "react";

export default function FaucetView() {
    const { address, isConnected, chainId } = useAccount();
    const { switchChainAsync } = useSwitchChain();

    const isWrongNetwork = chainId !== qantera.id;

    const { openConnectModal } = useConnectModal();

    usePrefetchOkx()

    const faucet = useFaucet();
    const { data: balanceData, isLoading: isBalanceLoading, refetch: refetchBalance } = useBalance({address: address});

    const currentBalance = isConnected && balanceData
        ? parseFloat(balanceData.formatted).toFixed(2)
        : "0.00";

    const history = useFaucetHistory(address);

    const claimStatus = useClaimStatus({ address });

    const { symbol } = useActiveChainCurrency();

    const recentClaims = history.map(
        (item) => ({
            amount: `${item.amountWei} ${symbol}`,
            faucet: item.faucet,
            date: formatDate(
                item.createdAt
            ),
            // tx: shortenHash(
            //     item.txHash
            // ),
            tx: item.txHash,
        })
    );

    const handleClaim = async () => {
        if (!isConnected) {
            openConnectModal?.();
            return;
        }

        try {
            if (isWrongNetwork) {
                await switchChainAsync({ chainId: qantera.id });
            }
            await faucet.claim();
            refetchBalance()
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
                claimAmount="1"
                currentBalance={currentBalance}
                loading={faucet.isPending}
                claimed={claimStatus.claimed}
                claimedAt={claimStatus.claimedAt}
                onClaim={handleClaim}
                onConnect={() => openConnectModal?.()}
            />

            <RecentClaimsTable data={recentClaims} />
        </Box>
    );
}