/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from 'next/link';

export const MissionCard = () => (
    <Box sx={{ background: 'linear-gradient(180deg, #0B0F19 0%, #020408 100%)', p: 4, borderRadius: '16px', color: '#FFFFFF', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '380px', position: 'relative', overflow: 'hidden' }}>

        <Box sx={{ position: 'absolute', top: '-20%', right: '-20%', width: '240px', height: '240px', background: 'radial-gradient(circle, rgba(0,62,199,0.35) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />

        <Box>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', px: 2, py: 0.5, borderRadius: '100px', mb: 4 }}>
                <Box sx={{ width: 6, height: 6, bgcolor: '#10B981', borderRadius: '50%' }} />
                <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.5px' }}>DAILY YAP</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.3, mb: 2, fontSize: { xs: '24px', sm: '32px' } }}>
                Share why qantera-resistant security matters.
            </Typography>
            <Typography component="div" sx={{ color: '#9CA3AF', fontSize: '16px', lineHeight: 1.5 }}>
                Complete today's mission to boost your standing in the network. Earn up to <Box component="span" sx={{ color: '#FFFFFF', fontFamily: 'var(--font-jetBrain-mono)' }}>100 QP</Box>.
            </Typography>
        </Box>

        <Button 
            component={Link}
            href="/tasks"
            variant="contained" 
            endIcon={<ArrowForwardIcon />} 
            sx={{ 
                bgcolor: '#003EC7', 
                '&:hover': { bgcolor: '#0032A0' }, 
                borderRadius: '100px', 
                textTransform: 'none', 
                fontWeight: 500, 
                fontSize: '14px', 
                py: 1.5, 
                width: '100%', 
                mt: 4 
            }}
        >
            Start Mission
        </Button>
    </Box>
);