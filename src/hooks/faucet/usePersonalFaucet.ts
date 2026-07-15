import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount, useWalletClient } from "wagmi";

import {
    FAUCET_QUERY_KEYS,
} from "@/constants/faucet";

import { FaucetService } from "@/services/faucet";

import { personalSign } from "@/utils/sign";
import { switchNetwork } from "@/utils/network";

import { useFaucetConfig } from "./useFaucetConfig";
import { saveFaucetHistory } from "@/helpers";
import { qantera } from "@/chains";

export function usePersonalFaucet() {
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

            const prepare =
                await FaucetService.preparePersonal(address);

            const signature =
                await personalSign(
                    walletClient,
                    prepare.message,
                    address
                );

            const result =
                await FaucetService.claimPersonal({
                    owner: address,
                    message: prepare.message,
                    signature,
                });

            saveFaucetHistory(
                address, 
                result.txHash,
                1,
                qantera.id,
                result.faucet,

            );

            return result;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey:
                    FAUCET_QUERY_KEYS.STATUS.PERSONAL(
                        address ?? ""
                    ),
            });
        },
    });
}