import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { HammerIcon } from '@/components/icons';

export default function RulesGuidelines() {
    const rules = [
        {
            icon: <FormatListNumberedIcon sx={{ color: '#4B5563' }} />,
            title: 'Max 5/day',
            desc: 'You can submit up to 5 valid X posts per rolling 24-hour period.',
        },
        {
            icon: <AccessTimeFilledIcon sx={{ color: '#4B5563' }} />,
            title: '5 Min Age',
            desc: 'Posts must be at least 5 minutes old before submission to allow for verification.',
        },
        {
            icon: <ContentCopyIcon sx={{ color: '#4B5563' }} />,
            title: 'No Duplicates',
            desc: 'Submitting duplicate links or copy-pasted content will result in a streak reset.',
        },
    ];

    return (
        <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECEF', p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <HammerIcon />
                <Typography sx={{ fontWeight: 600, fontSize: '18px', color: '#0A0B0D' }}>
                    Rules & Guidelines
                </Typography>
            </Box>

            <Stack spacing={3}>
                {rules.map((rule, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Box sx={{ p: 1, backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {rule.icon}
                        </Box>
                        <Box>
                            <Typography sx={{ fontWeight: 600, color: '#0A0B0D', mb: 0.5 }}>
                                {rule.title}
                            </Typography>
                            <Typography sx={{ fontWeight: 400, color: '#5E5E61', lineHeight: 1.5 }}>
                                {rule.desc}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
}