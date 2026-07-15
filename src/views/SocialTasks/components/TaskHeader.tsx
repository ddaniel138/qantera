import React from 'react';
import { Box, Typography, Stack, styled } from '@mui/material';

const EarnedPointsBox = styled(Box)({
    border: '1px solid #DEE1E6',
    borderRadius: '24px',
    padding: '12px 24px',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    minWidth: '140px',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)'
});

interface Props {
    totalEarned: number;
}

export const TaskHeader = ({
    totalEarned,
}: Props) => {
    return (
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            sx={{
                mb: 4,
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 2
            }}
        >
            <Box>
                <Typography variant="overline" sx={{ color: '#003EC7', fontWeight: 600, letterSpacing: '1px', fontSize: '12px' }}>
                    COMMUNITY MISSIONS
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#111827', mt: 0.5, mb: 1, fontSize: { xs: '28px', md: '32px' } }}>
                    Social Tasks
                </Typography>
                <Typography sx={{ color: '#737688', fontSize: '16px', maxWidth: '600px' }}>
                    Complete community missions, verify your activity and earn Qantera Points to secure your status in the post-quantum ecosystem.
                </Typography>
            </Box>

            <EarnedPointsBox sx={{ width: { xs: '100%', sm: 'auto' }, alignItems: { xs: 'flex-start', sm: 'flex-end' } }}>
                <Typography sx={{ fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>Total Earned</Typography>
                <Typography sx={{ fontSize: '32px', fontWeight: 700, color: '#003EC7', fontFamily: 'var(--font-jetBrain-mono)', lineHeight: 1.2 }}>
                    {totalEarned}
                </Typography>
            </EarnedPointsBox>
        </Stack>
    );
};