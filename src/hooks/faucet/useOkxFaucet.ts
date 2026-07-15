import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount, useWalletClient } from "wagmi";

import {
    FAUCET_QUERY_KEYS,
    WalletLane,
} from "@/constants/faucet";

import { FaucetService } from "@/services/faucet";

import { okxSign } from "@/utils/sign";
import { switchNetwork } from "@/utils/network";
import { saveFaucetHistory } from "@/helpers";
import { qantera } from "@/chains";


export function useOkxFaucet() {
    const queryClient = useQueryClient();

    const { address } = useAccount();

    const { data: walletClient } = useWalletClient();

    return useMutation({
        mutationFn: async () => {
            if (!address) {
                throw new Error("Wallet not connected.");
            }

            if (!walletClient) {
                throw new Error("Wallet client unavailable.");
            }
            const prepare = await FaucetService.prepareOkx(address);
            const signature = await okxSign(
                    walletClient,
                    prepare.authHash,
                    address
                );
            
            const setupResult = await FaucetService.setupOkx({
                    owner: address,
                    signature,
                    walletLane: WalletLane.OKX,
                });

            if (setupResult) {
                // saveFaucetHistory(address, {
                //     faucet: setupResult.faucet,
                //     txHash: setupResult.txHash,
                //     amountWei: setupResult.faucet.amountWei,
                //     chainId: qantera.id,
                // });
                saveFaucetHistory(
                    address,
                    setupResult.txHash,
                    3,
                    qantera.id,
                    setupResult.faucet,
                )
            }

            console.groupEnd();

            return setupResult;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey:
                    FAUCET_QUERY_KEYS.STATUS.OKX(
                        address ?? ""
                    ),
            });
        },
    });
}