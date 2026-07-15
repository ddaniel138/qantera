import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { DailyChallengeData } from '../constants';
import { getTimeUntilMidnight, formatDuration } from '@/helpers/countdown';
import { AccessTimeIcon } from '@/components/icons';

interface DailyChallengeProps {
    challenge: DailyChallengeData;
}

export default function DailyChallenge({ challenge }: DailyChallengeProps) {
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        const updateCountdown = () => {
            const msLeft = getTimeUntilMidnight();
            setTimeLeft(formatDuration(msLeft, true));
        };

        updateCountdown();

        const intervalId = setInterval(updateCountdown, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <Box sx={{
            backgroundColor: '#0A0B0D',
            borderRadius: '24px',
            p: { xs: 3, md: 4 },
            mb: 4,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 3
        }}>
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Chip
                        label="DAILY YAP"
                        size="small"
                        sx={{ backgroundColor: '#003EC733', color: '#DDE1FF', fontWeight: 600, fontSize: '12px', borderRadius: '99px', border: '1px solid #003EC74D', padding: '4px 12px' }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#7C828A', gap: 0.5 }}>
                        <AccessTimeIcon />
                        <Typography sx={{ fontSize: '14px', color: '#C7C6C9', fontWeight: 500 }}>Ends in {timeLeft}</Typography>
                    </Box>
                </Box>

                <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 400, mb: 1, fontSize: { xs: '22px', md: '32px' } }}>
                    {challenge.title}
                </Typography>
                <Typography sx={{ color: '#C7C6C9', fontSize: '16px' }}>
                    Reward: <span style={{ color: '#FFFFFF' }}>{challenge.reward}</span>
                </Typography>
            </Box>

            <Button
                variant="contained"
                href={challenge.xLink}
                target="_blank"
                endIcon={<OpenInNewIcon sx={{ fontSize: '16px !important' }} />}
                sx={{
                    backgroundColor: '#003EC7',
                    textTransform: 'none',
                    borderRadius: '100px',
                    px: 3,
                    py: 1.2,
                    fontWeight: 700,
                    fontSize: '16px',
                    width: { xs: '100%', md: 'auto' },
                    '&:hover': { backgroundColor: '#0036B1' }
                }}
            >
                Create Post on X
            </Button>
        </Box>
    );
}