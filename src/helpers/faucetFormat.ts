import { formatUnits } from "viem";

export function formatAmount(
    amountWei: string
) {
    return `${Number(
        formatUnits(BigInt(amountWei), 18)
    ).toFixed(2)}`;
}

export function formatDate1(
    timestamp: number
) {
    return new Intl.DateTimeFormat(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    ).format(new Date(timestamp));
}

export const formatDate = (value: string | number | Date) => {
    const date = new Date(value);

    return new Intl.DateTimeFormat(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    ).format(
        new Date(value)
    );
};

export function shortenHash(
    hash: string
) {
    if (!hash) return ""

    return `${hash?.slice(
        0,
        5
    )}...${hash?.slice(-4)}`;
}