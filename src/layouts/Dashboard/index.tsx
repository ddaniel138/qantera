import React, { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileDrawer from './MobileDrawer';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F7F8FC' }}>
            <Sidebar />

            <MobileDrawer open={mobileOpen} onClose={handleDrawerToggle} />

            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                    ml: { md: '260px' },
                }}
            >
                <Header onMenuClick={handleDrawerToggle} />

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: { xs: 1, md: 4 },
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
}