import {
    Chip,
    Link,
    Paper,
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { RECENT_CLAIMS } from "../constants";
import FaucetStatusChip from "./FaucetStatusChip";
import { shortenHash } from "@/helpers";
import { useEffect, useRef } from "react";

interface RecentClaimItem {
    amount: string;
    faucet: boolean;
    date: string;
    tx: string;
}

interface Props {
    data: RecentClaimItem[];
    hasMore: boolean;
    loading: boolean;
    onLoadMore: () => void;
}
export default function RecentClaimsTable({
    data,
    hasMore,
    loading,
    onLoadMore,
}: Props) {

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;

        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;

            const reachedBottom = scrollTop + clientHeight >= scrollHeight - 100;

            if (reachedBottom && hasMore && !loading) {
                onLoadMore();
            }
        };

        container.addEventListener("scroll", handleScroll);

        return () => container.removeEventListener("scroll", handleScroll);
    }, [hasMore, loading, onLoadMore]);

    return (
        <>
            <Stack sx={{ width: "100%" }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        mb: { xs: 2, md: 3 },
                        color: "#000000",
                        fontSize: "16px",
                        textAlign: "flex-start",
                    }}
                >
                    Recent Claims
                </Typography>
            </Stack>

            <TableContainer
                ref={containerRef}
                component={Paper}
                elevation={0}
                sx={{
                    borderRadius: "24px",
                    border: "1px solid #DEE1E6",
                    width: "100%",
                    backgroundColor: "#FFFFFF",

                    maxHeight: 300,
                    overflowY: "auto",

                    overflowX: "auto",

                    "&::-webkit-scrollbar": {
                        width: "4px",
                        height: "4px",
                    },

                    "&::-webkit-scrollbar-track": {
                        background: "transparent",
                        margin: "15px 0",
                    },

                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#D3D8DF",
                        borderRadius: "999px",
                        minHeight: "40px",
                        transition: "background-color .2s ease",

                        "&:hover": {
                            backgroundColor: "#B9C0C8",
                        },
                    },

                    "&::-webkit-scrollbar-corner": {
                        background: "transparent",
                    },
                }}
            >
                <Table sx={{ minWidth: { xs: 500, sm: "100%" } }}>
                    <TableHead sx={{ backgroundColor: "#FFFFFF" }}>
                        <TableRow>
                            <TableCell
                                sx={{
                                    color: "#7C828A",
                                    fontWeight: 600,
                                    fontSize: "12px",
                                    py: 2,
                                }}
                            >
                                AMOUNT
                            </TableCell>

                            <TableCell
                                sx={{
                                    color: "#7C828A",
                                    fontWeight: 600,
                                    fontSize: "12px",
                                    py: 2,
                                }}
                            >
                                STATUS
                            </TableCell>

                            <TableCell
                                sx={{
                                    color: "#7C828A",
                                    fontWeight: 600,
                                    fontSize: "12px",
                                    py: 2,
                                }}
                            >
                                DATE
                            </TableCell>

                            <TableCell
                                sx={{
                                    color: "#7C828A",
                                    fontWeight: 600,
                                    fontSize: "12px",
                                    py: 2,
                                }}
                            >
                                TRANSACTION
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data === undefined ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    align="center"
                                    sx={{
                                        py: 4,
                                        color: "#7C828A",
                                        border: 0,
                                    }}
                                >
                                    No recent transaction
                                </TableCell>
                            </TableRow>
                        ) : loading ? (
                            <TableRow>
                                <TableCell
                                    sx={{
                                        py: 2,
                                    }}
                                >
                                    <Skeleton
                                        variant="text"
                                        width={120}
                                        height={32}
                                    />
                                </TableCell>

                                <TableCell sx={{ py: 2 }}>
                                    <Skeleton
                                        variant="rounded"
                                        width={80}
                                        height={28}
                                    />
                                </TableCell>

                                <TableCell
                                    sx={{
                                        py: 2,
                                    }}
                                >
                                    <Skeleton
                                        variant="text"
                                        width={140}
                                        height={24}
                                    />
                                </TableCell>

                                <TableCell
                                    sx={{
                                        py: 2,
                                    }}
                                >
                                    <Skeleton
                                        variant="text"
                                        width={110}
                                        height={24}
                                    />
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        "&:last-child td": {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell
                                        sx={{
                                            fontWeight: 500,
                                            fontFamily: "var(--font-jetBrain-mono)",
                                            fontSize: { xs: "15px", sm: "18px" },
                                            py: 2,
                                            color: "#0A0B0D",
                                        }}
                                    >
                                        {row.amount}
                                    </TableCell>

                                    <TableCell sx={{ py: 2 }}>
                                        <FaucetStatusChip />
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            color: "#5E5E61",
                                            fontSize: { xs: "13px", sm: "14px" },
                                            py: 2,
                                        }}
                                    >
                                        {row.date}
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            fontFamily: "var(--font-jetBrain-mono)",
                                            color: "#003EC7",
                                            fontWeight: 500,
                                            fontSize: { xs: "13px", sm: "14px" },
                                            py: 2,
                                        }}
                                    >
                                        <Link
                                            href={`https://explorer.qantera.network/tx/${row.tx}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {shortenHash(row.tx)}
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
