import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface TaskHeaderProps {
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
    connectedX?: boolean;
    userName?: string | null;
}

export default function TaskHeader({
    onClick,
    disabled,
    loading,
    connectedX,
    userName,
}: TaskHeaderProps) {
    const [hover, setHover] = useState(false);

    const buttonText = loading
        ? "Loading..."
        : connectedX
                ? `@${userName}`
            : "Connect your X account";


    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 400, color: '#0A0B0D', mb: 2, fontSize: { xs: '42px', md: '52px' } }}>
                Yap to Earn
            </Typography>
            <Typography sx={{ color: '#5E5E61', fontSize: '16px', maxWidth: '600px', mb: 3 }}>
                Create quality content about the network, submit your X post and earn ecosystem points.
            </Typography>
            {/* <Button
                variant="contained"
                onClick={onClick}
                disabled={disabled || loading}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                sx={{
                    textTransform: "none",
                    borderRadius: "999px",
                    px: 3,
                    py: 1.2,
                    fontWeight: 700,
                    fontSize: 16,
                    backgroundColor
                        : "#003EC7",
                    transition: "all .2s",

                    "&:hover": {
                        backgroundColor
                            : "#0036B1",
                    },
                }}
            >
                {buttonText}
            </Button> */}
        </Box>
    );
}