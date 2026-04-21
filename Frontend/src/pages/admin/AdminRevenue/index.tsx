import React, { useEffect, useState, useMemo } from 'react';
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
  Grid,
  Chip,
  Fade,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  BarChart as ChartIcon,
  CalendarMonth as DateIcon,
  DateRange as MonthIcon,
  SportsTennis as CourtIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalanceWallet as WalletIcon,
  LocalCafe as DrinkIcon,
  Receipt as ReceiptIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import { RootState, AppDispatch } from '../../../store/store';
import {
  fetchAdminCourts,
  fetchRevenueByDate,
  fetchRevenueByMonth,
  fetchRevenueByCourt,
} from '../../../store/slices/adminSlice';
import dayjs from 'dayjs';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const formatShortCurrency = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toString();
};

const COLORS = {
  primary: '#006837',
  blue: '#1565c0',
  orange: '#e65100',
  orangeLight: '#ff9800',
  purple: '#6a1b9a',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <Paper sx={{ p: 1.5, borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.06)' }}>
      <Typography fontWeight={700} fontSize="0.82rem" mb={0.5}>{label}</Typography>
      {payload.map((entry: any, i: number) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.3 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: entry.color }} />
          <Typography fontSize="0.78rem" color="text.secondary">
            {entry.name}: {formatCurrency(entry.value)}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
};

const AdminRevenue: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { courts, revenueByDate, revenueByMonth, revenueByCourt, isLoading } = useSelector(
    (state: RootState) => state.admin
  );

  const [tabValue, setTabValue] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [selectedCourtId, setSelectedCourtId] = useState(''); // '' = tất cả sân

  const adminId = user?._id || user?.id || '';

  // Fetch courts list for the dropdown
  useEffect(() => {
    if (adminId) dispatch(fetchAdminCourts(adminId));
  }, [dispatch, adminId]);

  // Fetch revenue data whenever filters change
  useEffect(() => {
    if (!adminId) return;
    const courtId = selectedCourtId || undefined;

    if (tabValue === 0) {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (courtId) params.courtId = courtId;
      dispatch(fetchRevenueByDate({ adminId, params }));
    } else if (tabValue === 1) {
      const params: any = { year };
      if (courtId) params.courtId = courtId;
      dispatch(fetchRevenueByMonth({ adminId, params }));
    } else {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (courtId) params.courtId = courtId;
      dispatch(fetchRevenueByCourt({ adminId, params }));
    }
  }, [dispatch, adminId, tabValue, startDate, endDate, year, selectedCourtId]);

  // ── Totals ──────────────────────────────────────────────────────────────────
  const { totalRevenue, totalCourt, totalDrink, totalTransactions } = useMemo(() => {
    const data = tabValue === 0 ? revenueByDate : tabValue === 1 ? revenueByMonth : revenueByCourt;
    return {
      totalRevenue:      data.reduce((s, r) => s + r.totalRevenue, 0),
      totalCourt:        data.reduce((s, r) => s + r.courtRevenue, 0),
      totalDrink:        data.reduce((s, r) => s + r.drinkRevenue, 0),
      totalTransactions: data.reduce((s, r) => s + r.transactionCount, 0),
    };
  }, [tabValue, revenueByDate, revenueByMonth, revenueByCourt]);

  // ── Chart data ──────────────────────────────────────────────────────────────
  const chartData = useMemo(() => {
    if (tabValue === 0) {
      return [...revenueByDate]
        .sort((a, b) => a._id.localeCompare(b._id))
        .map((r) => ({
          name: dayjs(r._id).format('DD/MM'),
          'DT Sân': r.courtRevenue,
          'DT Đồ uống': r.drinkRevenue,
        }));
    }
    if (tabValue === 1) {
      return [...revenueByMonth]
        .sort((a, b) => a._id.localeCompare(b._id))
        .map((r) => {
          const [, m] = r._id.split('-');
          return { name: `T${m}`, 'DT Sân': r.courtRevenue, 'DT Đồ uống': r.drinkRevenue };
        });
    }
    // Theo sân: each bar = court name + court number
    return revenueByCourt.map((r) => ({
      name: `${r.courtDetails?.name || 'N/A'} - Sân ${(r._id.courtNumber ?? 0) + 1}`,
      'DT Sân': r.courtRevenue,
      'DT Đồ uống': r.drinkRevenue,
    }));
  }, [tabValue, revenueByDate, revenueByMonth, revenueByCourt]);

  const pieData = useMemo(() => {
    if (totalCourt === 0 && totalDrink === 0) return [];
    return [
      { name: 'Doanh thu sân', value: totalCourt },
      { name: 'Doanh thu đồ uống', value: totalDrink },
    ];
  }, [totalCourt, totalDrink]);

  const hasData = chartData.length > 0;

  const statCards = [
    { label: 'Tổng doanh thu', value: totalRevenue, icon: TrendingUpIcon, gradient: 'linear-gradient(135deg, #006837 0%, #2e7d32 50%, #43a047 100%)', shadow: 'rgba(0,104,55,0.3)', isCurrency: true },
    { label: 'Doanh thu sân', value: totalCourt, icon: WalletIcon, gradient: 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #42a5f5 100%)', shadow: 'rgba(21,101,192,0.3)', isCurrency: true },
    { label: 'Doanh thu đồ uống', value: totalDrink, icon: DrinkIcon, gradient: 'linear-gradient(135deg, #e65100 0%, #ef6c00 50%, #ff9800 100%)', shadow: 'rgba(230,81,0,0.3)', isCurrency: true },
    { label: 'Số giao dịch', value: totalTransactions, icon: ReceiptIcon, gradient: 'linear-gradient(135deg, #6a1b9a 0%, #7b1fa2 50%, #ab47bc 100%)', shadow: 'rgba(106,27,154,0.3)', isCurrency: false },
  ];

  return (
    <Box>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Avatar sx={{ bgcolor: COLORS.primary, width: 48, height: 48, boxShadow: '0 4px 14px rgba(0,104,55,0.3)' }}>
          <ChartIcon sx={{ fontSize: 26 }} />
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1.2, letterSpacing: '-0.3px' }}>
            Báo cáo Doanh thu
          </Typography>
          <Typography color="text.secondary" fontSize="0.85rem">
            Phân tích chi tiết doanh thu theo ngày, tháng và sân
          </Typography>
        </Box>
      </Box>

      {/* ── Stat Cards ─────────────────────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((card, idx) => (
          <Grid item xs={6} sm={6} md={3} key={idx}>
            <Fade in timeout={300 + idx * 150}>
              <Paper
                sx={{
                  p: 2.5, borderRadius: '16px', background: card.gradient, color: '#fff',
                  position: 'relative', overflow: 'hidden',
                  boxShadow: `0 8px 25px ${card.shadow}`,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 12px 30px ${card.shadow}` },
                }}
              >
                <Box sx={{ position: 'absolute', top: -15, right: -15, width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <Box sx={{ position: 'absolute', bottom: -20, left: -10, width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 38, height: 38, mb: 1.5 }}>
                  <card.icon sx={{ fontSize: 20 }} />
                </Avatar>
                <Typography fontWeight={800} sx={{ fontSize: card.isCurrency ? '1.2rem' : '1.6rem', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                  {isLoading ? '...' : card.isCurrency ? formatCurrency(card.value) : card.value}
                </Typography>
                <Typography fontSize="0.78rem" sx={{ opacity: 0.85, mt: 0.3, fontWeight: 500 }}>{card.label}</Typography>
              </Paper>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* ── Tabs + Filters ─────────────────────────────────────────────── */}
      <Paper sx={{ borderRadius: '16px', mb: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, px: 2.5, pt: 1 }}>
          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            sx={{
              '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', minHeight: 52, fontSize: '0.88rem' },
              '& .Mui-selected': { color: COLORS.primary },
              '& .MuiTabs-indicator': { backgroundColor: COLORS.primary, height: 3, borderRadius: '3px 3px 0 0' },
            }}
          >
            <Tab icon={<DateIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Theo ngày" />
            <Tab icon={<MonthIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Theo tháng" />
            <Tab icon={<CourtIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Theo sân" />
          </Tabs>

          {/* ── Filter controls ── */}
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', pb: 1, flexWrap: 'wrap' }}>
            {/* Court filter dropdown */}
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel sx={{ '&.Mui-focused': { color: COLORS.primary } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <FilterIcon sx={{ fontSize: 15 }} /> Lọc theo sân
                </Box>
              </InputLabel>
              <Select
                value={selectedCourtId}
                label="  Lọc theo sân"
                onChange={(e) => setSelectedCourtId(e.target.value)}
                sx={{
                  borderRadius: '10px',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary },
                }}
              >
                <MenuItem value="">
                  <em>Tất cả sân</em>
                </MenuItem>
                {courts.map((court) => (
                  <MenuItem key={court._id} value={court._id}>
                    <Box>
                      <Typography fontSize="0.85rem" fontWeight={600}>{court.name}</Typography>
                      <Typography fontSize="0.72rem" color="text.secondary" noWrap>{court.address}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Date / Year filters */}
            {tabValue === 1 ? (
              <TextField
                label="Năm" type="number" size="small" value={year}
                onChange={(e) => setYear(e.target.value)}
                sx={{ minWidth: 100, '& .MuiOutlinedInput-root': { borderRadius: '10px', '&.Mui-focused fieldset': { borderColor: COLORS.primary } }, '& .MuiInputLabel-root.Mui-focused': { color: COLORS.primary } }}
              />
            ) : (
              <>
                <TextField
                  label="Từ ngày" type="date" size="small" value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 155, '& .MuiOutlinedInput-root': { borderRadius: '10px', '&.Mui-focused fieldset': { borderColor: COLORS.primary } }, '& .MuiInputLabel-root.Mui-focused': { color: COLORS.primary } }}
                />
                <TextField
                  label="Đến ngày" type="date" size="small" value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 155, '& .MuiOutlinedInput-root': { borderRadius: '10px', '&.Mui-focused fieldset': { borderColor: COLORS.primary } }, '& .MuiInputLabel-root.Mui-focused': { color: COLORS.primary } }}
                />
              </>
            )}
          </Box>
        </Box>
      </Paper>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      {isLoading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={40} sx={{ color: COLORS.primary }} />
          <Typography color="text.secondary" mt={1.5} fontSize="0.85rem">Đang tải dữ liệu...</Typography>
        </Box>
      ) : !hasData ? (
        <Paper sx={{ borderRadius: '16px', py: 8, textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', mb: 3 }}>
          <ChartIcon sx={{ fontSize: 64, color: '#ddd', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" fontWeight={600}>Chưa có dữ liệu doanh thu</Typography>
          <Typography color="text.secondary" fontSize="0.85rem" mt={0.5}>
            Dữ liệu sẽ xuất hiện khi có đơn đặt sân được hoàn thành
          </Typography>
        </Paper>
      ) : (
        <>
          {/* ── Charts row ── */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} md={pieData.length > 0 ? 8 : 12}>
              <Paper sx={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                <Box sx={{ p: 2.5, borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography fontWeight={700} fontSize="1rem">📊 Biểu đồ doanh thu</Typography>
                    <Typography color="text.secondary" fontSize="0.78rem">
                      {tabValue === 0 ? 'Theo ngày' : tabValue === 1 ? `Theo tháng — Năm ${year}` : 'Theo sân'}
                      {selectedCourtId && courts.find(c => c._id === selectedCourtId) && (
                        <Chip label={courts.find(c => c._id === selectedCourtId)?.name} size="small" sx={{ ml: 1, bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600, fontSize: '0.7rem', height: 20 }} />
                      )}
                    </Typography>
                  </Box>
                  <Chip label={`${chartData.length} ${tabValue === 2 ? 'sân' : 'mục'}`} size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }} />
                </Box>
                <Box sx={{ px: 1, py: 2, height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    {tabValue === 1 ? (
                      <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                        <defs>
                          <linearGradient id="gCourt" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gDrink" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS.orange} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={COLORS.orange} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#888' }} axisLine={{ stroke: '#e0e0e0' }} />
                        <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={{ stroke: '#e0e0e0' }} tickFormatter={formatShortCurrency} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="DT Sân" stroke={COLORS.primary} strokeWidth={2.5} fillOpacity={1} fill="url(#gCourt)" />
                        <Area type="monotone" dataKey="DT Đồ uống" stroke={COLORS.orange} strokeWidth={2.5} fillOpacity={1} fill="url(#gDrink)" />
                      </AreaChart>
                    ) : (
                      <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: tabValue === 2 ? 40 : 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: tabValue === 2 ? 10 : 11, fill: '#888' }} axisLine={{ stroke: '#e0e0e0' }} angle={tabValue === 2 ? -30 : 0} textAnchor={tabValue === 2 ? 'end' : 'middle'} interval={0} />
                        <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={{ stroke: '#e0e0e0' }} tickFormatter={formatShortCurrency} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="DT Sân" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="DT Đồ uống" fill={COLORS.orangeLight} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Pie chart */}
            {pieData.length > 0 && (
              <Grid item xs={12} md={4}>
                <Paper sx={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 2.5, borderBottom: '1px solid #f0f0f0' }}>
                    <Typography fontWeight={700} fontSize="1rem">🥧 Tỷ lệ doanh thu</Typography>
                    <Typography color="text.secondary" fontSize="0.78rem">Sân vs Đồ uống</Typography>
                  </Box>
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', pb: 2 }}>
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="45%" innerRadius={55} outerRadius={88} paddingAngle={5} dataKey="value" stroke="none">
                          <Cell fill={COLORS.primary} />
                          <Cell fill={COLORS.orangeLight} />
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: '0.82rem' }} />
                        <Legend verticalAlign="bottom" iconType="circle" iconSize={10} formatter={(value: string) => <span style={{ fontSize: '0.8rem', color: '#555', fontWeight: 500 }}>{value}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                  <Box sx={{ px: 2.5, pb: 2.5 }}>
                    {[
                      { label: 'Sân', pct: totalRevenue > 0 ? ((totalCourt / totalRevenue) * 100).toFixed(1) : 0, color: COLORS.primary, bg: '#f8faf9' },
                      { label: 'Đồ uống', pct: totalRevenue > 0 ? ((totalDrink / totalRevenue) * 100).toFixed(1) : 0, color: COLORS.orange, bg: '#fff8f0' },
                    ].map((item) => (
                      <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, bgcolor: item.bg, borderRadius: '10px', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                          <Typography fontSize="0.8rem" fontWeight={500}>{item.label}</Typography>
                        </Box>
                        <Typography fontSize="0.8rem" fontWeight={700} color={item.color}>{item.pct}%</Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            )}
          </Grid>

          {/* ── Data Table ── */}
          <Paper sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <Box sx={{ p: 2.5, borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography fontWeight={700} fontSize="1rem">📋 Chi tiết doanh thu</Typography>
                <Typography color="text.secondary" fontSize="0.78rem">
                  {tabValue === 0 ? 'Theo từng ngày' : tabValue === 1 ? 'Theo từng tháng' : 'Theo từng sân con'}
                </Typography>
              </Box>
              <Chip label={`${chartData.length} dòng`} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.75rem', borderColor: '#ddd' }} />
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)' }}>
                    {(tabValue === 2
                      ? ['Cụm sân', 'Số sân', 'DT Sân', 'DT Đồ uống', 'Tổng DT', 'Số GD']
                      : [tabValue === 0 ? 'Ngày' : 'Tháng', 'DT Sân', 'DT Đồ uống', 'Tổng DT', 'Số GD']
                    ).map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: '#495057', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tabValue === 0 && revenueByDate.map((row) => (
                    <TableRow key={row._id} hover sx={{ '&:hover': { background: '#f0f9f4' }, transition: 'background 0.15s' }}>
                      <TableCell><Typography fontWeight={600} fontSize="0.88rem">📅 {dayjs(row._id).format('DD/MM/YYYY')}</Typography></TableCell>
                      <TableCell><Typography fontSize="0.85rem">{formatCurrency(row.courtRevenue)}</Typography></TableCell>
                      <TableCell><Typography fontSize="0.85rem" color="text.secondary">{formatCurrency(row.drinkRevenue)}</Typography></TableCell>
                      <TableCell><Typography fontWeight={700} color={COLORS.primary} fontSize="0.88rem">{formatCurrency(row.totalRevenue)}</Typography></TableCell>
                      <TableCell><Chip label={row.transactionCount} size="small" sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 700, fontSize: '0.8rem', height: 26 }} /></TableCell>
                    </TableRow>
                  ))}

                  {tabValue === 1 && revenueByMonth.map((row) => {
                    const [y, m] = row._id.split('-');
                    return (
                      <TableRow key={row._id} hover sx={{ '&:hover': { background: '#f0f9f4' }, transition: 'background 0.15s' }}>
                        <TableCell><Typography fontWeight={600} fontSize="0.88rem">🗓️ Tháng {m}/{y}</Typography></TableCell>
                        <TableCell><Typography fontSize="0.85rem">{formatCurrency(row.courtRevenue)}</Typography></TableCell>
                        <TableCell><Typography fontSize="0.85rem" color="text.secondary">{formatCurrency(row.drinkRevenue)}</Typography></TableCell>
                        <TableCell><Typography fontWeight={700} color={COLORS.primary} fontSize="0.88rem">{formatCurrency(row.totalRevenue)}</Typography></TableCell>
                        <TableCell><Chip label={row.transactionCount} size="small" sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 700, fontSize: '0.8rem', height: 26 }} /></TableCell>
                      </TableRow>
                    );
                  })}

                  {tabValue === 2 && revenueByCourt.map((row, idx) => (
                    <TableRow key={`${row._id.courtId}-${row._id.courtNumber}-${idx}`} hover sx={{ '&:hover': { background: '#f0f9f4' }, transition: 'background 0.15s' }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 36, height: 36, bgcolor: '#e8f5e9', color: '#2e7d32', borderRadius: '10px' }} variant="rounded">
                            <CourtIcon sx={{ fontSize: 20 }} />
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600} fontSize="0.88rem">{row.courtDetails?.name || 'N/A'}</Typography>
                            <Typography color="text.secondary" fontSize="0.72rem">{row.courtDetails?.address || ''}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`Sân ${(row._id.courtNumber ?? 0) + 1}`}
                          size="small"
                          sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700, fontSize: '0.78rem', height: 24 }}
                        />
                      </TableCell>
                      <TableCell><Typography fontSize="0.85rem">{formatCurrency(row.courtRevenue)}</Typography></TableCell>
                      <TableCell><Typography fontSize="0.85rem" color="text.secondary">{formatCurrency(row.drinkRevenue)}</Typography></TableCell>
                      <TableCell><Typography fontWeight={700} color={COLORS.primary} fontSize="0.88rem">{formatCurrency(row.totalRevenue)}</Typography></TableCell>
                      <TableCell><Chip label={row.transactionCount} size="small" sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 700, fontSize: '0.8rem', height: 26 }} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Totals footer */}
            <Box sx={{ p: 2.5, borderTop: '2px solid #e0e0e0', background: 'linear-gradient(135deg, #f8faf9, #e8f5e9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: COLORS.primary, width: 32, height: 32 }}>
                  <TrendingUpIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Typography fontWeight={700} fontSize="0.95rem">Tổng cộng</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography color="text.secondary" fontSize="0.7rem" fontWeight={500}>DT Sân</Typography>
                  <Typography fontWeight={700} fontSize="0.9rem" color={COLORS.blue}>{formatCurrency(totalCourt)}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography color="text.secondary" fontSize="0.7rem" fontWeight={500}>DT Đồ uống</Typography>
                  <Typography fontWeight={700} fontSize="0.9rem" color={COLORS.orange}>{formatCurrency(totalDrink)}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right', bgcolor: COLORS.primary, px: 2, py: 1, borderRadius: '12px', color: '#fff' }}>
                  <Typography fontSize="0.7rem" fontWeight={500} sx={{ opacity: 0.85 }}>Tổng DT</Typography>
                  <Typography fontWeight={800} fontSize="1.05rem">{formatCurrency(totalRevenue)}</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default AdminRevenue;
