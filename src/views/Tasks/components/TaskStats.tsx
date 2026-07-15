import React from 'react';
import { Grid, Box, Typography, Skeleton } from '@mui/material';
import { TaskStatsData } from '../constants';
import { formatNumber } from '@/helpers';

interface TaskStatsProps {
    stats?: TaskStatsData | null;
    loading?: boolean;
}

export default function TaskStats({ stats, loading }: TaskStatsProps) {
    const statItems = [
        { label: 'POINTS', value: stats ? formatNumber(stats.points) : '0' },
        { label: 'RANK', value: stats?.rank ?? '-' },
        { 
            label: 'M.SHARES', 
            value: stats?.mShare !== undefined && stats?.mShare !== null ? `${stats.mShare}%` : '0%' 
        },
        { label: 'STREAK', value: stats ? `${stats.streak} days` : '0 days' },
        { label: 'APPROVED POST', value: stats?.approvedPost ?? 0 },
    ];

    return (
        <Grid container spacing={2} sx={{ mb: 4 }}>
            {statItems.map((item, index) => (
                <Grid size={{ xs: 6, sm: 2.4 }} key={index}>
                    <Box sx={{
                        p: 2.5,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '24px',
                        border: '1px solid #EAECEF',
                        minHeight: { xs: '100px', md: '120px' }
                    }}>
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#5E5E61', mb: 1, letterSpacing: '0.05em' }}>
                            {item.label}
                        </Typography>
                        
                        {loading ? (
                            <Skeleton variant="text" sx={{ fontSize: { xs: '20px', md: '32px' }, width: '60%' }} />
                        ) : (
                            <Typography sx={{ fontSize: { xs: '20px', md: '32px' }, fontWeight: 600, color: '#0A0B0D' }}>
                                {item.value}
                            </Typography>
                        )}
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
}