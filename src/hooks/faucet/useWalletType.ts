import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";

import { WalletType } from "@/constants/faucet";
import {
    bootstrapWalletDiscovery,
    getDiscoveredWallets,
} from "@/utils/walletDiscovery";

export function useWalletType() {
    const { connector } = useAccount();

    const [walletType, setWalletType] = useState<WalletType>(
        WalletType.UNKNOWN
    );

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        bootstrapWalletDiscovery();

        const detectWallet = () => {
            const wallets = getDiscoveredWallets();

            if (wallets.length > 0) {
                if (connector) {
                    const connectorName =
                        connector.name.toLowerCase();

                    const matched = wallets.find((wallet) => {
                        const value =
                            `${wallet.name} ${wallet.rdns}`.toLowerCase();

                        return value.includes(connectorName);
                    });

                    if (matched) {
                        switch (matched.walletType) {
                            case "okx":
                                return WalletType.OKX;

                            case "metamask":
                                return WalletType.METAMASK;

                            case "rabby":
                                return WalletType.RABBY;

                            case "coinbase":
                                return WalletType.COINBASE;

                            default:
                                break;
                        }
                    }
                }

                const okx = wallets.find(
                    (wallet) => wallet.walletType === "okx"
                );

                if (okx) {
                    return WalletType.OKX;
                }

                const metamask = wallets.find(
                    (wallet) =>
                        wallet.walletType === "metamask"
                );

                if (metamask) {
                    return WalletType.METAMASK;
                }

                const rabby = wallets.find(
                    (wallet) =>
                        wallet.walletType === "rabby"
                );

                if (rabby) {
                    return WalletType.RABBY;
                }

                const coinbase = wallets.find(
                    (wallet) =>
                        wallet.walletType === "coinbase"
                );

                if (coinbase) {
                    return WalletType.COINBASE;
                }
            }

            if (connector) {
                const id = connector.id.toLowerCase();
                const name = connector.name.toLowerCase();

                if (
                    id.includes("okx") ||
                    name.includes("okx")
                ) {
                    return WalletType.OKX;
                }

                if (
                    id.includes("rabby") ||
                    name.includes("rabby")
                ) {
                    return WalletType.RABBY;
                }

                if (
                    id.includes("coinbase") ||
                    name.includes("coinbase")
                ) {
                    return WalletType.COINBASE;
                }

                if (
                    id.includes("metamask") ||
                    name.includes("metamask")
                ) {
                    return WalletType.METAMASK;
                }

                if (
                    id.includes("walletconnect")
                ) {
                    return WalletType.WALLET_CONNECT;
                }
            }

            const ethereum = window.ethereum;

            if (ethereum?.providers?.length) {
                for (const provider of ethereum.providers) {
                    if (provider.isOkxWallet) {
                        return WalletType.OKX;
                    }

                    if (provider.isRabby) {
                        return WalletType.RABBY;
                    }

                    if (provider.isCoinbaseWallet) {
                        return WalletType.COINBASE;
                    }

                    if (provider.isMetaMask) {
                        return WalletType.METAMASK;
                    }
                }
            }

            if (ethereum?.isOkxWallet) {
                return WalletType.OKX;
            }

            if (ethereum?.isRabby) {
                return WalletType.RABBY;
            }

            if (ethereum?.isCoinbaseWallet) {
                return WalletType.COINBASE;
            }

            if (ethereum?.isMetaMask) {
                return WalletType.METAMASK;
            }

            return WalletType.UNKNOWN;
        };

        setWalletType(detectWallet());

        const listener = () => {
            setWalletType(detectWallet());
        };

        window.addEventListener(
            "eip6963:announceProvider",
            listener
        );

        return () => {
            window.removeEventListener(
                "eip6963:announceProvider",
                listener
            );
        };
    }, [connector]);

    return useMemo(
        () => walletType,
        [walletType]
    );
}