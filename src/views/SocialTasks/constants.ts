import { SOCIAL_LINKS, SOCIAL_TELEGRAM_TASK_KEYS } from "@/constants/socialTask"

export type SocialTaskKey =
  | "follow_x"
  | "retweet_post"
  | "repost_post"
  | "like_post"
  | "telegram_join_group"
  | "telegram_join_channel"

// TODO: add links for each task
export const SOCIAL_TASK_LINKS: Partial<Record<SocialTaskKey, string>> = {
  follow_x: SOCIAL_LINKS.X,

  telegram_join_group: SOCIAL_LINKS.TELEGRAM_GROUP,

  telegram_join_channel: SOCIAL_LINKS.TELEGRAM_CHANNEL,

  retweet_post: "",

  repost_post: "",

  like_post: "",
}

export const SOCIAL_TASK_DESCRIPTIONS: Record<SocialTaskKey, string> = {
  follow_x:
    "Be the first to hear about network upgrades and partnership announcements.",
  retweet_post:
    "Spread the word to your network and help secure the Qantera ecosystem.",
  repost_post:
    "Spread the word to your network and help secure the Qantera ecosystem.",
  like_post:
    "Excited to unveil Qantera Testnet! The future of institutional blockchain is here. Join our community and begin...",
  telegram_join_group:
    "Discuss development, share feedback, and collaborate with other Qantera engineers.",
  telegram_join_channel:
    "Official broadcast channel for technical documentation and security patches.",
}

export const TABS_OPTIONS = [
  "All Tasks",
  "X Tasks",
  "Telegram Tasks",
  "Completed",
]

const TELEGRAM_JOIN_DELAY_MS = 1200
const TELEGRAM_VERIFY_DELAY_MS = 5000

export { TELEGRAM_JOIN_DELAY_MS, TELEGRAM_VERIFY_DELAY_MS }

/** Gate Verify by API `target` (not SOCIAL_TASK_LINKS). Telegram soft-verify always allowed. */
export function canVerifySocialTask(task: {
  key: SocialTaskKey
  target?: {
    username?: string | null
    tweet_url?: string | null
  } | null
}): boolean {
  if (
    SOCIAL_TELEGRAM_TASK_KEYS.includes(
      task.key as (typeof SOCIAL_TELEGRAM_TASK_KEYS)[number],
    )
  ) {
    return true
  }

  if (task.key === "follow_x") {
    return !!task.target?.username
  }

  return !!task.target?.tweet_url
}
