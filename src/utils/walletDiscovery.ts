type WalletType =
    | "okx"
    | "metamask"
    | "rabby"
    | "coinbase"
    | "phantom"
    | "unknown";

export interface WalletProviderInfo {
    uuid: string;

    name: string;

    rdns: string;

    icon?: string;

    provider: any;

    walletType: WalletType;
}

const wallets = new Map<string, WalletProviderInfo>();

let initialized = false;

function detectWalletType(
    name: string,
    rdns: string
): WalletType {
    const value = `${name} ${rdns}`.toLowerCase();

    if (
        /okx|okex/.test(value)
    ) {
        return "okx";
    }

    if (
        /metamask|io\.metamask/.test(value)
    ) {
        return "metamask";
    }

    if (
        /rabby/.test(value)
    ) {
        return "rabby";
    }

    if (
        /coinbase/.test(value)
    ) {
        return "coinbase";
    }

    if (
        /phantom/.test(value)
    ) {
        return "phantom";
    }

    return "unknown";
}

function handleAnnounce(
    event: Event
) {
    const detail = (event as CustomEvent).detail;

    if (!detail) return;

    const info = detail.info;

    const provider = detail.provider;

    if (!info || !provider) {
        return;
    }

    wallets.set(info.uuid, {
        uuid: info.uuid,

        name: info.name,

        rdns: info.rdns,

        icon: info.icon,

        provider,

        walletType: detectWalletType(
            info.name,
            info.rdns
        ),
    });
}

export function bootstrapWalletDiscovery() {
    if (
        initialized ||
        typeof window === "undefined"
    ) {
        return;
    }

    initialized = true;

    window.addEventListener(
        "eip6963:announceProvider",
        handleAnnounce as EventListener
    );

    window.dispatchEvent(
        new Event(
            "eip6963:requestProvider"
        )
    );
}

export function getDiscoveredWallets() {
    return Array.from(wallets.values());
}

export function findWallet(
    walletType: WalletType
) {
    return getDiscoveredWallets().find(
        (wallet) =>
            wallet.walletType ===
            walletType
    );
}