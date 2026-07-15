import React from 'react';
import { Box, Typography, Card, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { formatAddress, formatNumber } from '@/helpers';

const StyledPodiumGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    alignItems: 'center',
    marginBottom: '32px',
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
    },
}));

export const TopPodium = ({ topThree = [] }: { topThree?: any[] }) => {
    const isEmpty = topThree.length === 0;

    const orderedData = isEmpty
        ? [{ rank: 2 }, { rank: 1 }, { rank: 3 }]
        : [topThree[1], topThree[0], topThree[2]];

    return (
        <StyledPodiumGrid>
            {orderedData.map((user, idx) => {
                if (!user) return null;
                const isFirst = user.rank === 1;

                return (
                    <Card
                        key={user.rank || idx}
                        sx={{
                            p: 3,
                            borderRadius: '16px',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: 'none',
                            order: {
                                xs:
                                    user.rank === 1
                                        ? 1
                                        : user.rank === 2
                                        ? 2
                                        : 3,
                            
                                md:
                                    user.rank === 2
                                        ? 1
                                        : user.rank === 1
                                        ? 2
                                        : 3,
                            },
                            border: isFirst ? 'none' : '1px solid #DEE1E6',
                            background: isFirst ? 'linear-gradient(180deg, #0B0F19 0%, #020408 100%)' : '#FFFFFF',
                            color: isFirst ? '#FFFFFF' : '#111827',
                            minHeight: isFirst ? '240px' : '200px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        {isFirst && (
                            <Box sx={{ position: 'absolute', top: '-10%', right: '-10%', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(0,62,199,0.25) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(15px)', pointerEvents: 'none' }} />
                        )}

                        <Typography
                            sx={{
                                position: 'absolute',
                                right: 16,
                                bottom: 70,
                                fontSize: isFirst ? '130px' : '100px',
                                fontWeight: 800,
                                lineHeight: 1,
                                opacity: isFirst ? 0.2 : 0.07,
                                color: isFirst ? '#FFFFFF' : '#1A1C1C',
                                userSelect: 'none',
                            }}
                        >
                            {user.rank}
                        </Typography>

                        <Box>
                            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: isFirst ? '#DDE1FF' : '#5E5E61', mb: 1 }}>
                                Rank {user.rank === 1 ? '01' : `0${user.rank}`}
                            </Typography>
                            <Typography sx={{ fontSize: { xs: '26px', md: isFirst ? '40px' : '32px' }, fontWeight: 700, letterSpacing: '-0.5px' }}>
                                {isEmpty ? (
                                    <Skeleton variant="text" width="70%" sx={{ bgcolor: isFirst ? 'rgba(255,255,255,0.1)' : undefined }} />
                                ) : (
                                    formatAddress(user.wallet_address)
                                )}
                            </Typography>
                        </Box>

                        <Box sx={{ width: '100%', zIndex: 1, mt: 3 }}>
                            {isFirst ? (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <Box sx={{ width: '45%' }}>
                                        <Typography sx={{ fontSize: '11px', color: '#9CA3AF', mb: 0.5, fontWeight: 500 }}>
                                            Total Points
                                        </Typography>
                                        {isEmpty ? (
                                            <Skeleton variant="text" height={38} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                                        ) : (
                                            <Typography sx={{ fontSize: '32px', color: '#FFFFFF', lineHeight: 1.2 }}>
                                                {formatNumber(user.total_points)}
                                            </Typography>
                                        )}
                                    </Box>

                                    <Box sx={{ textAlign: 'right', width: '45%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        <Typography sx={{ fontSize: '11px', color: '#9CA3AF', mb: 0.5, fontWeight: 500 }}>
                                            Active Streak
                                        </Typography>
                                        {isEmpty ? (
                                            <Skeleton variant="text" width="60%" height={38} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                                        ) : (
                                            <Typography sx={{ fontSize: '32px', color: '#05B169', lineHeight: 1.2}}>
                                                {user.streak_days}d
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography sx={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>
                                            Total Points
                                        </Typography>
                                        {isEmpty ? (
                                            <Skeleton variant="text" width="60px" height={24} />
                                        ) : (
                                            <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#111827', fontFamily: 'var(--font-jetBrain-mono)' }}>
                                                {formatNumber(user.total_points)}
                                            </Typography>
                                        )}
                                    </Box>

                                    <Box sx={{ width: '100%', height: '1px', bgcolor: '#F3F4F6' }} />

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography sx={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>
                                            Active Streak
                                        </Typography>
                                        {isEmpty ? (
                                            <Skeleton variant="text" width="40px" height={24} />
                                        ) : (
                                            <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#111827', fontFamily: 'var(--font-jetBrain-mono)' }}>
                                                {user.streak_days}d
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Card>
                );
            })}
        </StyledPodiumGrid>
    );
};