import React, { useRef } from "react";
import {
    Box,
    Typography,
    CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useVirtualizer } from "@tanstack/react-virtual";

import { Cell, HeaderRow } from "../styles";
import LeaderboardItem from "./LeaderboardRow";

const ROW_HEIGHT = 54;

const columns = [
    "Rank",
    "Contributor",
    "Yap (Social)",
    "Streak",
    "Total Points",
];

const StyledContainer = styled(Box)({
    border: "1px solid #DEE1E6",
    borderRadius: 12,
    background: "#FFF",
    overflow: "hidden",
});

interface LeaderboardTableProps {
    listData: any[];
    hasMore?: boolean;
    isLoading?: boolean;
    onLoadMore?: () => void;
}

export const LeaderboardTable = ({
    listData,
    hasMore,
    isLoading,
    onLoadMore,
}: LeaderboardTableProps) => {
    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: listData.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => ROW_HEIGHT,
        overscan: 5,
    });

    const virtualItems = rowVirtualizer.getVirtualItems();

    // useEffect(() => {
    //     const parent = parentRef.current;

    //     if (!parent) return;

    //     const handleScroll = () => {
    //         if (isLoading || !hasMore) return;

    //         const distance =
    //             parent.scrollHeight -
    //             parent.scrollTop -
    //             parent.clientHeight;

    //         if (distance < 120) {

    //             onLoadMore();
    //         }
    //     };

    //     parent.addEventListener("scroll", handleScroll);

    //     return () => {
    //         parent.removeEventListener("scroll", handleScroll);
    //     };
    // }, [hasMore, isLoading, onLoadMore]);
    return (
        <Box sx={{ width: "100%" }}>
            <StyledContainer>
                <Box
                    sx={{
                        overflowX: "auto",
                    }}
                >
                    <Box
                        ref={parentRef}
                        sx={{
                            minWidth: 900,
                            height: 500,
                            overflowY: "auto",
                            overflowX: "hidden",
                        }}
                    >
                        <HeaderRow>
                            {columns.map((column, index) => (
                                <Cell
                                    key={column}
                                    sx={{
                                        justifyContent:
                                            index >= 2
                                                ? "flex-end"
                                                : "flex-start",
                                        fontWeight: 600,
                                        color: "#5E5E61",
                                        fontSize: 12,
                                    }}
                                >
                                    {column}
                                </Cell>
                            ))}
                        </HeaderRow>

                        {listData.length === 0 ? (
                            <Box
                                sx={{
                                    height: 250,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: "#6B7280",
                                        fontSize: 14,
                                        fontWeight: 500,
                                    }}
                                >
                                    No data available
                                </Typography>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    position: "relative",

                                }}
                            >
                                {virtualItems.map((virtualRow) => {
                                    const row = listData[virtualRow.index];
                                    if (!row) return null;
                                    return (
                                        <LeaderboardItem
                                            key={row.id}
                                            row={row}
                                            sx={{
                                                transform: `translateY(${virtualRow.start}px)`,
                                            }}
                                        />
                                    );
                                })}
                            </Box>
                        )}
                    </Box>
                </Box>
            </StyledContainer>

            {isLoading && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        py: 2,
                    }}
                >
                    <CircularProgress
                        size={24}
                        sx={{
                            color: "#003EC7",
                        }}
                    />
                </Box>
            )}
        </Box>
    );
};