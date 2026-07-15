export async function copyReferralLink(
    link: string
) {
    await navigator.clipboard.writeText(link);
}

export function shareOnX(link: string) {
    const text = encodeURIComponent(
        `Join Qantera Yap to Earn! Use my referral link: ${link}`
    );

    window.open(
        `https://twitter.com/intent/tweet?text=${text}`,
        "_blank"
    );
}