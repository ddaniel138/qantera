import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box } from "@mui/material";

import { LeaderboardHeader } from "./components/LeaderboardHeader";
import { LeaderboardTable } from "./components/LeaderboardTable";
import { TopPodium } from "./components/TopPodium";
import { UserStickyBar } from "./components/UserStickyBar";

import {
    FILTER_OPTIONS,
    FILTER_PERIOD_MAP,
    type FilterOption,
} from "./constants";

import { useAccount } from "wagmi";
import useLeaderboard from "@/hooks/leaderboard/useLeaderboard";

// const LIMIT = 15;

export default function LeaderBoardView() {
    // const [activeFilter, setActiveFilter] = useState("All Time");
    // const [page, setPage] = useState(1);
    // const [topThree, setTopThree] = useState<LeaderboardUser[]>([]);
    // const [tableData, setTableData] = useState<LeaderboardUser[]>([]);
    // const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null);
    // const [hasMore, setHasMore] = useState(true);
    // const [isLoading, setIsLoading] = useState(false);
    // const loadingRef = useRef(false);
    // const loadPage = useCallback(async (pageNumber: number) => {
    //     if (loadingRef.current) return;
    //     loadingRef.current = true;
    //     setIsLoading(true);
    //     try {
    //         const res = getMockLeaderboard(pageNumber, LIMIT);
    //         if (pageNumber === 1) {
    //             setCurrentUser(res.currentUser);
    //             setTopThree(res.items.slice(0, 3));
    //             setTableData(res.items.slice(3));
    //         } else {
    //             setTableData(prev => [...prev, ...res.items]);
    //         }
    //         if (pageNumber === 1) {
    //             setTopThree(res.items.slice(0, 3));
    //             setTableData(res.items.slice(3));
    //         } else {
    //             setTableData(prev => [...prev, ...res.items]);
    //         }
    //         setHasMore(res.hasNextPage);
    //     } finally {
    //         console.groupEnd();
    //         loadingRef.current = false;
    //         setIsLoading(false);
    //     }
    // }, []);

    // useEffect(() => {
    //     loadPage(1);
    // }, [loadPage]);

    // const handleLoadMore = useCallback(async () => {
    //     if (loadingRef.current) return;
    //     if (!hasMore) return;
    //     const nextPage = page + 1;
    //     setPage(nextPage);
    //     await loadPage(nextPage);
    // }, [page, hasMore, loadPage]);

    const { address } = useAccount();

    const [activeFilter, setActiveFilter] = useState<FilterOption>("All Time");
    
    const period = useMemo(() => {
        return FILTER_PERIOD_MAP[activeFilter];
    }, [activeFilter]);

    const {
        data,
        isLoading,
        refetch,
    } = useLeaderboard({
        period,
        wallet: address,
    });

    const topThree = useMemo(() => {
        return data?.items.slice(0, 3) ?? [];
    }, [data]);
    
    const tableData = useMemo(() => {
        // return data?.items.slice(0) ?? [];
        return data?.items.slice(3) ?? [];
    }, [data]);
    
    const currentUser = useMemo(() => {
        return data?.me ?? null;
    }, [data]);

    return (
        <Box
            sx={{
                py: 4,
                px: 2,
                maxWidth: 1440,
                mx: "auto",
                background: "#F7F7F7",
                minHeight: "100vh",
            }}
        >
            <LeaderboardHeader
                options={FILTER_OPTIONS}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
            />

            <TopPodium topThree={topThree} />

            <LeaderboardTable
                listData={tableData}
                // hasMore={hasMore}
                // isLoading={isLoading}
                // onLoadMore={handleLoadMore}
            />

            <UserStickyBar currentUser={currentUser}/>
        </Box>
    );
}