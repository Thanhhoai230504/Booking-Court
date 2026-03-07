import React from 'react';
import { Box } from '@mui/material';
import AppHeader from './AppHeader';
import BottomNav from './BottomNav';

interface MainLayoutProps {
    children: React.ReactNode;
    hideHeader?: boolean;
    hideBottomNav?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, hideHeader = false, hideBottomNav = false }) => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#F5F5F5',
                position: 'relative',
            }}
        >
            {!hideHeader && <AppHeader />}
            <Box
                component="main"
                sx={{
                    pb: hideBottomNav ? 2 : 10,
                    minHeight: 'calc(100vh - 160px)',
                }}
            >
                {children}
            </Box>
            {!hideBottomNav && <BottomNav />}
        </Box>
    );
};

export default MainLayout;
