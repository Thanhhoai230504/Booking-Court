import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import {
    HomeRounded as HomeIcon,
    MapRounded as MapIcon,
    ExploreRounded as ExploreIcon,
    StarRounded as StarIcon,
    PersonRounded as PersonIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const getActiveIndex = () => {
        const path = location.pathname;
        if (path === '/') return 0;
        if (path === '/map') return 1;
        if (path === '/discover') return 2;
        if (path === '/featured') return 3;
        if (path === '/account' || path === '/login' || path === '/register') return 4;
        return 0;
    };

    return (
        <Paper
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1200,
                borderTop: '1px solid rgba(0,0,0,0.08)',
            }}
            elevation={8}
        >
            <BottomNavigation
                value={getActiveIndex()}
                showLabels
                sx={{
                    height: 64,
                    bgcolor: '#FFFFFF',
                    '& .MuiBottomNavigationAction-root': {
                        minWidth: 0,
                        color: '#9E9E9E',
                        transition: 'all 0.2s ease',
                        '&.Mui-selected': {
                            color: '#006D38',
                        },
                    },
                    '& .MuiBottomNavigationAction-label': {
                        fontSize: '0.65rem',
                        marginTop: '2px',
                        '&.Mui-selected': {
                            fontSize: '0.65rem',
                            fontWeight: 600,
                        },
                    },
                }}
            >
                <BottomNavigationAction
                    label="Trang chủ"
                    icon={<HomeIcon />}
                    onClick={() => navigate('/')}
                />
                <BottomNavigationAction
                    label="Bản đồ"
                    icon={<MapIcon />}
                    onClick={() => navigate('/')}
                />
                <BottomNavigationAction
                    label="Khám phá"
                    icon={
                        <ExploreIcon
                            sx={{
                                fontSize: '2rem',
                                bgcolor: '#006D38',
                                color: 'white !important',
                                borderRadius: '50%',
                                p: 0.8,
                                boxShadow: '0 2px 8px rgba(0,109,56,0.4)',
                                transition: 'transform 0.2s ease',
                                '&:hover': { transform: 'scale(1.1)' },
                            }}
                        />
                    }
                    onClick={() => navigate('/')}
                />
                <BottomNavigationAction
                    label="Nổi bật"
                    icon={<StarIcon />}
                    onClick={() => navigate('/')}
                />
                <BottomNavigationAction
                    label="Tài khoản"
                    icon={<PersonIcon />}
                    onClick={() => navigate('/account')}
                />
            </BottomNavigation>
        </Paper>
    );
};

export default BottomNav;
