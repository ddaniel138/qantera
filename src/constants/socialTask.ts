export const SOCIAL_TASK_API_BASE_URL = "https://yap.qantera.network"

export const TELEGRAM_CONFIG = {
  BOT_USERNAME: process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME!,
} as const

export const SOCIAL_TASK_QUERY_KEYS = {
  ALL: ["social-task"] as const,

  LIST: ["social-task", "list"] as const,

  OVERVIEW: ["social-task", "overview"] as const,
}

export const SOCIAL_TASK_STATUS = {
  AVAILABLE: "available",

  VERIFIED: "verified",
} as const

export const SOCIAL_TASK_KEYS = {
  FOLLOW_X: "follow_x",

  LIKE_POST: "like_post",

  RETWEET_POST: "retweet_post",

  REPOST_POST: "repost_post",

  TELEGRAM_GROUP: "telegram_join_group",

  TELEGRAM_CHANNEL: "telegram_join_channel",
} as const

export const SOCIAL_X_TASK_KEYS = [
  SOCIAL_TASK_KEYS.FOLLOW_X,
  SOCIAL_TASK_KEYS.LIKE_POST,
  SOCIAL_TASK_KEYS.RETWEET_POST,
  SOCIAL_TASK_KEYS.REPOST_POST,
] as const

export const SOCIAL_TELEGRAM_TASK_KEYS = [
  SOCIAL_TASK_KEYS.TELEGRAM_GROUP,
  SOCIAL_TASK_KEYS.TELEGRAM_CHANNEL,
] as const

export const SOCIAL_TASK_ENDPOINTS = {
  TASKS: {
    LIST: `${SOCIAL_TASK_API_BASE_URL}/api/social/tasks`,

    VERIFY: (taskKey: string) =>
      `${SOCIAL_TASK_API_BASE_URL}/api/social/tasks/${taskKey}/verify`,

    CLAIM_BONUS: `${SOCIAL_TASK_API_BASE_URL}/api/social/claim-all-bonus`,
  },

  TELEGRAM: {
    CONNECT: `${SOCIAL_TASK_API_BASE_URL}/api/auth/telegram/connect`,
  },
} as const

export const SOCIAL_LINKS = {
  X: "https://x.com/Qantera_network",

  TELEGRAM_GROUP: "https://t.me/qantera_network",

  TELEGRAM_CHANNEL: "https://t.me/Qantera_Channel",
} as const

export const SOCIAL_TASK_POLLING = {
  REFETCH_INTERVAL: 10 * 1000,

  STALE_TIME: 30 * 1000,
} as const
