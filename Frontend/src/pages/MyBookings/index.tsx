import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Button,
  Grid,
  Skeleton,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  CalendarMonth,
  AccessTime,
  LocationOn,
  Delete,
  Visibility,
  SportsTennis,
  ArrowBack,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store/store';
import { fetchMyBookings, deleteBooking } from '../../store/slices/bookingSlice';
import { Court } from '../../types';

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  PENDING_APPROVAL: { label: 'Chờ duyệt', color: '#F57C00', bgColor: '#FFF3E0' },
  CONFIRMED: { label: 'Đã xác nhận', color: '#2E7D32', bgColor: '#E8F5E9' },
  PLAYING: { label: 'Đang chơi', color: '#1565C0', bgColor: '#E3F2FD' },
  COMPLETED: { label: 'Hoàn thành', color: '#6A1B9A', bgColor: '#F3E5F5' },
  CANCELLED: { label: 'Đã hủy', color: '#C62828', bgColor: '#FFEBEE' },
};

const MyBookings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { bookings, isLoading, error } = useSelector((state: RootState) => state.bookings);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const tabFilters = ['all', 'PENDING_APPROVAL', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
  const tabLabels = ['Tất cả', 'Chờ duyệt', 'Đã xác nhận', 'Hoàn thành', 'Đã hủy'];

  const filteredBookings = tabFilters[tabValue] === 'all'
    ? bookings
    : bookings.filter((b) => b.status === tabFilters[tabValue]);

  const handleDelete = (id: string) => {
    dispatch(deleteBooking(id));
    setDeleteDialog(null);
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #006837 0%, #004D25 100%)',
          color: 'white',
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/')} sx={{ color: 'white' }}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h4" fontWeight={800}>
                Sân đã đặt
              </Typography>
              <Typography sx={{ opacity: 0.8, mt: 0.5 }}>
                Quản lý các đơn đặt sân của bạn
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Tabs */}
        <Paper sx={{ borderRadius: 3, mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.9rem',
              },
              '& .Mui-selected': { color: '#006837' },
              '& .MuiTabs-indicator': { backgroundColor: '#006837' },
            }}
          >
            {tabLabels.map((label, i) => (
              <Tab
                key={label}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {label}
                    {tabFilters[i] !== 'all' && (
                      <Chip
                        label={bookings.filter((b) => b.status === tabFilters[i]).length}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          bgcolor: tabValue === i ? '#E8F5E9' : '#F5F5F5',
                          color: tabValue === i ? '#006837' : '#999',
                        }}
                      />
                    )}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
        )}

        {isLoading ? (
          <Grid container spacing={2}>
            {[...Array(3)].map((_, i) => (
              <Grid item xs={12} key={i}>
                <Skeleton variant="rounded" height={160} sx={{ borderRadius: 3 }} animation="wave" />
              </Grid>
            ))}
          </Grid>
        ) : filteredBookings.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>📋</Typography>
            <Typography variant="h5" fontWeight={700} color="text.secondary" gutterBottom>
              Chưa có đơn đặt sân nào
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Hãy tìm sân và đặt lịch chơi ngay!
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{
                bgcolor: '#006837',
                px: 4,
                py: 1.5,
                fontWeight: 700,
                '&:hover': { bgcolor: '#004D25' },
              }}
            >
              Tìm sân ngay
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {filteredBookings.map((booking, index) => {
              const courtInfo = typeof booking.courtId === 'object' ? booking.courtId as Court : null;
              const status = statusConfig[booking.status] || statusConfig.PENDING_APPROVAL;

              return (
                <Grid
                  item
                  xs={12}
                  key={booking._id}
                  sx={{
                    animation: 'fadeInUp 0.4s ease forwards',
                    animationDelay: `${index * 0.08}s`,
                    opacity: 0,
                  }}
                >
                  <Paper
                    sx={{
                      p: 0,
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: '0 6px 24px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
                      {/* Left accent */}
                      <Box
                        sx={{
                          width: { xs: '100%', sm: 6 },
                          height: { xs: 6, sm: 'auto' },
                          bgcolor: status.color,
                          flexShrink: 0,
                        }}
                      />

                      <Box sx={{ flex: 1, p: 2.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                #{booking.bookingNumber}
                              </Typography>
                              <Chip
                                label={status.label}
                                size="small"
                                sx={{
                                  bgcolor: status.bgColor,
                                  color: status.color,
                                  fontWeight: 700,
                                  fontSize: '0.75rem',
                                }}
                              />
                            </Box>
                            <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <SportsTennis sx={{ fontSize: 20, color: '#006837' }} />
                              {courtInfo ? courtInfo.name : 'Sân Pickleball'}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {(booking.status === 'PENDING_APPROVAL' || booking.status === 'CONFIRMED') && (
                              <IconButton
                                size="small"
                                onClick={() => setDeleteDialog(booking._id)}
                                sx={{
                                  color: '#C62828',
                                  '&:hover': { bgcolor: '#FFEBEE' },
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CalendarMonth sx={{ fontSize: 16, color: '#757575' }} />
                              <Typography variant="body2" color="text.secondary">
                                {formatDate(booking.startDate)}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AccessTime sx={{ fontSize: 16, color: '#757575' }} />
                              <Typography variant="body2" color="text.secondary">
                                {booking.startTime} - {booking.endTime} ({booking.durationHours}h)
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            {courtInfo && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocationOn sx={{ fontSize: 16, color: '#757575' }} />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {courtInfo.address}
                                </Typography>
                              </Box>
                            )}
                          </Grid>
                        </Grid>

                        <Divider sx={{ my: 1.5 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip
                              label={booking.paymentMethod === 'cash' ? 'Tiền mặt' : 'Online'}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                            <Chip
                              label={booking.bookingType === 'single' ? 'Đơn lẻ' : 'Cố định'}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          </Box>
                          <Typography fontWeight={700} color="#006837" fontSize="1.1rem">
                            {formatPrice(booking.totalPrice)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Xác nhận hủy đặt sân</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn hủy đơn đặt sân này không? Thao tác này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteDialog(null)}
            sx={{ color: '#757575' }}
          >
            Không
          </Button>
          <Button
            onClick={() => deleteDialog && handleDelete(deleteDialog)}
            variant="contained"
            sx={{
              bgcolor: '#C62828',
              px: 3,
              fontWeight: 700,
              '&:hover': { bgcolor: '#8E0000' },
            }}
          >
            Hủy đặt sân
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyBookings;
