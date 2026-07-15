export const getTimeUntilMidnight = (): number => {
    const now = new Date();
    const midnight = new Date();

    midnight.setDate(now.getDate() + 1);
    midnight.setHours(0, 0, 0, 0);

    return midnight.getTime() - now.getTime();
};


export const formatDuration = (ms: number, includeSeconds = true): string => {
    if (ms <= 0) return includeSeconds ? "00h 00m 00s" : "00h 00m";

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => String(num).padStart(2, '0');

    if (includeSeconds) {
        return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    }
    return `${pad(hours)}h ${pad(minutes)}m`;
};