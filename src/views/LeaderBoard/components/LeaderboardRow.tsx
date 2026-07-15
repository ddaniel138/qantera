import { SxProps, Theme } from "@mui/material";
import { formatAddress, formatNumber } from "@/helpers";

import { LeaderboardUser } from "../constants";
import { BodyRow, Cell } from "../styles";

interface Props {
    row: LeaderboardUser;
    sx?: SxProps<Theme>;
}

export default function LeaderboardItem({
    row,
    sx,
}: Props) {
    return (
        <BodyRow sx={sx}>
            <Cell
                sx={{
                    fontWeight: 500,
                    color: "#5E5E61",
                    fontSize: 18,
                    fontFamily: 'var(--font-jetBrain-mono)'
                }}
            >
                {row.rank}
            </Cell>

            <Cell
                sx={{
                    fontWeight: 700,
                    fontSize: 16,
                }}
            >
                {formatAddress(row.wallet_address)}
            </Cell>

            <Cell
                sx={{
                    justifyContent: "flex-end",
                    color: "#7C828A",
                    fontFamily: "var(--font-jetBrain-mono)",
                    fontWeight: 500,
                    fontSize: 18,
                }}
            >
                {formatNumber(row.yap_points)}
            </Cell>

            <Cell
                sx={{
                    justifyContent: "flex-end",
                    fontFamily: "var(--font-jetBrain-mono)",
                    fontWeight: 500,
                    fontSize: 18,
                }}
            >
                {row.streak_days}d
            </Cell>

            <Cell
                sx={{
                    justifyContent: "flex-end",
                    fontWeight: 700,
                    fontFamily: "var(--font-jetBrain-mono)",
                    fontSize: 18,
                }}
            >
                {formatNumber(row.total_points)}
            </Cell>
        </BodyRow>
    );
}