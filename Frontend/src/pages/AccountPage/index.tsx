import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Avatar,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Chip,
} from '@mui/material';
import {
    PersonRounded as PersonIcon,
    CalendarMonthRounded as BookingIcon,
    FavoriteBorderRounded as FavIcon,
    SettingsRounded as SettingsIcon,
    HelpOutlineRounded as HelpIcon,
    InfoOutlined as InfoIcon,
    LogoutRounded as LogoutIcon,
    ChevronRightRounded as ArrowIcon,
    SportsTennisRounded as LogoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { fetchMyBookings } from '../../store/slices/bookingSlice';
import EditProfileDialog from '../../components/EditProfileDialog';

const AccountPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { bookings } = useSelector((state: RootState) => state.bookings);
    const { favoriteIds } = useSelector((state: RootState) => state.favorites);
    const [editProfileOpen, setEditProfileOpen] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchMyBookings());
        }
    }, [dispatch, isAuthenticated]);

    const activeBookings = bookings.filter(
        (b) => ['PENDING_APPROVAL', 'CONFIRMED'].includes(b.status)
    );

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    // Nếu chưa đăng nhập, chuyển hướng đến trang login
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    if (!user) return null;

    const menuItems = [
        {
            icon: <PersonIcon />,
            label: 'Thông tin cá nhân',
            subtitle: 'Chỉnh sửa hồ sơ',
            onClick: () => setEditProfileOpen(true),
        },
        {
            icon: <BookingIcon />,
            label: 'Sân đã đặt',
            subtitle: `${activeBookings.length} đơn đang hoạt động`,
            badge: activeBookings.length,
            onClick: () => navigate('/my-bookings'),
        },
        {
            icon: <FavIcon />,
            label: 'Sân yêu thích',
            subtitle: `${favoriteIds.length} sân đã lưu`,
            badge: favoriteIds.length > 0 ? favoriteIds.length : undefined,
            onClick: () => navigate('/favorites'),
        },
    ];

    const settingsItems = [
        {
            icon: <SettingsIcon />,
            label: 'Cài đặt',
            onClick: () => { },
        },
        {
            icon: <HelpIcon />,
            label: 'Trợ giúp & Hỗ trợ',
            onClick: () => { },
        },
        {
            icon: <InfoIcon />,
            label: 'Về ứng dụng',
            subtitle: 'Phiên bản 1.0.0',
            onClick: () => { },
        },
    ];

    return (
        <>
            {/* Profile header */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #004D28 0%, #006D38 60%, #00894A 100%)',
                    px: 3,
                    pt: 4,
                    pb: 5,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -40,
                        right: -40,
                        width: 150,
                        height: 150,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)',
                    },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        sx={{
                            width: 64,
                            height: 64,
                            bgcolor: 'rgba(255,255,255,0.2)',
                            border: '2px solid rgba(255,255,255,0.3)',
                            fontSize: '1.5rem',
                            fontWeight: 700,
                        }}
                    >
                        {user.name.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                            {user.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {user.email}
                        </Typography>
                        <Chip
                            label={user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                            size="small"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.15)',
                                color: 'white',
                                fontSize: '0.65rem',
                                height: 22,
                                mt: 0.5,
                            }}
                        />
                    </Box>
                </Box>
            </Box>

            <Box sx={{ px: 2, mt: -3, position: 'relative', pb: 4 }}>
                {/* Stats */}
                <Paper sx={{ borderRadius: 3, p: 2, mb: 2, display: 'flex', justifyContent: 'space-around' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#006D38' }}>
                            {bookings.length}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Tổng đặt sân
                        </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#D4A017' }}>
                            {activeBookings.length}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Đang hoạt động
                        </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E88E5' }}>
                            {favoriteIds.length}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Yêu thích
                        </Typography>
                    </Box>
                </Paper>

                {/* Menu items */}
                <Paper sx={{ borderRadius: 3, mb: 2, overflow: 'hidden' }}>
                    <List disablePadding>
                        {menuItems.map((item, i) => (
                            <React.Fragment key={i}>
                                <ListItemButton onClick={item.onClick} sx={{ py: 1.5 }}>
                                    <ListItemIcon sx={{ minWidth: 40, color: '#006D38' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {item.label}
                                            </Typography>
                                        }
                                        secondary={item.subtitle}
                                        secondaryTypographyProps={{ variant: 'caption' }}
                                    />
                                    {item.badge ? (
                                        <Chip
                                            label={item.badge}
                                            size="small"
                                            sx={{
                                                bgcolor: '#E8F5E9',
                                                color: '#2E7D32',
                                                fontWeight: 700,
                                                height: 24,
                                                mr: 0.5,
                                            }}
                                        />
                                    ) : null}
                                    <ArrowIcon sx={{ color: '#ccc', fontSize: '1.2rem' }} />
                                </ListItemButton>
                                {i < menuItems.length - 1 && <Divider variant="inset" />}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>

                {/* Settings */}
                <Paper sx={{ borderRadius: 3, mb: 2, overflow: 'hidden' }}>
                    <List disablePadding>
                        {settingsItems.map((item, i) => (
                            <React.Fragment key={i}>
                                <ListItemButton onClick={item.onClick} sx={{ py: 1.5 }}>
                                    <ListItemIcon sx={{ minWidth: 40, color: '#666' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {item.label}
                                            </Typography>
                                        }
                                        secondary={item.subtitle}
                                        secondaryTypographyProps={{ variant: 'caption' }}
                                    />
                                    <ArrowIcon sx={{ color: '#ccc', fontSize: '1.2rem' }} />
                                </ListItemButton>
                                {i < settingsItems.length - 1 && <Divider variant="inset" />}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>

                {/* Logout */}
                <Paper sx={{ borderRadius: 3, mb: 2, overflow: 'hidden' }}>
                    <ListItemButton onClick={handleLogout} sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 40, color: '#E53935' }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#E53935' }}>
                                    Đăng xuất
                                </Typography>
                            }
                        />
                    </ListItemButton>
                </Paper>

                {/* App version */}
                <Box sx={{ textAlign: 'center', py: 2 }}>
                    <LogoIcon sx={{ color: '#ccc', fontSize: 32 }} />
                    <Typography variant="caption" sx={{ display: 'block', color: '#ccc', mt: 0.5 }}>
                        Pickleball Booking v1.0.0
                    </Typography>
                </Box>
            </Box>

            {/* Edit Profile Dialog */}
            <EditProfileDialog open={editProfileOpen} onClose={() => setEditProfileOpen(false)} />
        </>
    );
};

export default AccountPage;
