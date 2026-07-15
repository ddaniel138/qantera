export interface FaucetClaimInfo {
    claimed: boolean;
    claimedAt?: number | string; 
    disabled: boolean;
    remainMs: number;
    remainText: string;
}

export function formatCountdown(ms: number) {
    const remain = Math.max(0, ms);

    const hour = Math.floor(remain / 3_600_000);
    const minute = Math.floor((remain % 3_600_000) / 60_000);
    const second = Math.floor((remain % 60_000) / 1_000);

    return [hour, minute, second]
        .map((value) => String(value).padStart(2, "0"))
        .join(":");
}

export function getClaimInfo(
    claimed: boolean,
    claimedAt?: number | string,
    now: number = Date.now()
): FaucetClaimInfo {
    if (!claimed || !claimedAt) {
        return {
            claimed: false,
            claimedAt: undefined,
            disabled: false,
            remainMs: 0,
            remainText: "00:00:00",
        };
    }

    const claimedTimestamp = typeof claimedAt === "string" && isNaN(Number(claimedAt))
        ? new Date(claimedAt).getTime() 
        : Number(claimedAt);

    if (isNaN(claimedTimestamp)) {
        return {
            claimed,
            claimedAt,
            disabled: false,
            remainMs: 0,
            remainText: "00:00:00",
        };
    }

    const FIVE_MINUTES = 300_000; 
    
    const resetTime = claimedTimestamp + FIVE_MINUTES;

    const remainMs = Math.max(0, resetTime - now);

    return {
        claimed,
        claimedAt,
        disabled: remainMs > 0,
        remainMs,
        remainText: formatCountdown(remainMs),
    };
}