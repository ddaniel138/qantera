import React from 'react';
import { Drawer, Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Stack } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useRouter } from 'next/router';
import Link from 'next/link';

import {
    OverviewIcon, OverviewIconBlue,
    FaucetIcon, FaucetIconBlue,
    TasksIcon, TasksIconBlue,
    MintIcon, MintIconBlue,
    LeaderboardIcon, LeaderboardIconBlue,
    SocialIcon,
    SocialIconBlue
} from '@/components/icons';

interface MobileDrawerProps {
    open: boolean;
    onClose: () => void;
}

const MENU_ITEMS = [
    { text: 'Overview', icon: <OverviewIcon />, activeIcon: <OverviewIconBlue />, path: '/' },
    { text: 'Faucet', icon: <FaucetIcon />, activeIcon: <FaucetIconBlue />, path: '/faucet' },
    { text: 'Social Tasks', icon: <SocialIcon />, activeIcon: <SocialIconBlue />, path: '/social' },
    { text: 'Yap Tasks', icon: <TasksIcon />, activeIcon: <TasksIconBlue />, path: '/tasks' },
    { text: 'Mint NFT', icon: <MintIcon />, activeIcon: <MintIconBlue />, path: '/mint' },
    { text: 'Leaderboard', icon: <LeaderboardIcon />, activeIcon: <LeaderboardIconBlue />, path: '/leaderboard' },
];

export default function MobileDrawer({ open, onClose }: MobileDrawerProps) {
    const router = useRouter();

    return (
        <Drawer anchor="left" open={open} onClose={onClose}>
            <Box sx={{ width: 280, pt: 3, pb: 3, height: '100%', backgroundColor: '#F7F8FC' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, px: 3 }}>
                    <Link
                        href="/"
                        style={{ textDecoration: 'none' }}
                    >
                        <Stack direction="row" sx={{ alignItems: 'center' }}>
                            <img alt="Logo" src='/logo.png' style={{ width: '120px', height: 'auto' }} />
                        </Stack>
                    </Link>

                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </Box>

                <List disablePadding>
                    {MENU_ITEMS.map((item) => {
                        const isActive = router.pathname === item.path;
                        return (
                            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    component={Link}
                                    href={item.path}
                                    onClick={onClose}
                                    sx={{
                                        backgroundColor: isActive ? '#EEF0F380' : 'transparent',
                                        color: isActive ? '#003EC7' : '#5E5E61',
                                        borderLeft: isActive ? '4px solid #003EC7' : '4px solid transparent',
                                        borderTopRightRadius: 8,
                                        borderBottomRightRadius: 8,

                                        pl: isActive ? '20px' : '24px',
                                        pr: '24px',
                                        py: 1.5,

                                        '&:hover': {
                                            backgroundColor: isActive ? '#EEF0F380' : '#EEF0F340'
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color: 'inherit',
                                            minWidth: 36,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {isActive ? item.activeIcon : item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography sx={{ fontWeight: isActive ? 600 : 500, fontSize: 15 }}>
                                                {item.text}
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
        </Drawer>
    );
}