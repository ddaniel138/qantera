import { ChecklistItem, AttributeItem, NFTStats } from './types';

export const MOCK_NFT_STATS: NFTStats = {
    supply: { current: 8421, total: 10000 },
    price: 'Free',
    limit: '1 Per Wallet'
};

export const MOCK_CHECKLIST: ChecklistItem[] = [
    {
        key: "wallet_connected",
        label: "Wallet Connected",
        met: false,
    },
    {
        key: "faucet_claimed",
        label: "Claimed Faucet",
        met: false,
    },
    {
        key: "min_yap_points",
        label: "Minimum 1000 QP Yap",
        met: false,
    },
    {
        key: "social_tasks_complete",
        label: "Completed Social Tasks",
        met: false,
    },
];

export const MOCK_ATTRIBUTES: AttributeItem[] = [
    { trait: 'Era', value: 'Pre-Qantera' },
    { trait: 'Network', value: 'Testnet Alpha' },
    { trait: 'Contributor', value: 'Early Adopter' },
    { trait: 'Security Class', value: 'Grade 1' },
    { trait: 'Mint Number', value: 'TBD' },
];