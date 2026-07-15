import { Chain } from '@rainbow-me/rainbowkit';

export const qantera = {
    id: 974621,
    name: 'Qantera',
    iconUrl: '/logo-2.png',
    iconBackground: '#fff',
    nativeCurrency: { name: 'QTER', symbol: 'QTER', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://rpc1.qantera.network'] },
    },
    blockExplorers: {
        default: { name: 'Qantera', url: 'https://explorer.qantera.network/' },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 0,
        },
    },
} as const satisfies Chain;