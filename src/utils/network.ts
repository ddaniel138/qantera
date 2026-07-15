import { WalletClient } from "viem";

export interface WalletChainConfig {
    chainId: number;

    name: string;

    rpcUrls: string[];

    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
}

export async function switchNetwork(
    walletClient: WalletClient,
    chain: WalletChainConfig
) {
    const hexChainId = `0x${chain.chainId.toString(16)}`;

    try {
        await walletClient.transport.request({
            method: "wallet_switchEthereumChain",
            params: [
                {
                    chainId: hexChainId,
                },
            ],
        });

        return;
    } catch (error: any) {
        if (error?.code !== 4902) {
            throw error;
        }
    }

    await walletClient.transport.request({
        method: "wallet_addEthereumChain",
        params: [
            {
                chainId: hexChainId,

                chainName: chain.name,

                rpcUrls: chain.rpcUrls,

                nativeCurrency: chain.nativeCurrency,
            },
        ],
    });
}