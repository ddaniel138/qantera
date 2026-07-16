export const FAUCET_API_BASE =
    process.env.NEXT_PUBLIC_FAUCET_API ?? "";

export const FAUCET_ENDPOINTS = {
    CONFIG: "/api/config",

    CLAIMS: "/v2/faucet/claims",

    PERSONAL: {
        PREPARE: "/v2/faucet/personal/prepare",
        CLAIM: "/v2/faucet/personal/claim",
        STATUS: "/v2/faucet/personal/status",
    },

    OKX: {
        PREPARE: "/v2/faucet/personal1/prepare",
        PREFETCH: "/v2/faucet/okx/prefetch",
        SETUP: "/v2/faucet/okx/setup",
        STATUS: "/v2/faucet/okx/status",
        SYNC: "/v2/faucet/okx/sync",
        TRADE: "/v2/faucet/okx/trade",
        DELEGATE_STATUS: "/v2/faucet/okx/delegate-status",
    },
} as const;

export const FAUCET_QUERY_KEYS = {
    CONFIG: ["faucet", "config"] as const,

    CLAIMS: ["faucet-claims"],

    PREFETCH: {
        OKX: (address: string) =>
            ["faucet", "prefetch", "okx", address] as const,
    },

    STATUS: {
        PERSONAL: (address: string) =>
            ["faucet", "status", "personal", address] as const,

        OKX: (address: string) =>
            ["faucet", "status", "okx", address] as const,
    },
} as const;

export const FAUCET_DEFAULT_LIMIT = 50;

export const FAUCET_MAX_LIMIT = 200;

export const FAUCET_POLLING_INTERVAL = 30_000;

export const FAUCET_CACHE = {
    CONFIG_STALE: Infinity,

    CONFIG_GC: Infinity,

    STATUS_STALE: 15_000,

    PREFETCH_STALE: 10 * 60 * 1000,
} as const;

export enum WalletType {
    UNKNOWN = "unknown",

    METAMASK = "metamask",

    OKX = "okx",

    RABBY = "rabby",

    COINBASE = "coinbase",

    BRAVE = "brave",

    WALLET_CONNECT = "walletconnect",
}

export enum WalletLane {
    OKX = "okx",

    PERSONAL = "personal",
}