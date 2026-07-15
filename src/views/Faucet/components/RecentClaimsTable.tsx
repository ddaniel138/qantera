import {
    Chip,
    Link,
    Paper,
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

interface RecentClaimItem {
    amount: string;
    faucet: boolean;
    date: string;
    tx: string;
}

interface Props {
    data: RecentClaimItem[];
}

export default function RecentClaimsTable({
    data,
}: Props) {
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
                component={Paper}
                elevation={0}
                sx={{
                    borderRadius: "24px",
                    border: "1px solid #DEE1E6",
                    width: "100%",
                    backgroundColor: "#FFFFFF",
                    overflow: "hidden",
                    overflowX: "auto",
                    "&::-webkit-scrollbar": {
                        height: "3px",
                    },
                    "&::-webkit-scrollbar-track": {
                        backgroundColor: "transparent",
                        mx: 2,
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#DEE1E6",
                        borderRadius: "100px",
                        "&:hover": {
                            backgroundColor: "#B0B5BC",
                        },
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
                        {data.length === 0 ? (
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
                                        <Link href={`https://explorer.qantera.network/tx/${row.tx}`} target="_blank" rel="noopener noreferrer">
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