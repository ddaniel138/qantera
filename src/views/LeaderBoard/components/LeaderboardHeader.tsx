import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { FilterOption } from '../constants';

interface HeaderProps {
    options: readonly FilterOption[];
    activeFilter: FilterOption;
    onFilterChange: (filter: FilterOption) => void;
}

export const LeaderboardHeader = ({ options, activeFilter, onFilterChange }: HeaderProps) => (
    <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: { xs: '42px', sm: '52px' }, color: '#111827', mb: 1 }}>
            Qantera Contributors
        </Typography>
        <Typography sx={{ color: '#5E5E61', fontSize: '16px', mb: 3 }}>
            Earn points, complete missions and climb the ecosystem leaderboard.
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
            {options.map((opt) => {
                const isActive = activeFilter === opt;
                return (
                    <Button
                        key={opt}
                        onClick={() => onFilterChange(opt)}
                        sx={{
                            borderRadius: '100px',
                            px: 2.5,
                            py: { xs: 0, md: 0.5 },
                            fontSize: '14px',
                            fontWeight: 500,
                            textTransform: 'none',
                            whiteSpace: 'nowrap',
                            border: '1px solid',
                            borderColor: isActive ? '#0A0B0D' : '#DEE1E6',
                            backgroundColor: isActive ? '#0A0B0D' : '#FFFFFF',
                            color: isActive ? '#FFFFFF' : '#5E5E61',
                            '&:hover': {
                                backgroundColor: isActive ? '#0A0B0D' : '#F9FAFB',
                                borderColor: isActive ? '#0A0B0D' : '#DEE1E6',
                            },
                        }}
                    >
                        {opt}
                    </Button>
                );
            })}
        </Box>
    </Box>
);