import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

import { SectionTitle } from './StyledComponents';
import { MintChecklistItem } from '@/types/mintNFT';
import { CheckCircleIcon } from '@/components/icons';

interface Props {
    items: MintChecklistItem[];
}

export default function EligibilityChecklist({
    items,
}: Props) {
    return (
        <Box sx={{ mb: 4 }}>
            <SectionTitle>
                Eligibility Checklist
            </SectionTitle>

            <Stack spacing={1.5}>
                {items.map((item) => (
                    <Box
                        key={item.key}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: '14px 20px',
                            backgroundColor: '#F7F7F7',
                            borderRadius: '12px',
                            border: '1px solid #DEE1E6',
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: '16px',
                                fontWeight: 700,
                                color: '#0A0B0D',
                            }}
                        >
                            {item.label}
                        </Typography>

                        {item.met ? (
                            <CheckCircleIcon />
                        ) : (
                            <RadioButtonUncheckedIcon
                                sx={{
                                    color: '#DEE1E6',
                                    fontSize: '20px',
                                }}
                            />
                        )}
                    </Box>
                ))}
            </Stack>
        </Box>
    );
}