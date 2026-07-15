"use client";

import {
    Box,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { useMemo } from "react";
import { useConnect } from "wagmi";
import { keyframes } from "@mui/system";

import WalletItem from "../wallet/WalletItem";
import { walletUI } from "../wallet/walletData";

interface Props {
    open: boolean;
    onClose: () => void;
}

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideDown = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }

  to {
    transform: translateY(100%);
    opacity: 0;
  }
`;

export default function ConnectWalletModal({
    open,
    onClose,
}: Props) {
    const {
        connectors,
        connect,
        isPending,
    } = useConnect();

    const displayConnectors = useMemo(() => {
        const map = new Map<string, typeof connectors[number]>();

        connectors.forEach((connector) => {
            if (!map.has(connector.id)) {
                map.set(connector.id, connector);
            }
        });

        return Array.from(map.values());
    }, [connectors]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
            slotProps={{
                paper: {
                    sx: {
                        overflow: "hidden",
                        bgcolor: "#fff",
                        maxWidth: 470,

                        m: { xs: 0, sm: 2 },
                        borderRadius: {
                            xs: "24px 24px 0 0",
                            sm: "28px",
                        },

                        position: {
                            xs: "fixed",
                            sm: "relative",
                        },

                        bottom: {
                            xs: 0,
                            sm: "auto",
                        },

                        width: {
                            xs: "100%",
                            sm: "calc(100% - 32px)",
                        },

                        maxHeight: {
                            xs: "calc(100% - 48px)",
                            sm: "none",
                        },
                        animation: {
                            xs: `${slideUp} .35s cubic-bezier(.22,.61,.36,1)`,
                            sm: "none",
                        },

                        transformOrigin: "bottom center",
                        willChange: "transform",
                    },
                },
            }}
            sx={{
                display: 'flex',
                alignItems: { xs: 'flex-end', sm: 'center' },
                justifyContent: 'center',
            }}
        >

            <Box
                sx={{
                    px: { xs: 3, sm: 4 },
                    pt: { xs: 2, sm: 3 },
                    pb: 2,
                    position: "relative",
                }}
            >
                <Chip
                    label="Qantera Public Testnet • Chain ID 974621"
                    size="small"
                    sx={{
                        mb: { xs: 2, sm: 3 },
                        bgcolor: "#0052FF1A",
                        color: "#165DFF",
                        fontWeight: 700,
                        fontSize: { xs: 11, sm: 12 },
                        borderRadius: "8px",
                        border: '1px solid #0052FF33',
                        fontFamily: 'var(--font-third)',
                    }}
                />

                <DialogTitle
                    sx={{
                        p: 0,
                        fontWeight: 400,
                        fontSize: {
                            xs: 28,
                            sm: 40,
                        },
                        lineHeight: 1.1,
                    }}
                >
                    Connect Wallet
                </DialogTitle>

                <Typography
                    sx={{
                        mt: 1.5,
                        color: "#666",
                        fontSize: { xs: 13, sm: 14 },
                        lineHeight: 1.6,
                    }}
                >
                    Choose a wallet to connect to the Qantera network.
                    <br />
                    Fully compatible with EVM-based extensions.
                </Typography>

                <IconButton
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 18,
                        top: { xs: 12, sm: 18 },
                    }}
                >
                    <CloseRoundedIcon />
                </IconButton>
            </Box>

            <DialogContent
                sx={{
                    px: {
                        xs: 3,
                        sm: 3,
                    },
                    pb: 3,
                    pt: 0,
                    overflowY: "auto",
                    maxHeight: { xs: "50vh", sm: "none" }
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                    }}
                >
                    {walletUI.map((wallet) => {
                        const connector = displayConnectors.find(
                            (item) => item.id === wallet.id
                        );

                        if (!connector) return null;

                        return (
                            <WalletItem
                                key={wallet.id}
                                icon={wallet.icon}
                                name={wallet.name}
                                description={wallet.description}
                                badge={wallet.badge}
                                disabled={isPending}
                                onConnect={() => {
                                    connect({
                                        connector,
                                    });

                                    onClose();
                                }}
                            />
                        );
                    })}
                </Box>
            </DialogContent>

            <Box
                sx={{
                    borderTop: "1px solid #ECECEC",
                    px: 4,
                    py: { xs: 2.5, sm: 3 },
                    textAlign: "center",
                    backgroundColor: '#F3F3F380',
                    pb: { xs: "calc(env(safe-area-inset-bottom) + 16px)", sm: 3 }
                }}
            >
                <Typography
                    sx={{
                        color: "#5E5E61",
                        fontSize: { xs: 13, sm: 14 },
                    }}
                >
                    Qantera will never request your seed phrase or private key.
                </Typography>

                <Typography
                    component="a"
                    href="#"
                    sx={{
                        mt: 1,
                        display: "inline-block",
                        color: "#003EC7",
                        fontWeight: 700,
                        fontSize: { xs: 13, sm: 14 },
                        textDecoration: "none",
                    }}
                >
                    Review Wallet Safety <OpenInNewIcon sx={{ fontSize: '12px !important' }} />
                </Typography>
            </Box>
        </Dialog>
    );
}