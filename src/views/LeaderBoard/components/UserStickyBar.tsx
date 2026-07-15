import React from 'react';
import { Box, Typography, Button, LinearProgress, Skeleton, styled } from '@mui/material';
import Link from 'next/link';
import { LeaderboardMe } from '@/types/leaderboard';

interface Props {
    currentUser: LeaderboardMe | null;
}

export const UserStickyBar = ({
    currentUser,
}: Props) => {
    return (
        <>

            <Box
                sx={{
                    position: 'sticky',
                    bottom: 16,
                    width: '100%',
                    maxWidth: '100%',
                    zIndex: 1000,
                    bgcolor: '#0B0F19',
                    borderRadius: '24px',
                    p: { xs: 2, md: 3 },
                    boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.24)',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    mt: 4,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 3, sm: 5 }, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'space-between', sm: 'flex-start' } }}>
                    <Box>
                        <Typography sx={{ color: '#7C828A', fontSize: '12px', mb: 0.5, fontWeight: 600 }}>Your Rank</Typography>
                        <Typography
                            sx={{
                                color: "#FFFFFF",
                                fontSize: { xs: 22, md: 32 },
                            }}
                        >
                            {currentUser ? (
                                `#${currentUser.rank}`
                            ) : (
                                <StyledSkeleton
                                    variant="text"
                                    width={55}
                                    height={42}
                                />
                            )}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography sx={{ color: '#7C828A', fontSize: '12px', mb: 0.5, fontWeight: 600 }}>Total Points</Typography>
                        <Typography
                            sx={{
                                color: "#DDE1FF",
                                fontSize: { xs: 22, md: 32 },
                                display: "flex",
                                alignItems: "baseline",
                                gap: 0.5,
                            }}
                        >
                            {currentUser ? (
                                <>
                                    {currentUser.total_points.toLocaleString()}
                                    <span
                                        style={{
                                            fontSize: "18px",
                                            color: "#7C828A",
                                        }}
                                    >
                                        QP
                                    </span>
                                </>
                            ) : (
                                <StyledSkeleton
                                    variant="text"
                                    width={90}
                                    height={42}
                                />
                            )}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ flex: 1, maxWidth: { xs: '100%', md: '400px' }, width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography sx={{ color: '#7C828A', fontSize: '12px', fontWeight: 600 }}>Progress to{" "}
                            {currentUser
                                ? `Top ${currentUser.next_target.target_rank}`
                                : "Top --"}</Typography>
                        <Typography sx={{ color: '#DDE1FF', fontSize: '12px', fontWeight: 600 }}>
                            {currentUser ? (
                                `${currentUser.next_target.points_needed.toLocaleString()} QP needed`
                            ) : (
                                <StyledSkeleton
                                    variant="text"
                                    width={110}
                                />
                            )}
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={
                            currentUser
                                ? Math.min(
                                    (currentUser.total_points /
                                        currentUser.next_target.target_points) *
                                    100,
                                    100
                                )
                                : 0
                        }
                        sx={{
                            height: 6,
                            borderRadius: '10px',
                            bgcolor: 'rgba(255,255,255,0.1)',
                            '& .MuiLinearProgress-bar': {
                                bgcolor: '#003EC7',
                                borderRadius: '10px',
                            },
                        }}
                    />
                </Box>

                <Button
                    component={Link}
                    href="/tasks"
                    variant="contained"
                    sx={{
                        bgcolor: '#EEF0F3',
                        color: '#0B0F19',
                        fontWeight: 600,
                        fontSize: '13px',
                        borderRadius: '100px',
                        textTransform: 'none',
                        px: 3,
                        py: 1.5,
                        width: { xs: '100%', sm: 'auto' },
                        whiteSpace: 'nowrap',
                        '&:hover': {
                            backgroundColor: '#F3F4F6',
                        },
                    }}
                >
                    Complete Mission
                </Button>
            </Box>
        </>
    );
};

const StyledSkeleton = styled(Skeleton)({
    backgroundColor: "rgba(255,255,255,0.18)",

    "&::after": {
        background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)",
    },
});