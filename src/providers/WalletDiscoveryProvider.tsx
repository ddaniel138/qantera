import { useEffect } from "react";

import {
    bootstrapWalletDiscovery,
} from "@/utils/walletDiscovery";

export default function WalletDiscoveryProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        bootstrapWalletDiscovery();
    }, []);

    return children;
}