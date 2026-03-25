import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import {
  SportsTennis,
  Phone,
  Email,
  LocationOn,
  Facebook,
  YouTube,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: 'white',
        pt: 6,
        pb: 3,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <SportsTennis sx={{ fontSize: 36, color: '#4CAF50' }} />
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  PICKLEBALL
                </Typography>
                <Typography fontSize="0.65rem" sx={{ opacity: 0.7, letterSpacing: '0.15em' }}>
                  BOOKING SYSTEM
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.7, lineHeight: 1.8, mb: 2 }}>
              Hệ thống đặt sân Pickleball trực tuyến hàng đầu. Tìm và đặt sân dễ dàng,
              nhanh chóng với nhiều lựa chọn đa dạng.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: '#1877F2' } }}>
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: '#FF0000' } }}>
                <YouTube fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, fontSize: '1rem' }}>
              Liên kết nhanh
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { label: 'Trang chủ', path: '/' },
                { label: 'Tìm sân', path: '/' },
                { label: 'Đặt sân', path: '/my-bookings' },
                { label: 'Đăng nhập', path: '/login' },
                { label: 'Đăng ký', path: '/signup' },
              ].map((link) => (
                <Typography
                  key={link.path + link.label}
                  component={Link}
                  to={link.path}
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: '#4CAF50',
                      paddingLeft: '8px',
                    },
                  }}
                >
                  {link.label}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, fontSize: '1rem' }}>
              Liên hệ
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Phone sx={{ fontSize: 18, color: '#4CAF50' }} />
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  0901 234 567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Email sx={{ fontSize: 18, color: '#4CAF50' }} />
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  info@pickleballbooking.vn
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                <LocationOn sx={{ fontSize: 18, color: '#4CAF50' }} />
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  TP. Hồ Chí Minh, Việt Nam
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 3 }} />

        <Typography
          variant="body2"
          align="center"
          sx={{ opacity: 0.5, fontSize: '0.8rem' }}
        >
          © {new Date().getFullYear()} Pickleball Booking. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
