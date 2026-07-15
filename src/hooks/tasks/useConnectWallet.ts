import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAccount } from "wagmi"

import { TASK_API, TASK_QUERY_KEY } from "@/constants/tasks"

interface ConnectWalletResponse {
  account_exists: boolean
  address: string
}

interface ConnectWalletPayload {
  address: string
  ref?: string
}

async function connectWallet(
  payload: ConnectWalletPayload,
): Promise<ConnectWalletResponse> {
  const response = await fetch(
    `${TASK_API.BASE_URL}${TASK_API.CONNECT_WALLET}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  )

  const data = (await response.json()) as ConnectWalletResponse

  if (!response.ok) {
    throw new Error("Connect wallet failed.")
  }

  return data
}

interface UseConnectWalletProps {
  refCode?: string
}

export function useConnectWallet({ refCode }: UseConnectWalletProps = {}) {
  const queryClient = useQueryClient()

  const { address } = useAccount()

  return useMutation({
    mutationFn: async () => {
      if (!address) {
        throw new Error("Wallet not connected.")
      }

      const data = await connectWallet({
        address,
        ...(refCode ? { ref: refCode } : {}),
      })

      if (!data.account_exists) {
        // window.location.href =
        //     `${TASK_API.BASE_URL}${TASK_API.LOGIN_X}`;
        window.open(
          `${TASK_API.BASE_URL}${TASK_API.LOGIN_X}`,
          "_blank",
          "noopener,noreferrer",
        )

        const handleFocus = () => {
          void queryClient.invalidateQueries({
            queryKey: TASK_QUERY_KEY.ME(address),
          })
          window.removeEventListener("focus", handleFocus)
        }

        window.addEventListener("focus", handleFocus)

        return data
      }

      await queryClient.invalidateQueries({
        queryKey: TASK_QUERY_KEY.ME(address),
      })

      return data
    },
  })
}
