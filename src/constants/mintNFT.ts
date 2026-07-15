const API_BASE_URL = "https://yap.qantera.network"
const ANOTHER_BASE_URL = "https://explorer.qantera.network"

export const MINT_NFT_POLLING_INTERVAL = 10_000;

export const MINT_NFT_QUERY_KEYS = {
    ELIGIBILITY: ["mint-nft", "eligibility"],
} as const;

export const MINT_NFT_ENDPOINTS = {
    ELIGIBILITY: `${API_BASE_URL}/api/nft/mint-eligibility`,

    AUTHORIZATION: `${API_BASE_URL}/api/nft/mint/authorization`,

    CONFIRM: `${API_BASE_URL}/api/nft/mint/confirm`,

    TOTAL_MINTED: (contract: string) =>`${ANOTHER_BASE_URL}/api/v2/tokens/${contract}`,
} as const;

export const MINT_CHECK_KEYS = {
    WALLET_CONNECTED: "wallet_connected",

    FAUCET_CLAIMED: "faucet_claimed",

    SOCIAL_TASKS_COMPLETE: "social_tasks_complete",

    MIN_YAP_POINTS: "min_yap_points",
} as const;