import {
    Box,
    Chip,
    IconButton,
    Typography,
} from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export interface TableHistoryRow {
    id: number;

    url: string;

    content: string;

    createdAt: string;

    status: "approved" | "rejected" | "pending";

    rewards: string;

    score: number | string;
}

interface Props {
    rows: TableHistoryRow[];

    page: number;

    pageSize: number;

    total: number;

    onPageChange: (page: number) => void;
}

export default function TableHistory({
    rows,
    page,
    pageSize,
    total,
    onPageChange,
}: Props) {
    const start =
        total === 0
            ? 0
            : (page - 1) * pageSize + 1;

    const end = Math.min(
        page * pageSize,
        total,
    );

    const totalPages = Math.max(
        1,
        Math.ceil(total / pageSize),
    );

    return (
        <>
            <Box
                sx={{
                    width: "100%",
                    overflowX: "auto",
                    overflowY: "hidden",
                    WebkitOverflowScrolling:
                        "touch",

                    "&::-webkit-scrollbar": {
                        height: 8,
                    },

                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor:
                            "#D9D9D9",
                        borderRadius:
                            "999px",
                    },
                }}
            >
                <Box
                    sx={{
                        minWidth: 980,
                    }}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns:
                                "2fr 140px 120px 2fr 90px",
                            px: 2,
                            pb: 2,
                            borderBottom:
                                "1px solid #ECECEC",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#5E5E61",
                            }}
                        >
                            POST
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#5E5E61",
                            }}
                        >
                            SUBMITTED
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#5E5E61",
                            }}
                        >
                            STATUS
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#5E5E61",
                            }}
                        >
                            REWARDS
                            (BASE/Q/E/S/X)
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#5E5E61",
                            }}
                        >
                            TOTAL
                        </Typography>
                    </Box>

                    {rows.map((row) => (
                        <Box
                            key={row.id}
                            sx={{
                                display: "grid",
                                gridTemplateColumns:
                                    "2fr 140px 120px 2fr 90px",
                                px: 2,
                                py: 3,
                                gap: 2,
                                alignItems:
                                    "center",
                                borderBottom:
                                    "1px solid #ECECEC",
                            }}
                        >
                            <Box
                                sx={{
                                    minWidth: 0,
                                }}
                            >
                                <Typography
                                    sx={{
                                        lineHeight:
                                            "22px",
                                        overflow:
                                            "hidden",
                                        display:
                                            "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient:
                                            "vertical",
                                        wordBreak:
                                            "break-word",
                                        minHeight: 44,
                                        fontSize: 16,
                                    }}
                                >
                                    {
                                        row.content
                                    }
                                </Typography>

                                <Typography
                                    component="a"
                                    href={
                                        row.url
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    sx={{
                                        mt: 0.75,
                                        display:
                                            "block",
                                        color: "#2563EB",
                                        fontSize: 14,
                                        textDecoration:
                                            "none",
                                        overflow:
                                            "hidden",
                                        whiteSpace:
                                            "nowrap",
                                        textOverflow:
                                            "ellipsis",

                                        "&:hover":
                                            {
                                                textDecoration:
                                                    "underline",
                                            },
                                    }}
                                >
                                    {
                                        row.url
                                    }
                                </Typography>
                            </Box>

                            <Typography
                                sx={{
                                    fontSize: 16,
                                    color: "#5E5E61",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {row.createdAt}
                            </Typography>

                            <Chip
                                label={
                                    row.status.charAt(0,).toUpperCase() + row.status.slice(1,)
                                }
                                size="small"
                                sx={{
                                    width: "fit-content",
                                    fontWeight: 600,
                                    bgcolor: row.status === "approved"
                                            ? "#05B1691A"
                                            : row.status ===
                                                "pending"
                                                ? "#5E5E611A"
                                                : "#F3F4F6",
                                    color: row.status === "approved"
                                            ? "#05B169"
                                            : row.status ===
                                                "pending"
                                                ? "#D97706"
                                                : "#5E5E61",
                                }}
                            />

                            <Typography
                                sx={{
                                    fontFamily: "var(--font-jetBrain-mono)",
                                    fontSize: 14,
                                    whiteSpace: "nowrap",
                                    color: '#5E5E61'
                                }}
                            >
                                {row.rewards}
                            </Typography>

                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {row.score === "--"
                                    ? "--"
                                    : `${row.score} QP`}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box
                sx={{
                    mt: 1,
                    pt: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography
                    sx={{
                        fontSize: 12,
                        color: "#5E5E61",
                        fontWeight: 600,
                    }}
                >
                    Showing {start}-{end} of{" "} {total} posts
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                    }}
                >
                    <IconButton
                        disabled={page <= 1}
                        onClick={() => onPageChange(page - 1)}
                        sx={{ border: "1px solid #E5E7EB", borderRadius: '8px', maxWidth: '30px' }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>

                    <IconButton
                        disabled={page >= totalPages}
                        onClick={() => onPageChange(page + 1)}
                        sx={{ border: "1px solid #E5E7EB", borderRadius: '8px', maxWidth: '30px'}}
                    >
                        <ChevronRightIcon />
                    </IconButton>
                </Box>
            </Box>
        </>
    );
}