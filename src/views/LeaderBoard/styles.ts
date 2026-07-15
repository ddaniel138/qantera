import {
    Box,
    Typography,
    CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const ROW_HEIGHT = 54;
const HEADER_HEIGHT = 44;
const CURRENT_USER_HEIGHT = 54;
const DIVIDER_HEIGHT = 36;

export const HeaderRow = styled(Box)({
    display: "grid",
    gridTemplateColumns: "80px minmax(240px, 1fr) 180px 120px 160px",
    alignItems: "center",
    height: HEADER_HEIGHT,
    background: "#F7F7F7",
    borderBottom: "1px solid #EEF0F3",
    position: "sticky",
    top: 0,
    zIndex: 20,
});

export const BodyRow = styled(Box, {
    shouldForwardProp: (prop) => prop !== "isUser",
})<{ isUser?: boolean }>(({ isUser }) => ({
    display: "grid",
    gridTemplateColumns: "80px minmax(240px, 1fr) 180px 120px 160px",
    alignItems: "center",
    height: ROW_HEIGHT,

    position: "absolute",
    left: 0,
    right: 0,

    borderBottom: "1px solid #EEF0F3",

    background: isUser ? "#EFF6FF" : "#FFFFFF",

    "&:hover": {
        background: isUser ? "#EFF6FF" : "#F9FAFB",
    },
}));

export const Cell = styled(Box)({
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    fontSize: 14,
    boxSizing: "border-box",
});
