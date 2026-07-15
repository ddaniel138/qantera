import { Address, Hex } from "viem";

export interface MintChecklistItem {
    key:
        | "wallet_connected"
        | "faucet_claimed"
        | "social_tasks_complete"
        | "min_yap_points";

    label: string;

    met: boolean;
}

export interface MintEligibilityResponse {
    eligible: boolean;

    already_minted: boolean;

    mint_record: MintRecord | null;

    requirements: MintRequirements;

    nft: MintNFTInfo;
}

export interface MintAuthorizationResponse
    extends MintEligibilityResponse {
    authorization: MintAuthorization;
}

export interface MintAuthorization {
    wallet: Address;

    deadline: number;

    signature: Hex;

    contract: Address;
}

export interface MintRequirements {
    wallet_connected: {
        wallet: Address;

        met: boolean;
    };

    faucet_claimed: {
        claimed: boolean;

        met: boolean;

        error: string | null;

        claim: FaucetClaim | null;
    };

    social_tasks_complete: {
        completed: number;

        total: number;

        met: boolean;
    };

    min_yap_points: {
        current: number;

        required: number;

        met: boolean;
    };
}

export interface FaucetClaim {
    owner: Address;

    chainId: number;

    amountWei: string;

    txHash: Hex;

    status: string;

    [key: string]: unknown;
}

export interface MintNFTInfo {
    contract: Address;

    chain_id: number;

    mint_enabled: boolean;

    signer_configured: boolean;

    unlimited_supply: boolean;

    image_url: string;

    metadata_base_url: string;

    explorer_token_url: string;

    collection: MintCollectionInfo;

    mint: MintContractInfo;
}

export interface MintCollectionInfo {
    name: string;

    symbol: string;

    description: string;

    base_uri: string;

    authorized_signer: Address;

    total_minted: string;
}

export interface MintContractInfo {
    method: "user_wallet";

    gas_payer: "user";

    contract: Address;

    chain_id: number;

    function: "mintWithAuthorization";

    abi: string[];

    calldata: Hex;

    args: [Address, number, Hex];

    authorization: {
        wallet: Address;

        deadline: number;

        signature: Hex;

        expires_in_sec: number;
    };
}

export interface MintRecord {
    tx_hash: Hex;

    token_id: string;

    minted_at: string;
}

export interface ConfirmMintBody {
    tx_hash: Hex;
}

export interface ConfirmMintResponse {
    success: boolean;
}