import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    InputBase,
    Box,
    Button,
    Chip,
} from '@mui/material';
import {
    Search as SearchIcon,
    TuneRounded as FilterIcon,
    MapOutlined as MapIcon,
    CalendarMonthOutlined as CalendarIcon,
    FavoriteBorderOutlined as FavoriteIcon,
    NotificationsNoneOutlined as NotifIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../data/mockData';

const AppHeader: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const today = formatDate(new Date().toISOString());

    return (
        <AppBar
            position="sticky"
            sx={{
                background: 'linear-gradient(135deg, #004D28 0%, #006D38 100%)',
                zIndex: 1100,
            }}
        >
            {/* Top bar */}
            <Toolbar
                sx={{
                    minHeight: '44px !important',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 0.5,
                }}
            >
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem' }}>
                    {today}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" sx={{ color: 'white' }}>
                        <NotifIcon fontSize="small" />
                    </IconButton>
                    <Button
                        size="small"
                        sx={{ color: 'white', fontSize: '0.75rem', minWidth: 'auto' }}
                        onClick={() => navigate('/login')}
                    >
                        Đăng nhập
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        sx={{
                            color: 'white',
                            borderColor: 'rgba(255,255,255,0.5)',
                            fontSize: '0.75rem',
                            minWidth: 'auto',
                            py: 0,
                        }}
                        onClick={() => navigate('/register')}
                    >
                        Đăng ký
                    </Button>
                </Box>
            </Toolbar>

            {/* Search bar */}
            <Toolbar sx={{ minHeight: '48px !important', px: 2, py: 0.5 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        borderRadius: 3,
                        px: 1.5,
                        py: 0.5,
                        flex: 1,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        transition: 'all 0.3s ease',
                        '&:focus-within': {
                            backgroundColor: 'rgba(255,255,255,0.25)',
                            border: '1px solid rgba(255,255,255,0.4)',
                        },
                    }}
                >
                    <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 1, fontSize: '1.2rem' }} />
                    <InputBase
                        placeholder="Tìm sân Pickleball..."
                        sx={{
                            color: 'white',
                            flex: 1,
                            fontSize: '0.875rem',
                            '& input::placeholder': { color: 'rgba(255,255,255,0.6)', opacity: 1 },
                        }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        <FilterIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Toolbar>

            {/* Quick links */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1.5,
                    px: 2,
                    pb: 1.5,
                    pt: 0,
                }}
            >
                <Chip
                    icon={<MapIcon sx={{ color: 'white !important', fontSize: '1rem' }} />}
                    label="Bản đồ"
                    size="small"
                    sx={{
                        bgcolor: 'rgba(255,255,255,0.15)',
                        color: 'white',
                        fontSize: '0.75rem',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                    }}
                    clickable
                />
                <Chip
                    icon={<CalendarIcon sx={{ color: 'white !important', fontSize: '1rem' }} />}
                    label="Sân đã đặt"
                    size="small"
                    sx={{
                        bgcolor: 'rgba(255,255,255,0.15)',
                        color: 'white',
                        fontSize: '0.75rem',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                    }}
                    clickable
                    onClick={() => navigate('/my-bookings')}
                />
                <Chip
                    icon={<FavoriteIcon sx={{ color: 'white !important', fontSize: '1rem' }} />}
                    label="Yêu thích"
                    size="small"
                    sx={{
                        bgcolor: 'rgba(255,255,255,0.15)',
                        color: 'white',
                        fontSize: '0.75rem',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                    }}
                    clickable
                />
            </Box>
        </AppBar>
    );
};

export default AppHeader;
