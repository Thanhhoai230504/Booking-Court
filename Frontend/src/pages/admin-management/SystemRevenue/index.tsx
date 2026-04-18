import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  TextField,
  Grid,
  Avatar,
} from '@mui/material';
import {
  TrendingUp as RevenueIcon,
  SportsTennis as CourtRevIcon,
  LocalCafe as DrinkRevIcon,
  Receipt as TransIcon,
} from '@mui/icons-material';
import { RootState } from '../../../store/store';
import adminService from '../../../services/adminService';
import { DashboardData, RevenueByDate } from '../../../types';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const statCards = [
  { key: 'totalRevenue', label: 'Tổng doanh thu hệ thống', icon: RevenueIcon, gradient: 'linear-gradient(135deg, #e65100 0%, #ff6d00 100%)', shadow: 'rgba(230,81,0,0.35)' },
  { key: 'courtRevenue', label: 'Doanh thu sân', icon: CourtRevIcon, gradient: 'linear-gradient(135deg, #006837 0%, #4CAF50 100%)', shadow: 'rgba(0,104,55,0.35)' },
  { key: 'drinkRevenue', label: 'Doanh thu đồ uống', icon: DrinkRevIcon, gradient: 'linear-gradient(135deg, #bf360c 0%, #ff7043 100%)', shadow: 'rgba(191,54,12,0.35)' },
  { key: 'transactionCount', label: 'Số giao dịch', icon: TransIcon, gradient: 'linear-gradient(135deg, #6a1b9a 0%, #ab47bc 100%)', shadow: 'rgba(106,27,154,0.35)' },
];

const SystemRevenue: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [revenueByDate, setRevenueByDate] = useState<RevenueByDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const adminId = user?._id || user?.id || '';

  useEffect(() => {
    const fetchData = async () => {
      if (!adminId) return;
      setIsLoading(true);
      try {
        const params: any = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const [dashboardData, dateData] = await Promise.all([
          adminService.getDashboard(adminId, params),
          adminService.getRevenueByDate(adminId, params),
        ]);
        setDashboard(dashboardData);
        setRevenueByDate(dateData);
      } catch (error) {
        console.error('Failed to fetch revenue:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [adminId, startDate, endDate]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Doanh thu hệ thống</Typography>
          <Typography color="text.secondary" fontSize="0.85rem" mt={0.3}>
            Tổng hợp doanh thu toàn hệ thống
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <TextField
            label="Từ ngày"
            type="date"
            size="small"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />
          <TextField
            label="Đến ngày"
            type="date"
            size="small"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />
        </Box>
      </Box>

      {isLoading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={40} sx={{ color: '#e65100' }} />
        </Box>
      ) : (
        <>
          {/* Stat Cards */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {statCards.map((card) => {
              const value = (dashboard as any)?.[card.key] ?? 0;
              return (
                <Grid item xs={12} sm={6} md={3} key={card.key}>
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
                    <Typography variant="h5" fontWeight={800} sx={{ fontSize: card.key === 'transactionCount' ? '1.8rem' : '1.4rem' }}>
                      {card.key === 'transactionCount' ? value : formatCurrency(value)}
                    </Typography>
                    <Typography fontSize="0.82rem" sx={{ opacity: 0.85, mt: 0.3, fontWeight: 500 }}>
                      {card.label}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>

          {/* Revenue by Date Table */}
          <Paper sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <Box sx={{ p: 2.5, borderBottom: '1px solid #f0f0f0' }}>
              <Typography fontWeight={700} fontSize="1.05rem">Doanh thu theo ngày</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)' }}>
                    {['Ngày', 'Doanh thu sân', 'Doanh thu đồ uống', 'Tổng doanh thu', 'Số GD'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#495057' }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {revenueByDate.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        Chưa có dữ liệu doanh thu
                      </TableCell>
                    </TableRow>
                  ) : (
                    revenueByDate.map((item) => (
                      <TableRow key={item._id} hover>
                        <TableCell><Typography fontWeight={500} fontSize="0.85rem">{item._id}</Typography></TableCell>
                        <TableCell><Typography fontSize="0.85rem">{formatCurrency(item.courtRevenue)}</Typography></TableCell>
                        <TableCell><Typography fontSize="0.85rem">{formatCurrency(item.drinkRevenue)}</Typography></TableCell>
                        <TableCell><Typography fontWeight={700} color="#e65100" fontSize="0.85rem">{formatCurrency(item.totalRevenue)}</Typography></TableCell>
                        <TableCell><Typography fontSize="0.85rem">{item.transactionCount}</Typography></TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default SystemRevenue;
