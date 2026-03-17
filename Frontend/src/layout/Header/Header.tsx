import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Container,
  Badge,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  SportsTennis,
  Person,
  Login as LoginIcon,
  PersonAdd,
  Menu as MenuIcon,
  Home,
  CalendarMonth,
  Logout,
  BookOnline,
} from '@mui/icons-material';
import { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileDrawer, setMobileDrawer] = useState(false);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/');
  };

  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const navItems = [
    { label: 'Trang chủ', path: '/', icon: <Home /> },
    { label: 'Sân đã đặt', path: '/my-bookings', icon: <CalendarMonth />, auth: true },
  ];

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: 'linear-gradient(135deg, #006837 0%, #004D25 50%, #003318 100%)',
          boxShadow: '0 4px 20px rgba(0, 104, 55, 0.3)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 0 }, minHeight: { xs: 64, md: 72 } }}>
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={() => setMobileDrawer(true)}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                color: 'white',
                mr: 3,
              }}
            >
              <SportsTennis sx={{ fontSize: 36, color: '#4CAF50' }} />
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    lineHeight: 1.2,
                    letterSpacing: '-0.02em',
                  }}
                >
                  PICKLEBALL
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.65rem',
                    opacity: 0.8,
                    letterSpacing: '0.15em',
                    fontWeight: 500,
                  }}
                >
                  BOOKING
                </Typography>
              </Box>
            </Box>

            {/* Date display */}
            {!isMobile && (
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  opacity: 0.85,
                  fontWeight: 500,
                  mr: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <CalendarMonth sx={{ fontSize: 18 }} />
                {today}
              </Typography>
            )}

            {/* Desktop navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {navItems.map((item) => {
                  if (item.auth && !isAuthenticated) return null;
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={item.path}
                      component={Link}
                      to={item.path}
                      startIcon={item.icon}
                      sx={{
                        color: 'white',
                        fontWeight: isActive ? 700 : 500,
                        borderRadius: 2,
                        px: 2,
                        backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Box>
            )}

            <Box sx={{ flexGrow: isMobile ? 1 : 0 }} />

            {/* Auth buttons */}
            {!isAuthenticated ? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  startIcon={!isMobile ? <LoginIcon /> : undefined}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.5)',
                    fontSize: { xs: '0.8rem', md: '0.9rem' },
                    px: { xs: 2, md: 3 },
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Đăng nhập
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  startIcon={!isMobile ? <PersonAdd /> : undefined}
                  sx={{
                    backgroundColor: 'white',
                    color: '#006837',
                    fontWeight: 700,
                    fontSize: { xs: '0.8rem', md: '0.9rem' },
                    px: { xs: 2, md: 3 },
                    '&:hover': {
                      backgroundColor: '#E8F5E9',
                    },
                  }}
                >
                  Đăng ký
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={handleProfileClick} sx={{ p: 0.5 }}>
                  <Avatar
                    sx={{
                      bgcolor: '#4CAF50',
                      width: 38,
                      height: 38,
                      fontSize: '1rem',
                      fontWeight: 700,
                      border: '2px solid rgba(255,255,255,0.5)',
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                {!isMobile && (
                  <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>
                    {user?.name}
                  </Typography>
                )}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      borderRadius: 2,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      minWidth: 200,
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                    <Typography fontWeight={700}>{user?.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                  <MenuItem
                    onClick={() => { navigate('/my-bookings'); handleClose(); }}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemIcon><BookOnline sx={{ color: '#006837' }} /></ListItemIcon>
                    <ListItemText>Sân đã đặt</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: '#C62828' }}>
                    <ListItemIcon><Logout sx={{ color: '#C62828' }} /></ListItemIcon>
                    <ListItemText>Đăng xuất</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawer}
        onClose={() => setMobileDrawer(false)}
        PaperProps={{ sx: { width: 280, borderRadius: '0 16px 16px 0' } }}
      >
        <Box sx={{
          p: 3,
          background: 'linear-gradient(135deg, #006837, #004D25)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}>
          <SportsTennis sx={{ fontSize: 32 }} />
          <Box>
            <Typography fontWeight={800} fontSize="1.2rem">PICKLEBALL</Typography>
            <Typography fontSize="0.7rem" sx={{ opacity: 0.8, letterSpacing: '0.1em' }}>
              BOOKING
            </Typography>
          </Box>
        </Box>
        <List sx={{ pt: 2 }}>
          {navItems.map((item) => {
            if (item.auth && !isAuthenticated) return null;
            return (
              <ListItem
                key={item.path}
                component={Link}
                to={item.path}
                onClick={() => setMobileDrawer(false)}
                sx={{
                  py: 1.5,
                  px: 3,
                  borderRadius: 2,
                  mx: 1,
                  mb: 0.5,
                  color: location.pathname === item.path ? '#006837' : 'text.primary',
                  backgroundColor: location.pathname === item.path ? '#E8F5E9' : 'transparent',
                  '&:hover': { backgroundColor: '#E8F5E9' },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </>
  );
};

export default Header;
