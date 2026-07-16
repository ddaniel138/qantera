"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@mui/material";

import { getClaimInfo } from "@/helpers/faucetClaim";

interface Props {
    loading: boolean;

    claimed: boolean;

    claimedAt?: string;

    claimAmount?: string | number;

    symbol: string;

    onClick: () => void;
}

export default function FaucetClaimButton({
    loading,
    claimed,
    claimedAt,
    claimAmount,
    symbol,
    onClick,
}: Props) {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        if (!claimed || !claimedAt) {
            return;
        }

        const timer = window.setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => clearInterval(timer);
    }, [claimed, claimedAt]);

    const claimInfo = useMemo(() => {
        return getClaimInfo(
            claimed,
            claimedAt,
            now
        );
    }, [claimed, claimedAt, now]);

    // console.log('claimInfo', claimInfo)

    const buttonText = useMemo(() => {
        if (loading) {
            return "Claiming...";
        }

        if (claimInfo.disabled) {
            return claimInfo.remainText;
        }

        return `Claim ${claimAmount} ${symbol}`;
    }, [
        loading,
        claimInfo.disabled,
        claimInfo.remainText,
        claimAmount,
        symbol,
    ]);

    return (
        <Button
            fullWidth
            variant="contained"
            onClick={onClick}
            disabled={loading || claimInfo.disabled}
            sx={{
                backgroundColor: "#003EC7",
                color: "#FFFFFF",
                fontWeight: 700,
                py: 1.8,
                borderRadius: "100px",
                textTransform: "none",
                boxShadow:
                    "0px 1px 2px 0px #0000000D",
                fontSize: "16px",

                "&:hover": {
                    backgroundColor: "#002da3",
                },

                "&.Mui-disabled": {
                    backgroundColor: "#DEE1E6",
                    color: "#7C828A",
                },
            }}
        >
            {buttonText}
        </Button>
    );
}