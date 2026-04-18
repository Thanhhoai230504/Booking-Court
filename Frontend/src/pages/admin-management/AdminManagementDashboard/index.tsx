import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Avatar,
  Grid,
  Chip,
} from '@mui/material';
import {
  SupervisorAccount as OwnersIcon,
  People as CustomersIcon,
  SportsTennis as CourtsIcon,
  EventNote as BookingsIcon,
  TrendingUp as RevenueIcon,
  LocalCafe as DrinkRevIcon,
  Assessment as SystemIcon,
} from '@mui/icons-material';
import adminManagementService, { SystemDashboard } from '../../../services/adminManagementService';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const AdminManagementDashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<SystemDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await adminManagementService.getSystemDashboard();
        setDashboard(data);
      } catch (error) {
        console.error('Failed to fetch system dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress size={40} sx={{ color: '#e65100' }} />
      </Box>
    );
  }

  const statCards = [
    { label: 'Tổng chủ sân', value: dashboard?.totalOwners || 0, icon: OwnersIcon, gradient: 'linear-gradient(135deg, #1565c0, #42a5f5)', shadow: 'rgba(21,101,192,0.35)', isCurrency: false },
    { label: 'Tổng khách hàng', value: dashboard?.totalCustomers || 0, icon: CustomersIcon, gradient: 'linear-gradient(135deg, #6a1b9a, #ab47bc)', shadow: 'rgba(106,27,154,0.35)', isCurrency: false },
    { label: 'Tổng số sân', value: dashboard?.totalCourts || 0, icon: CourtsIcon, gradient: 'linear-gradient(135deg, #006837, #4CAF50)', shadow: 'rgba(0,104,55,0.35)', isCurrency: false },
    { label: 'Tổng booking', value: dashboard?.totalBookings || 0, icon: BookingsIcon, gradient: 'linear-gradient(135deg, #00695c, #26a69a)', shadow: 'rgba(0,105,92,0.35)', isCurrency: false },
    { label: 'Tổng doanh thu', value: dashboard?.totalRevenue || 0, icon: RevenueIcon, gradient: 'linear-gradient(135deg, #e65100, #ff6d00)', shadow: 'rgba(230,81,0,0.35)', isCurrency: true },
    { label: 'DT Sân', value: dashboard?.courtRevenue || 0, icon: SystemIcon, gradient: 'linear-gradient(135deg, #2e7d32, #66bb6a)', shadow: 'rgba(46,125,50,0.35)', isCurrency: true },
    { label: 'DT Đồ uống', value: dashboard?.drinkRevenue || 0, icon: DrinkRevIcon, gradient: 'linear-gradient(135deg, #bf360c, #ff7043)', shadow: 'rgba(191,54,12,0.35)', isCurrency: true },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.2 }}>
          Tổng quan hệ thống
        </Typography>
        <Typography color="text.secondary" fontSize="0.85rem" mt={0.3}>
          Dashboard quản lý toàn bộ hệ thống Pickleball
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {statCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={idx < 4 ? 3 : 4} key={card.label}>
            <Paper
              sx={{
                p: 2.5,
                borderRadius: '16px',
                background: card.gradient,
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 8px 25px ${card.shadow}`,
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'translateY(-3px)' },
              }}
            >
              <Box sx={{ position: 'absolute', top: -15, right: -15, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>
                  <card.icon sx={{ fontSize: 22 }} />
                </Avatar>
              </Box>
              <Typography variant="h5" fontWeight={800} sx={{ fontSize: card.isCurrency ? '1.4rem' : '1.8rem', letterSpacing: '-0.5px' }}>
                {card.isCurrency ? formatCurrency(card.value) : card.value}
              </Typography>
              <Typography fontSize="0.82rem" sx={{ opacity: 0.85, mt: 0.3, fontWeight: 500 }}>
                {card.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Revenue by Owner */}
      <Paper sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <Box sx={{ p: 2.5, borderBottom: '1px solid #f0f0f0' }}>
          <Typography fontWeight={700} fontSize="1.05rem">Doanh thu theo chủ sân</Typography>
          <Typography color="text.secondary" fontSize="0.78rem">Xếp hạng theo tổng doanh thu</Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          {!dashboard?.revenueByOwner?.length ? (
            <Typography color="text.secondary" textAlign="center" py={3}>Chưa có dữ liệu</Typography>
          ) : (
            dashboard.revenueByOwner.map((item, idx) => (
              <Box
                key={item._id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  borderRadius: '12px',
                  mb: 1,
                  background: idx === 0 ? 'linear-gradient(135deg, #fff8e1, #ffecb3)' : '#f8f9fa',
                  transition: 'background 0.15s',
                  '&:hover': { background: idx === 0 ? 'linear-gradient(135deg, #fff8e1, #ffecb3)' : '#f0f2f5' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    label={`#${idx + 1}`}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      background: idx === 0 ? '#ff6d00' : idx === 1 ? '#78909c' : '#a1887f',
                      color: '#fff',
                    }}
                  />
                  <Box>
                    <Typography fontWeight={600} fontSize="0.9rem">{item.ownerDetails?.name || 'N/A'}</Typography>
                    <Typography color="text.secondary" fontSize="0.78rem">{item.ownerDetails?.email}</Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography fontWeight={700} color="#e65100" fontSize="0.95rem">
                    {formatCurrency(item.totalRevenue)}
                  </Typography>
                  <Typography color="text.secondary" fontSize="0.75rem">
                    {item.transactionCount} giao dịch
                  </Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminManagementDashboard;
