import React from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material';
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

const MENU_ITEMS = [
    { text: 'Overview', icon: <OverviewIcon />, activeIcon: <OverviewIconBlue />, path: '/' },
    { text: 'Faucet', icon: <FaucetIcon />, activeIcon: <FaucetIconBlue />, path: '/faucet' },
    { text: 'Social Tasks', icon: <SocialIcon />, activeIcon: <SocialIconBlue />, path: '/social' },
    { text: 'Yap Tasks', icon: <TasksIcon />, activeIcon: <TasksIconBlue />, path: '/tasks' },
    { text: 'Mint NFT', icon: <MintIcon />, activeIcon: <MintIconBlue />, path: '/mint' },
    { text: 'Leaderboard', icon: <LeaderboardIcon />, activeIcon: <LeaderboardIconBlue />, path: '/leaderboard' },
];

export default function Sidebar() {
    const router = useRouter();

    return (
        <Box
            sx={{
                width: 260,
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                backgroundColor: '#F7F8FC',
                borderRight: '1px solid #E5E7EB',
                display: { xs: 'none', md: 'block' },
                padding: '16px 0px 16px 0px',
            }}
        >
            <Link href="/" style={{ textDecoration: 'none' }}>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', pb: 2, px: 2 }}>
                    <img alt="Logo" src='/logo.png' style={{ width: '150px', height: 'auto' }} />
                </Stack>
            </Link>

            <List disablePadding>
                {MENU_ITEMS.map((item) => {
                    const isActive = router.pathname === item.path;

                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                component={Link}
                                href={item.path}
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
                                        <Typography sx={{ fontWeight: isActive ? 700 : 400, fontSize: 16 }}>
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
    );
}