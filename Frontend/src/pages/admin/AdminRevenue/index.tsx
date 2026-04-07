import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Tabs,
  Tab,
  Avatar,
} from '@mui/material';
import {
  BarChart as ChartIcon,
  CalendarMonth as DateIcon,
  DateRange as MonthIcon,
  SportsTennis as CourtIcon,
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../../../store/store';
import {
  fetchRevenueByDate,
  fetchRevenueByMonth,
  fetchRevenueByCourt,
} from '../../../store/slices/adminSlice';
import dayjs from 'dayjs';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const tabIcons = [<DateIcon />, <MonthIcon />, <CourtIcon />];

const AdminRevenue: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { revenueByDate, revenueByMonth, revenueByCourt, isLoading } = useSelector(
    (state: RootState) => state.admin
  );
  const [tabValue, setTabValue] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear()));

  const adminId = user?._id || user?.id || '';

  useEffect(() => {
    if (!adminId) return;
    if (tabValue === 0) {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      dispatch(fetchRevenueByDate({ adminId, params }));
    } else if (tabValue === 1) {
      dispatch(fetchRevenueByMonth({ adminId, params: year ? { year } : undefined }));
    } else {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      dispatch(fetchRevenueByCourt({ adminId, params }));
    }
  }, [dispatch, adminId, tabValue, startDate, endDate, year]);

  // Calculate totals
  const totalRevenue =
    tabValue === 0
      ? revenueByDate.reduce((s, r) => s + r.totalRevenue, 0)
      : tabValue === 1
        ? revenueByMonth.reduce((s, r) => s + r.totalRevenue, 0)
        : revenueByCourt.reduce((s, r) => s + r.totalRevenue, 0);

  const totalCourt =
    tabValue === 0
      ? revenueByDate.reduce((s, r) => s + r.courtRevenue, 0)
      : tabValue === 1
        ? revenueByMonth.reduce((s, r) => s + r.courtRevenue, 0)
        : revenueByCourt.reduce((s, r) => s + r.courtRevenue, 0);

  const totalDrink =
    tabValue === 0
      ? revenueByDate.reduce((s, r) => s + r.drinkRevenue, 0)
      : tabValue === 1
        ? revenueByMonth.reduce((s, r) => s + r.drinkRevenue, 0)
        : revenueByCourt.reduce((s, r) => s + r.drinkRevenue, 0);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Avatar sx={{ bgcolor: '#1565c0', width: 44, height: 44 }}>
          <ChartIcon />
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.2 }}>
            Báo cáo Doanh thu
          </Typography>
          <Typography color="text.secondary" fontSize="0.85rem">
            Phân tích doanh thu theo ngày, tháng, sân
          </Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper
        sx={{
          borderRadius: '16px',
          mb: 3,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}
      >
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          sx={{
            px: 1,
            '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', minHeight: 52, fontSize: '0.9rem' },
            '& .Mui-selected': { color: '#1565c0' },
            '& .MuiTabs-indicator': { backgroundColor: '#1565c0', height: 3, borderRadius: '3px 3px 0 0' },
          }}
        >
          <Tab icon={<DateIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Theo ngày" />
          <Tab icon={<MonthIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Theo tháng" />
          <Tab icon={<CourtIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Theo sân" />
        </Tabs>
      </Paper>

      {/* Filters */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography fontWeight={600} color="text.secondary" fontSize="0.85rem" sx={{ mr: 1 }}>
            🔍 Bộ lọc
          </Typography>
          {tabValue === 1 ? (
            <TextField
              label="Năm"
              type="number"
              size="small"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              sx={{ minWidth: 120, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          ) : (
            <>
              <TextField
                label="Từ ngày"
                type="date"
                size="small"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 180, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
              <TextField
                label="Đến ngày"
                type="date"
                size="small"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 180, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </>
          )}
        </Box>
      </Paper>

      {/* Table */}
      <Paper sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)' }}>
                {[
                  tabValue === 0 ? 'Ngày' : tabValue === 1 ? 'Tháng' : 'Sân',
                  'DT Sân',
                  'DT Đồ uống',
                  'Tổng DT',
                  'Số GD',
                ].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 700, color: '#495057', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={36} sx={{ color: '#1565c0' }} />
                    <Typography color="text.secondary" mt={1} fontSize="0.85rem">Đang tải...</Typography>
                  </TableCell>
                </TableRow>
              ) : tabValue === 0 ? (
                !revenueByDate.length ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                      <ChartIcon sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                      <Typography color="text.secondary">Chưa có dữ liệu</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  revenueByDate.map((row) => (
                    <TableRow key={row._id} hover sx={{ '&:hover': { background: '#f0f7ff' }, transition: 'background 0.15s' }}>
                      <TableCell>
                        <Typography fontWeight={600} fontSize="0.9rem">{dayjs(row._id).format('DD/MM/YYYY')}</Typography>
                      </TableCell>
                      <TableCell>{formatCurrency(row.courtRevenue)}</TableCell>
                      <TableCell>{formatCurrency(row.drinkRevenue)}</TableCell>
                      <TableCell>
                        <Typography fontWeight={700} color="#006837">{formatCurrency(row.totalRevenue)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={500} sx={{ bgcolor: '#e3f2fd', display: 'inline-block', px: 1.5, py: 0.3, borderRadius: '8px', fontSize: '0.85rem' }}>
                          {row.transactionCount}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )
              ) : tabValue === 1 ? (
                !revenueByMonth.length ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                      <ChartIcon sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                      <Typography color="text.secondary">Chưa có dữ liệu</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  revenueByMonth.map((row) => {
                    const [y, m] = row._id.split('-');
                    return (
                      <TableRow key={row._id} hover sx={{ '&:hover': { background: '#f0f7ff' }, transition: 'background 0.15s' }}>
                        <TableCell>
                          <Typography fontWeight={600} fontSize="0.9rem">Tháng {m}/{y}</Typography>
                        </TableCell>
                        <TableCell>{formatCurrency(row.courtRevenue)}</TableCell>
                        <TableCell>{formatCurrency(row.drinkRevenue)}</TableCell>
                        <TableCell>
                          <Typography fontWeight={700} color="#006837">{formatCurrency(row.totalRevenue)}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={500} sx={{ bgcolor: '#e3f2fd', display: 'inline-block', px: 1.5, py: 0.3, borderRadius: '8px', fontSize: '0.85rem' }}>
                            {row.transactionCount}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )
              ) : !revenueByCourt.length ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <ChartIcon sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                    <Typography color="text.secondary">Chưa có dữ liệu</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                revenueByCourt.map((row) => (
                  <TableRow key={row._id} hover sx={{ '&:hover': { background: '#f0f7ff' }, transition: 'background 0.15s' }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: '#e8f5e9', color: '#2e7d32', borderRadius: '10px' }} variant="rounded">
                          <CourtIcon sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Box>
                          <Typography fontWeight={600} fontSize="0.9rem">{row.courtDetails?.name || 'N/A'}</Typography>
                          <Typography color="text.secondary" fontSize="0.75rem">{row.courtDetails?.address || ''}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{formatCurrency(row.courtRevenue)}</TableCell>
                    <TableCell>{formatCurrency(row.drinkRevenue)}</TableCell>
                    <TableCell>
                      <Typography fontWeight={700} color="#006837">{formatCurrency(row.totalRevenue)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={500} sx={{ bgcolor: '#e3f2fd', display: 'inline-block', px: 1.5, py: 0.3, borderRadius: '8px', fontSize: '0.85rem' }}>
                        {row.transactionCount}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Totals row */}
        {!isLoading && (
          <Box
            sx={{
              p: 2.5,
              borderTop: '2px solid #e9ecef',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
            }}
          >
            <Typography fontWeight={700} fontSize="0.95rem">Tổng cộng</Typography>
            <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography color="text.secondary" fontSize="0.72rem">DT Sân</Typography>
                <Typography fontWeight={600} fontSize="0.9rem">{formatCurrency(totalCourt)}</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography color="text.secondary" fontSize="0.72rem">DT Đồ uống</Typography>
                <Typography fontWeight={600} fontSize="0.9rem">{formatCurrency(totalDrink)}</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography color="text.secondary" fontSize="0.72rem">Tổng DT</Typography>
                <Typography fontWeight={800} fontSize="1.1rem" color="#006837">{formatCurrency(totalRevenue)}</Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AdminRevenue;
