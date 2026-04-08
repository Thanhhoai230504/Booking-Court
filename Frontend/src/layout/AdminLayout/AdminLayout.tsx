import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  SportsTennis as CourtsIcon,
  EventNote as BookingsIcon,
  LocalCafe as DrinksIcon,
  BarChart as RevenueIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  SupervisorAccount as OwnersIcon,
  People as CustomersIcon,
  Assessment as SystemRevenueIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';

const DRAWER_WIDTH = 260;

// Menu cho owner (chủ sân) - giống admin cũ
const ownerMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Quản lý Sân', icon: <CourtsIcon />, path: '/admin/courts' },
  { text: 'Quản lý Đặt sân', icon: <BookingsIcon />, path: '/admin/bookings' },
  { text: 'Quản lý Đồ uống', icon: <DrinksIcon />, path: '/admin/drinks' },
  { text: 'Báo cáo Doanh thu', icon: <RevenueIcon />, path: '/admin/revenue' },
];

// Menu cho admin (quản lý hệ thống)
const adminMenuItems = [
  { text: 'Tổng quan hệ thống', icon: <AdminIcon />, path: '/admin-management' },
  { text: 'Quản lý Chủ sân', icon: <OwnersIcon />, path: '/admin-management/owners' },
  { text: 'Quản lý Khách hàng', icon: <CustomersIcon />, path: '/admin-management/customers' },
  { text: 'Doanh thu hệ thống', icon: <SystemRevenueIcon />, path: '/admin-management/revenue' },
];

const AdminLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const isAdmin = user?.role === 'admin';
  const menuItems = isAdmin ? adminMenuItems : ownerMenuItems;
  const allMenuItems = isAdmin ? adminMenuItems : ownerMenuItems;

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleMenuClick = (path: string) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid',
          borderColor: 'rgba(255,255,255,0.08)',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: isAdmin
              ? 'linear-gradient(135deg, #e65100, #ff6d00)'
              : 'linear-gradient(135deg, #4CAF50, #006837)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isAdmin ? (
            <AdminIcon sx={{ color: '#fff', fontSize: 22 }} />
          ) : (
            <CourtsIcon sx={{ color: '#fff', fontSize: 22 }} />
          )}
        </Box>
        <Box>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.2 }}>
            Pickleball
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
            {isAdmin ? 'System Admin' : 'Owner Panel'}
          </Typography>
        </Box>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1.5, py: 2 }}>
        {/* Admin: hiện cả 2 nhóm menu */}
        {isAdmin && (
          <>
            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', fontWeight: 700, px: 2, py: 0.5, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Quản lý hệ thống
            </Typography>
            {adminMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItemButton
                  key={item.path}
                  onClick={() => handleMenuClick(item.path)}
                  sx={{
                    borderRadius: '10px',
                    mb: 0.5,
                    py: 1.2,
                    px: 2,
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                    background: isActive
                      ? 'linear-gradient(135deg, #e65100, #ff6d00)'
                      : 'transparent',
                    boxShadow: isActive ? '0 4px 15px rgba(230,81,0,0.4)' : 'none',
                    '&:hover': {
                      background: isActive
                        ? 'linear-gradient(135deg, #e65100, #ff6d00)'
                        : 'rgba(255,255,255,0.06)',
                      color: '#fff',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400,
                      fontSize: '0.9rem',
                    }}
                  />
                </ListItemButton>
              );
            })}
          </>
        )}

        {/* Owner: chỉ hiện menu owner */}
        {!isAdmin && ownerMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              onClick={() => handleMenuClick(item.path)}
              sx={{
                borderRadius: '10px',
                mb: 0.5,
                py: 1.2,
                px: 2,
                color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                background: isActive
                  ? 'linear-gradient(135deg, #006837, #4CAF50)'
                  : 'transparent',
                boxShadow: isActive ? '0 4px 15px rgba(0,104,55,0.4)' : 'none',
                '&:hover': {
                  background: isActive
                    ? 'linear-gradient(135deg, #006837, #4CAF50)'
                    : 'rgba(255,255,255,0.06)',
                  color: '#fff',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.9rem',
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Back to app */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <ListItemButton
          onClick={() => navigate('/')}
          sx={{
            borderRadius: '10px',
            color: 'rgba(255,255,255,0.5)',
            py: 1,
            '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.06)' },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <ArrowBackIcon />
          </ListItemIcon>
          <ListItemText
            primary="Về trang chính"
            primaryTypographyProps={{ fontSize: '0.85rem' }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f0f2f5' }}>
      {/* Sidebar */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
              border: 'none',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
              border: 'none',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Main content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: '#fff',
            borderBottom: '1px solid #e8e8e8',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isMobile && (
                <IconButton onClick={handleDrawerToggle} sx={{ color: '#333' }}>
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h6" sx={{ color: '#333', fontWeight: 600 }}>
                {allMenuItems.find((item) => item.path === location.pathname)?.text || (isAdmin ? 'Admin' : 'Owner')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: isAdmin ? '#e65100' : '#006837',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  sx: { mt: 1, minWidth: 180, borderRadius: '12px' },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography fontWeight={600} fontSize="0.95rem">
                    {user?.name}
                  </Typography>
                  <Typography color="text.secondary" fontSize="0.8rem">
                    {user?.email}
                  </Typography>
                  <Typography color="text.secondary" fontSize="0.7rem" sx={{ mt: 0.3, textTransform: 'uppercase', fontWeight: 600, color: isAdmin ? '#e65100' : '#006837' }}>
                    {isAdmin ? 'Admin' : 'Owner'}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={() => { setAnchorEl(null); navigate('/account'); }}>
                  <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                  Tài khoản
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
                  Đăng xuất
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 2, md: 3 },
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
