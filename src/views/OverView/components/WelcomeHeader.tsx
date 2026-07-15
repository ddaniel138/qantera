import React from 'react';
import { Box, Typography } from '@mui/material';

export const WelcomeHeader = () => (
    <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: { xs: '42px', sm: '52px' }, color: '#0A0B0D'}}>
            Welcome to the Qantera Testnet
        </Typography>
        <Typography sx={{ color: '#5E5E61', fontSize: '16px' }}>
            Complete activities, explore the network and earn your place in the ecosystem.
        </Typography>
    </Box>
);