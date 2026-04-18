import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  Chip,
  Avatar,
  Grid,
} from '@mui/material';
import {
  TrendingUp as RevenueIcon,
  SportsTennis as CourtRevIcon,
  LocalCafe as DrinkRevIcon,
  Receipt as TransIcon,
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../../../store/store';
import { fetchDashboard } from '../../../store/slices/adminSlice';
import dayjs from 'dayjs';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const statCards = [
  {
    key: 'totalRevenue',
    label: 'Tổng doanh thu',
    icon: RevenueIcon,
    gradient: 'linear-gradient(135deg, #006837 0%, #2e7d32 50%, #43a047 100%)',
    shadow: 'rgba(0,104,55,0.35)',
    isCurrency: true,
  },
  {
    key: 'courtRevenue',
    label: 'Doanh thu sân',
    icon: CourtRevIcon,
    gradient: 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #42a5f5 100%)',
    shadow: 'rgba(21,101,192,0.35)',
    isCurrency: true,
  },
  {
    key: 'drinkRevenue',
    label: 'Doanh thu đồ uống',
    icon: DrinkRevIcon,
    gradient: 'linear-gradient(135deg, #e65100 0%, #ef6c00 50%, #ff9800 100%)',
    shadow: 'rgba(230,81,0,0.35)',
    isCurrency: true,
  },
  {
    key: 'transactionCount',
    label: 'Số giao dịch',
    icon: TransIcon,
    gradient: 'linear-gradient(135deg, #6a1b9a 0%, #7b1fa2 50%, #ab47bc 100%)',
    shadow: 'rgba(106,27,154,0.35)',
    isCurrency: false,
  },
];

const statusConfig: Record<string, { label: string; color: 'warning' | 'info' | 'primary' | 'success' | 'error' }> = {
  PENDING_APPROVAL: { label: 'Chờ duyệt', color: 'warning' },
  CONFIRMED: { label: 'Đã duyệt', color: 'info' },
  PLAYING: { label: 'Đang chơi', color: 'primary' },
  COMPLETED: { label: 'Hoàn thành', color: 'success' },
  CANCELLED: { label: 'Đã hủy', color: 'error' },
};

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { dashboard, isLoading } = useSelector((state: RootState) => state.admin);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const adminId = user?._id || user?.id || '';

  useEffect(() => {
    if (adminId) {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      dispatch(fetchDashboard({ adminId, params }));
    }
  }, [dispatch, adminId, startDate, endDate]);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.2 }}>
            Dashboard
          </Typography>
          <Typography color="text.secondary" fontSize="0.85rem" mt={0.3}>
            Tổng quan hoạt động kinh doanh
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
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '10px' },
            }}
          />
          <TextField
            label="Đến ngày"
            type="date"
            size="small"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '10px' },
            }}
          />
        </Box>
      </Box>

      {/* Stat Cards */}
      {isLoading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={40} sx={{ color: '#006837' }} />
        </Box>
      ) : (
        <>
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
                    {/* Background decoration */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -15,
                        right: -15,
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.12)',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.08)',
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <Avatar
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.2)',
                          width: 40,
                          height: 40,
                        }}
                      >
                        <card.icon sx={{ fontSize: 22 }} />
                      </Avatar>
                    </Box>
                    <Typography
                      variant="h5"
                      fontWeight={800}
                      sx={{
                        fontSize: card.isCurrency ? '1.4rem' : '1.8rem',
                        letterSpacing: '-0.5px',
                      }}
                    >
                      {card.isCurrency ? formatCurrency(value) : value}
                    </Typography>
                    <Typography
                      fontSize="0.82rem"
                      sx={{ opacity: 0.85, mt: 0.3, fontWeight: 500 }}
                    >
                      {card.label}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>

          {/* Recent Transactions */}
          <Paper sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <Box sx={{ p: 2.5, borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography fontWeight={700} fontSize="1.05rem">Giao dịch gần đây</Typography>
                <Typography color="text.secondary" fontSize="0.78rem">10 giao dịch doanh thu gần nhất</Typography>
              </Box>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)' }}>
                    {['Mã booking', 'Sân', 'DT Sân', 'Ngày', 'Tổng DT', 'DT Đồ uống'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: '#495057', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!dashboard?.revenues?.length ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        Chưa có giao dịch
                      </TableCell>
                    </TableRow>
                  ) : (
                    dashboard.revenues.slice(0, 10).map((tx: any) => (
                      <TableRow
                        key={tx._id}
                        hover
                        sx={{ '&:hover': { background: '#f8fffe' }, transition: 'background 0.15s' }}
                      >
                        <TableCell>
                          <Chip
                            label={tx.bookingId?.bookingNumber || 'N/A'}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              fontSize: '0.73rem',
                              background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
                              color: '#2e7d32',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={500} fontSize="0.85rem">
                            {tx.courtId?.name || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontSize="0.85rem">
                            {formatCurrency(tx.courtRevenue)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontSize="0.85rem">{dayjs(tx.date).format('DD/MM/YYYY')}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={700} color="#006837" fontSize="0.85rem">
                            {formatCurrency(tx.totalRevenue)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontSize="0.85rem" color="text.secondary">
                            {formatCurrency(tx.drinkRevenue)}
                          </Typography>
                        </TableCell>
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

export default AdminDashboard;
