import { Chip } from "@mui/material";

export default function FaucetStatusChip() {
    return (
        <Chip
            label="Success"
            size="small"
            sx={{
                backgroundColor: "#05B1691A",
                color: "#05B169",
                fontWeight: 500,
                borderRadius: "99px",
                fontSize: "12px",
            }}
        />
    );
}