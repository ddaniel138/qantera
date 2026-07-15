"use client";

import {
    Avatar,
    Box,
    ButtonBase,
    Chip,
    Typography,
} from "@mui/material";

import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

interface Props {
    icon: string;
    name: string;
    description: string;
    badge?: string;
    disabled?: boolean;
    onConnect: () => void;
}

export default function WalletItem({
    icon,
    name,
    description,
    badge,
    disabled,
    onConnect,
}: Props) {
    return (
        <ButtonBase
            disabled={disabled}
            onClick={onConnect}
            sx={{
                width: "100%",
                px: 2,
                py: 2,
                justifyContent: "space-between",
                transition: ".25s",

                "&:hover": {
                    bgcolor: "#F7F8FA",
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <Avatar
                    src={icon}
                    sx={{
                        width: 46,
                        height: 46,
                        bgcolor: "#fff",
                        border: "1px solid #ECECEC",
                        borderRadius: '10px',
                    }}
                />

                <Box sx={{ textAlign: 'left' }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: '700'
                            }}
                        >
                            {name}
                        </Typography>

                        {badge && (
                            <Chip
                                label={badge}
                                size="small"
                                sx={{
                                    height: 20,
                                    bgcolor: "#003EC7",
                                    color: "#fff",
                                    fontSize: 12,
                                    borderRadius: '4px'
                                }}
                            />
                        )}
                    </Box>

                    <Typography
                        sx={{
                            color: "#5E5E61",
                            mt: 0.4,
                            fontSize: 14,
                        }}
                    >
                        {description}
                    </Typography>
                </Box>
            </Box>

            <ChevronRightRoundedIcon
                sx={{
                    color: "#BDBDBD",
                }}
            />
        </ButtonBase>
    );
}