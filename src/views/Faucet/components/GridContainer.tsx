import { Box } from "@mui/material";
import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    sx?: any;
}

export default function GridContainer({ children, sx }: Props) {
    return <Box sx={{ ...sx, gap: 2 }}>{children}</Box>;
}