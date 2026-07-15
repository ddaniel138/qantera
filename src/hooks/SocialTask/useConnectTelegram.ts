import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  SOCIAL_TASK_ENDPOINTS,
  SOCIAL_TASK_QUERY_KEYS,
} from "@/constants/socialTask"

import {
  ConnectTelegramBody,
  ConnectTelegramResponse,
} from "@/types/socialTask"

interface ConnectTelegramParams {
  wallet: string

  telegram: ConnectTelegramBody
}

const connectTelegram = async ({
  wallet,
  telegram,
}: ConnectTelegramParams): Promise<ConnectTelegramResponse> => {
  const res = await fetch(SOCIAL_TASK_ENDPOINTS.TELEGRAM.CONNECT, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",

      "X-Yap-Wallet": wallet,
    },

    body: JSON.stringify(telegram),
  })

  if (!res.ok) {
    throw new Error("Failed to connect Telegram.")
  }

  return res.json()
}

export default function useConnectTelegram() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: connectTelegram,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...SOCIAL_TASK_QUERY_KEYS.LIST, variables.wallet],
      })
    },
  })
}
