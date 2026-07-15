import React from 'react';
import { Box, Typography } from '@mui/material';
import dynamic from 'next/dynamic';

const QuantumLatticeBg = dynamic(
    () => import('./QuantumLatticeBg'),
    { ssr: false }
);

export default function NFTPreviewCard() {
    return (
        <Box sx={{
            // background: '#1A1B20',
            background: 'radial-gradient(70.71% 70.71% at 50% 50%, #003EC7 0%, #0A0B0D 50%, #0A0B0D 100%)',

            borderRadius: '24px',
            p: { xs: 2, sm: 3 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            position: 'relative',
            border: '1px solid #2A2B30',
            overflow: 'hidden',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.5)'
        }}>

            <Box sx={{
                width: '80%',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 2,
                mb: { xs: 3, sm: 4 },
                backgroundColor: 'transparent',
                boxShadow: '0px 15px 35px rgba(0, 0, 0, 0.3)',
            }}>
                <Box
                    component="img"
                    src="/nft.gif"
                    alt="Qantera Origin"
                    sx={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        objectFit: 'contain'
                    }}
                />
            </Box>
        </Box>
    );
}