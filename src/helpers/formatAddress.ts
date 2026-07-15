export const formatAddress = (
    address: string | null | undefined,
    startChars: number = 5,
    endChars: number = 4
): string => {
    if (!address) return '';

    if (address.length <= startChars + endChars) {
        return address;
    }

    const start = address.substring(0, startChars);
    const end = address.substring(address.length - endChars);

    return `${start}...${end}`;
};