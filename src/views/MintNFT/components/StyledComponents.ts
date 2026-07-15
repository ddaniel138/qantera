import { styled, Typography, Box } from '@mui/material';

export const JetBrainMonoText = styled(Typography)(({ theme }) => ({
    fontFamily: 'var(--font-jetBrain-mono)',
    fontWeight: 600,
    color: '#0A0B0D',
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '18px',
    color: '#0A0B0D',
    marginBottom: '16px',
}));

export const CardLabel = styled(Typography)(({ theme }) => ({
    fontSize: '12px',
    fontWeight: 600,
    color: '#5E5E61',
    textTransform: 'uppercase',
    marginBottom: '4px',
}));