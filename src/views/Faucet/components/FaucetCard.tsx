import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import GridContainer from "./GridContainer";
import { useRef, useState } from "react";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import ConnectWalletModal from "@/components/modal/ConnectWalletModal";
import { useActiveChainCurrency } from "@/chains";
import FaucetClaimButton from "./FaucetClaimButton";
import { useWalletType } from "@/hooks/faucet";
import { WalletType } from "@/constants/faucet";

interface Props {
    connected: boolean;

    address?: string;

    networkName: string;

    currentBalance: string;

    loading: boolean;

    claimed: boolean;

    claimedAt?: string;

    onClaim: () => void;

    onConnect: () => void;
}

function shortenAddress(address?: string) {
    if (!address) return "";

    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function FaucetCard({
    connected,
    address,
    networkName,
    currentBalance,
    loading,
    claimed,
    claimedAt,
    onClaim,
    onConnect,
}: Props) {
    const [copiedOpen, setCopiedOpen] = useState(false);
    const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

    const handleCopy = async () => {
        if (!address) return;

        await navigator.clipboard.writeText(address);
        setCopiedOpen(true);

        if (copiedTimeoutRef.current) {
            clearTimeout(copiedTimeoutRef.current);
        }

        copiedTimeoutRef.current = setTimeout(() => {
            setCopiedOpen(false);
        }, 1500);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { name, symbol } = useActiveChainCurrency();

    const walletType = useWalletType();

    const ClaimAmount = walletType === WalletType.OKX ? 3 : 1

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 3, md: 4 },
                borderRadius: "32px",
                border: "1px solid #DEE1E6",
                backgroundColor: "#FFFFFF",
                mb: 6,
                maxWidth: "576px",
                width: "100%",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #DEE1E6",
                    pb: 2,
                    mb: 3,
                }}
            >
                <Typography
                    sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#7C828A",
                        textTransform: "uppercase",
                    }}
                >
                    Network
                </Typography>

                <Typography
                    sx={{
                        fontWeight: 700,
                        fontSize: 16,
                    }}
                >
                    Qantera Testnet
                </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography
                    sx={{
                        mb: 1,
                        fontSize: 14,
                        fontWeight: 500,
                    }}
                >
                    Wallet Address
                </Typography>

                <TextField
                    fullWidth
                    disabled
                    value={connected ? shortenAddress(address) : ""}
                    placeholder="Connect wallet"
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: "#F9FAFB",
                            borderRadius: "12px",
                            fontSize: "18px",
                            fontFamily: "var(--font-jetBrain-mono)",
                            fontWeight: 500,
                        },
                    }}
                    slotProps={{
                        input: {
                            endAdornment: connected && (
                                <InputAdornment position="end">
                                    <Tooltip
                                        title="Copied!"
                                        open={copiedOpen}
                                        arrow
                                        placement="top"
                                        disableFocusListener
                                        disableHoverListener
                                        disableTouchListener
                                        onClose={() => setCopiedOpen(false)}
                                    >
                                        <IconButton onClick={handleCopy}>
                                            <ContentCopyIcon
                                                sx={{
                                                    fontSize: 16,
                                                }}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </Box>

            <GridContainer
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 3,
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#7C828A",
                            textTransform: "uppercase",
                        }}
                    >
                        Current Balance
                    </Typography>

                    <Typography
                        sx={{
                            fontWeight: 500,
                            fontSize: 20,
                            fontFamily: "var(--font-jetBrain-mono)",
                        }}
                    >
                        {currentBalance} {symbol}
                    </Typography>
                </Box>

                <Box sx={{ textAlign: "right" }}>
                    <Typography
                        sx={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#7C828A",
                            textTransform: "uppercase",
                        }}
                    >
                        Claim Amount
                    </Typography>

                    <Typography
                        sx={{
                            fontWeight: 500,
                            fontSize: 20,
                            color: "#003EC7",
                            fontFamily: "var(--font-jetBrain-mono)",
                        }}
                    >
                        {ClaimAmount} {symbol}
                    </Typography>
                </Box>
            </GridContainer>

            {connected ? (
                <FaucetClaimButton
                    loading={loading}
                    claimed={claimed}
                    claimedAt={claimedAt}
                    claimAmount={ClaimAmount}
                    symbol={symbol}
                    onClick={onClaim}
                />
            ) : (
                <>
                    <Box>
                        <ConnectWalletButton
                            variant="connect-wallet-second"
                            onConnectClick={() => setIsModalOpen(true)}
                            showIcon={false}
                        />
                    </Box>

                    <ConnectWalletModal
                        open={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                </>


            )}
        </Paper>
    );
}