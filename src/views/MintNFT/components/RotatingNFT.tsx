import React from 'react';
import { Box, styled } from '@mui/material';

interface RotatingNFTProps {
    src: string;
    alt?: string;
    speed?: number;
}

const styledKeyframes = `
  @keyframes rotateY3D {
    0% { transform: perspective(1000px) rotateY(0deg); }
    100% { transform: perspective(1000px) rotateY(360deg); }
  }
`;

const StyledImage = styled('img')<{ $speed: number }>(({ $speed }) => ({
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    animation: `rotateY3D ${$speed}s linear infinite`,
}));

export default function RotatingNFT({ src, alt = 'NFT Asset', speed = 6 }: RotatingNFTProps) {
    return (
        <Box sx={{
            width: { xs: '200px', sm: '280px' },
            height: { xs: '200px', sm: '280px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
            filter: 'drop-shadow(0px 16px 32px rgba(0, 62, 199, 0.3))',
        }}>
            <style>{styledKeyframes}</style>
            
            <StyledImage 
                src={src} 
                alt={alt} 
                $speed={speed} 
            />
        </Box>
    );
}