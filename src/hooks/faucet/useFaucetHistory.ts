import { useEffect, useState } from "react";

import {
    getFaucetHistory,
} from "@/helpers/faucetHistory";

import {
    subscribeFaucetHistory,
} from "@/helpers/faucetHistoryEvent";

export function useFaucetHistory(
    address?: string
) {
    const [history, setHistory] = useState(
        () =>
            address
                ? getFaucetHistory(address)
                : []
    );

    useEffect(() => {
        if (!address) {
            setHistory([]);
            return;
        }

        const reload = () => {
            setHistory(
                getFaucetHistory(address)
            );
        };

        reload();

        return subscribeFaucetHistory(
            reload
        );
    }, [address]);

    return history;
}