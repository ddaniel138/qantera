import { emitFaucetHistoryUpdated } from "./faucetHistoryEvent";

export interface FaucetHistoryItem {
    txHash: string;
    amountWei: number;
    chainId: number;
    faucet: boolean;
    createdAt: any;
}

type Storage = Record<
    string,
    FaucetHistoryItem[]
>;

const STORAGE_KEY =
    "qantera_faucet_history";

const MAX_WALLETS = 5;
const MAX_TX = 7;

function readStorage(): Storage {
    if (typeof window === "undefined") {
        return {};
    }

    try {
        return JSON.parse(
            localStorage.getItem(STORAGE_KEY) ??
            "{}"
        );
    } catch {
        return {};
    }
}

function writeStorage(
    storage: Storage
) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(storage)
    );
}

export function saveFaucetHistory(
    // owner: string,
    // faucet: {
    //     txHash: string;
    //     amountWei: string;
    //     chainId: number;
    //     status: string;
    // }
    owner: `0x${string}`,
    txHash?: string,
    amountWei?: number,
    chainId?: number,
    faucet?: boolean,
) {

    const storage = readStorage();

    const list = storage[owner] ?? [];

    list.push({
        createdAt: Date.now(),
        txHash: txHash ?? "",
        amountWei: amountWei ?? 0,
        chainId: chainId ?? 974621,
        faucet: faucet ?? false,
    });

    if (
        list.length > MAX_TX
    ) {
        list.shift();
    }

    storage[owner] = list;

    const wallets =
        Object.entries(storage);

    if (
        wallets.length >
        MAX_WALLETS
    ) {
        wallets.sort(
            (a, b) =>
                b[1][
                    b[1].length - 1
                ].createdAt -
                a[1][
                    a[1].length - 1
                ].createdAt
        );

        while (
            wallets.length >
            MAX_WALLETS
        ) {
            wallets.pop();
        }

        writeStorage(
            Object.fromEntries(
                wallets
            )
        );
        emitFaucetHistoryUpdated();

        return;
    }

    writeStorage(storage);
    emitFaucetHistoryUpdated();
}

export function getFaucetHistory(
    owner: string
) {
    return (
        readStorage()[owner] ?? []
    ).sort(
        (a, b) =>
            b.createdAt -
            a.createdAt
    );
}