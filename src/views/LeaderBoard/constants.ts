import { LEADERBOARD_PERIOD } from "@/constants/leaderboard";

export interface LeaderboardUser {
    rank: number;

    wallet_address: string | null;

    x_username: string | null;

    yap_points: number;

    streak_days: number;

    total_points: number;
}

// export const CURRENT_USER: LeaderboardUser = {
//     id: 999,
//     rank: 184,
//     contributor: "0x1a...4f2b",
//     yapSocial: 840,
//     streak: "3d",
//     totalPoints: 1280,
//     isCurrentUser: true,
// };

export interface LeaderboardResponse {
    items: LeaderboardUser[];
    currentUser: LeaderboardUser | null;
    page: number;
    limit: number;
    total: number;
    hasNextPage: boolean;
}


export const FILTER_OPTIONS = [
    "All Time",
    "Today",
    "This Week",
    "YAP",
] as const;

export type FilterOption = (typeof FILTER_OPTIONS)[number];

export const FILTER_PERIOD_MAP: Record<
    FilterOption,
    (typeof LEADERBOARD_PERIOD)[keyof typeof LEADERBOARD_PERIOD]
> = {
    "All Time": LEADERBOARD_PERIOD.ALL,
    "Today": LEADERBOARD_PERIOD.DAY,
    "This Week": LEADERBOARD_PERIOD.WEEK,
    YAP: LEADERBOARD_PERIOD.YAP,
};

// export const LEADERBOARD_DATA: LeaderboardUser[] = [
//     { id: 1, rank: 1, contributor: "0xA1...B8C4", yapSocial: 20000, streak: "42d", totalPoints: 52100, isApex: true },
//     { id: 2, rank: 2, contributor: "0x7F...9A21", yapSocial: 18500, streak: "24d", totalPoints: 45290 },
//     { id: 3, rank: 3, contributor: "0x3E...D199", yapSocial: 16200, streak: "18d", totalPoints: 41850 },

//     { id: 4, rank: 4, contributor: "0x99...F22A", yapSocial: 12400, streak: "14d", totalPoints: 40500 },
//     { id: 5, rank: 5, contributor: "0x2B...E811", yapSocial: 18200, streak: "8d", totalPoints: 39200 },
//     { id: 6, rank: 6, contributor: "0x4C...A339", yapSocial: 5100, streak: "21d", totalPoints: 37500 },
//     { id: 7, rank: 7, contributor: "0x8A...D442", yapSocial: 14800, streak: "11d", totalPoints: 36900 },
//     { id: 8, rank: 8, contributor: "0x3F...A11B", yapSocial: 11200, streak: "5d", totalPoints: 35000 },
//     { id: 9, rank: 9, contributor: "0x7A...C22D", yapSocial: 9800, streak: "12d", totalPoints: 34100 },
//     { id: 10, rank: 10, contributor: "0x1E...E33F", yapSocial: 15400, streak: "19d", totalPoints: 33200 },
//     { id: 11, rank: 11, contributor: "0x5B...F44A", yapSocial: 8900, streak: "4d", totalPoints: 31000 },
//     { id: 12, rank: 12, contributor: "0x9C...A55B", yapSocial: 13200, streak: "2d", totalPoints: 29800 },
//     { id: 13, rank: 13, contributor: "0x2D...B66C", yapSocial: 7100, streak: "25d", totalPoints: 28500 },
//     { id: 14, rank: 14, contributor: "0x6E...C77D", yapSocial: 14100, streak: "16d", totalPoints: 27200 },
//     { id: 15, rank: 15, contributor: "0x8F...D88E", yapSocial: 10500, streak: "9d", totalPoints: 26000 },

//     { id: 16, rank: 16, contributor: "0x91...A123", yapSocial: 9900, streak: "15d", totalPoints: 24800 },
//     { id: 17, rank: 17, contributor: "0x73...B333", yapSocial: 8700, streak: "8d", totalPoints: 23900 },
//     { id: 18, rank: 18, contributor: "0x45...CC12", yapSocial: 8100, streak: "7d", totalPoints: 23100 },
//     { id: 19, rank: 19, contributor: "0x67...DD91", yapSocial: 7600, streak: "5d", totalPoints: 22000 },
//     { id: 20, rank: 20, contributor: "0x88...EE10", yapSocial: 6900, streak: "3d", totalPoints: 21100 },
//     { id: 21, rank: 21, contributor: "0x19...AA22", yapSocial: 6400, streak: "2d", totalPoints: 20500 },
//     { id: 22, rank: 22, contributor: "0x39...BB55", yapSocial: 6200, streak: "1d", totalPoints: 20100 },
//     { id: 23, rank: 23, contributor: "0x1A...4F2B", yapSocial: 6100, streak: "3d", totalPoints: 19800 },
//     { id: 24, rank: 24, contributor: "0x2B...1111", yapSocial: 5800, streak: "0d", totalPoints: 19000 },
//     { id: 25, rank: 25, contributor: "0x3C...2222", yapSocial: 5500, streak: "1d", totalPoints: 18500 },
// ];

// export const getMockLeaderboard = (
//     page: number,
//     limit: number
// ): LeaderboardResponse => {
//     const start = (page - 1) * limit;
//     const end = start + limit;

//     return {
//         items: LEADERBOARD_DATA.slice(start, end),
//         currentUser: CURRENT_USER,
//         page,
//         limit,
//         total: LEADERBOARD_DATA.length,
//         hasNextPage: end < LEADERBOARD_DATA.length,
//     };
// };