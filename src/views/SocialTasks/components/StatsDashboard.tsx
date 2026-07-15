import React from 'react';

import {
    Card,
    Grid,
    Stack,
    Typography,
    LinearProgress,
    styled,
    Divider,
} from '@mui/material';

const StatCard = styled(Card)({
    border: '1px solid #DEE1E6',
    borderRadius: '16px',
    boxShadow: 'none',
    backgroundColor: '#FFFFFF',
    padding: '24px',
});

interface Props {
    completed: number;

    total: number;

    percentage: number;

    pointsEarned: number;

    availablePoints: number;

    connections: number;
}

export const StatsDashboard = ({
    completed,
    total,
    percentage,
    pointsEarned,
    availablePoints,
    connections,
}: Props) => {
    const stats = [
        {
            label: 'Completed',
            val: completed,
        },
        {
            label: 'Points Earned',
            val: `${pointsEarned} QP`,
        },
        {
            label: 'Available',
            val: `${availablePoints} QP`,
        },
        {
            label: 'Connections',
            val: connections,
        },
    ];

    return (
        <StatCard sx={{ mb: 3 }}>
            <Grid
                container
                sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    spacing: {
                        xs: 3,
                        md: 4,
                    },
                }}
            >
                <Grid>
                    <Stack
                        direction="row"
                        sx={{
                            mb: 1.5,
                            justifyContent:
                                'space-between',
                            alignItems: 'center',
                            gap: '16px',
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: '14px',
                                color: '#111827',
                            }}
                        >
                            {completed} of {total} Tasks
                            Completed
                        </Typography>

                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: '14px',
                                color: '#003EC7',
                            }}
                        >
                            {percentage}%
                        </Typography>
                    </Stack>

                    <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                            height: 8,
                            borderRadius: '4px',
                            backgroundColor:
                                '#E5E7EB',
                            '& .MuiLinearProgress-bar':
                                {
                                    backgroundColor:
                                        '#003EC7',
                                },
                        }}
                    />
                </Grid>

                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                        display: {
                            xs: 'none',
                            sm: 'block',
                        },
                    }}
                />

                <Grid size={{ xs: 12, md: 8 }}>
                    <Grid container spacing={2}>
                        {stats.map((stat, i) => (
                            <Grid
                                size={{
                                    xs: 6,
                                    sm: 3,
                                }}
                                key={i}
                            >
                                <Typography
                                    sx={{
                                        fontSize:
                                            '12px',
                                        color:
                                            '#737688',
                                        fontWeight:
                                            600,
                                        mb: 0.5,
                                    }}
                                >
                                    {stat.label}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize:
                                            '18px',
                                        fontWeight:
                                            700,
                                        color:
                                            '#111827',
                                        fontFamily:
                                            'var(--font-jetBrain-mono)',
                                    }}
                                >
                                    {stat.val}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </StatCard>
    );
};