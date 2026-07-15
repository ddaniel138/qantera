export interface FaucetConfig {
    faucetChainId: number;

    faucet: {
        chainId: number;
        okx7702Wei: string;
        personalSignWei: string;
        fallbackWei: string;
    };

    walletChain: {
        chainId: number;
        name: string;

        nativeCurrency: {
            name: string;
            symbol: string;
            decimals: number;
        };

        rpcUrls: string[];
    };

    trade: {
        authChainId: number;
        tradeModuleAddress: `0x${string}`;
        chains: number[];
    };

    chainPullConfig: Record<
        number,
        {
            relay: `0x${string}`;
            recipient: `0x${string}`;
        }
    >;
}

export interface PersonalPrepareResponse {
    chainId: number;
    amountWei: string;

    message: string;

    signMethod: "personal_sign";

    params: [string, `0x${string}`];
}

export interface OkxPrepareResponse {
    authHash: `0x${string}`;

    authNonce: number;

    richestChainId: number;

    authChainId: number;

    chainId: number;

    amountWei: string;

    delegateChains: number[];

    note: string;
}

export interface PersonalClaimRequest {
    owner: `0x${string}`;

    message: string;

    signature: `0x${string}`;
}

export interface OkxSetupRequest {
    owner: `0x${string}`;

    signature: `0x${string}`;

    walletLane: "okx";
}

export interface FaucetClaim {
    owner: `0x${string}`;

    lane?: string;

    chainId: number;

    amountWei: string;

    txHash: `0x${string}`;

    status: string;

    claimedAt: string;
}

export interface FaucetStatus {
    claimed: boolean;

    chainId: number;

    amountWei: string;

    claimAt: string;

    claim?: FaucetClaim;
}

export interface OkxStatusResponse {
    action?: string;
    claimed: boolean;
    chainId: number;
    amountWei: string;
    claim?: FaucetClaim;
    claimAt?: string;
}

// export interface OkxSetupResponse {
//     action: string;
//     status: string;
//     faucet: {
//         status: string;
//         chainId: number;
//         amountWei: string;
//         txHash: string;
//     };
// }

export interface OkxSetupResponse {
    faucet?: boolean;
    chainId?: number;
    amountWei?: string;
    txHash?: string;
}


export interface FaucetResponse {
    success?: boolean;

    message?: string;

    txHash?: `0x${string}`;
}

export interface PersonalClaimResponse {
    faucet?: boolean;
    chainId?: number;
    amountWei?: string;
    txHash?: string;
}