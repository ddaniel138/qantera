import { WalletClient } from "viem";

type WalletRpcMethod =
    | "eth_sign"
    | "personal_sign";

async function requestWallet<T>(
    walletClient: WalletClient,
    method: WalletRpcMethod,
    params: readonly unknown[]
): Promise<T> {
    return walletClient.transport.request({
        method,
        params,
    }) as Promise<T>;
}

export function personalSign(
    walletClient: WalletClient,
    message: string,
    address: `0x${string}`
) {
    return requestWallet<`0x${string}`>(
        walletClient,
        "personal_sign",
        [message, address]
    );
}

export function okxSign(
    walletClient: WalletClient,
    authHash: `0x${string}`,
    address: `0x${string}`
) {
    return requestWallet<`0x${string}`>(
        walletClient,
        "eth_sign",
        [address, authHash]
    );
}