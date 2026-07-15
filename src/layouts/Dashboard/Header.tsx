import React, { useState } from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import ConnectWalletModal from '@/components/modal/ConnectWalletModal';
import ConnectWalletButton from '@/components/ConnectWalletButton';

interface HeaderProps {
    onMenuClick: () => void;
}

const PAGE_TITLES: Record<string, string> = {
    '/': 'Overview',
    '/faucet': 'Faucet',
    '/tasks': 'Yap Tasks',
    '/mint': 'Mint NFT',
    '/leaderboard': 'Leaderboard',
    '/social': 'Social Tasks',
};

export default function Header({ onMenuClick }: HeaderProps) {
    const router = useRouter();
    const currentTitle = PAGE_TITLES[router.pathname] || 'Dashboard';

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <Box
            component="header"
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 2,
                px: { xs: 2, md: 4 },
                backgroundColor: '#FFFFFF',
                borderBottom: '1px solid #E5E7EB',
                position: 'sticky',
                top: 0,
                zIndex: 10,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={onMenuClick}
                    sx={{ mr: 0, display: { md: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        color: '#111827',
                        fontSize: { xs: '20px', md: '32px' }
                    }}
                >
                    {currentTitle}
                </Typography>
            </Box>

            <Box>
                <ConnectWalletButton
                    variant="connect-wallet"
                    onConnectClick={() => setIsModalOpen(true)}
                />
            </Box>

            <ConnectWalletModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </Box>
    );
}