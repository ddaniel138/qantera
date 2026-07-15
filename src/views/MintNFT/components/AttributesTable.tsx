import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { SectionTitle, JetBrainMonoText } from './StyledComponents';
import { AttributeItem } from '../types';

interface Props {
    attributes: AttributeItem[];
}

export default function AttributesTable({ attributes }: Props) {
    return (
        <Box sx={{
            p: { xs: 3, md: 4 },
            mt: { xs: 3, md: 4 },
            borderRadius: '32px',
            border: '1px solid #DEE1E6',
            backgroundColor: '#FFFFFF',
        }}>
            <SectionTitle>Attributes</SectionTitle>
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    borderRadius: '24px',
                    overflow: 'hidden',
                    overflowX: 'auto',
                    backgroundColor: '#FFFFFF',
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#5E5E61', fontWeight: 600, fontSize: '12px', py: 1.5 }}>Trait</TableCell>
                            <TableCell align="right" sx={{ color: '#5E5E61', fontWeight: 600, fontSize: '12px', py: 1.5 }}>Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attributes.map((row, index) => (
                            <TableRow key={index} sx={{ '&:last-child cell': { border: 0 } }}>
                                <TableCell sx={{ color: '#0A0B0D', fontSize: '16px', py: 2 }}>
                                    {row.trait}
                                </TableCell>
                                <TableCell align="right" sx={{ py: 2 }}>
                                    <JetBrainMonoText sx={{ fontSize: '18px', fontWeight: 500 }}>
                                        {row.value}
                                    </JetBrainMonoText>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}