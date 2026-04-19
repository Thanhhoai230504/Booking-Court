import React, { useEffect, useState, useMemo } from 'react';
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
  Chip,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  Divider,
  Avatar,
  Alert,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  DoneAll as CompleteIcon,
  Visibility as ViewIcon,
  LocalCafe as DrinkIcon,
  Close as CloseIcon,
  EventNote as EventIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  AccessTime as TimeIcon,
  CalendarMonth as CalendarIcon,
  SportsTennis as CourtIcon,
  SwapHoriz as SwapIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../../../store/store';
import {
  fetchAdminBookings,
  fetchAdminCourts,
  approveBooking,
  rejectBooking,
  completeBooking,
  addDrinkToBooking,
  fetchAdminDrinks,
  updateBookingCourt,
} from '../../../store/slices/adminSlice';
import { Booking, Court } from '../../../types';
import { showToast } from '../../../utils/toastNotify';
import dayjs from 'dayjs';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const statusConfig: Record<string, { label: string; color: 'warning' | 'info' | 'primary' | 'success' | 'error'; bg: string }> = {
  PENDING_APPROVAL: { label: 'Chờ duyệt', color: 'warning', bg: 'linear-gradient(135deg, #fff3e0, #ffe0b2)' },
  CONFIRMED: { label: 'Đã duyệt', color: 'info', bg: 'linear-gradient(135deg, #e3f2fd, #bbdefb)' },
  PLAYING: { label: 'Đang chơi', color: 'primary', bg: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)' },
  COMPLETED: { label: 'Hoàn thành', color: 'success', bg: 'linear-gradient(135deg, #e8f5e9, #a5d6a7)' },
  CANCELLED: { label: 'Đã hủy', color: 'error', bg: 'linear-gradient(135deg, #ffebee, #ffcdd2)' },
};

const tabs = [
  { label: 'Tất cả', value: '' },
  { label: 'Chờ duyệt', value: 'PENDING_APPROVAL' },
  { label: 'Đã duyệt', value: 'CONFIRMED' },
  { label: 'Đang chơi', value: 'PLAYING' },
  { label: 'Hoàn thành', value: 'COMPLETED' },
  { label: 'Đã hủy', value: 'CANCELLED' },
];

const AdminBookings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { bookings, courts, drinks, isLoading } = useSelector((state: RootState) => state.admin);
  const [tabValue, setTabValue] = useState(0);
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);
  const [drinkDialogOpen, setDrinkDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [drinkForm, setDrinkForm] = useState({ drinkId: '', quantity: 1 });

  // Court transfer state
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [transferBooking, setTransferBooking] = useState<Booking | null>(null);
  const [transferForm, setTransferForm] = useState({
    courtId: '',
    courtNumber: 0,
    notes: '',
  });

  const adminId = user?._id || user?.id || '';

  useEffect(() => {
    if (adminId) {
      const status = tabs[tabValue]?.value || undefined;
      dispatch(fetchAdminBookings({ adminId, params: status ? { status } : undefined }));
    }
  }, [dispatch, adminId, tabValue]);

  const handleApprove = async (id: string) => {
    try {
      await dispatch(approveBooking(id)).unwrap();
      showToast.success('Thành công', 'Đã duyệt booking!');
    } catch (error: any) {
      showToast.error('Thất bại', error || 'Lỗi duyệt booking');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await dispatch(rejectBooking(id)).unwrap();
      showToast.warning('Từ chối', 'Đã từ chối booking!');
    } catch (error: any) {
      showToast.error('Thất bại', error || 'Lỗi từ chối booking');
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await dispatch(completeBooking(id)).unwrap();
      showToast.success('Thành công', 'Đã hoàn thành booking!');
    } catch (error: any) {
      showToast.error('Thất bại', error || 'Lỗi hoàn thành booking');
    }
  };

  const handleOpenDrinkDialog = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setDrinkForm({ drinkId: '', quantity: 1 });
    if (adminId) dispatch(fetchAdminDrinks(adminId));
    setDrinkDialogOpen(true);
  };

  const handleAddDrink = async () => {
    try {
      await dispatch(
        addDrinkToBooking({ bookingId: selectedBookingId, data: drinkForm })
      ).unwrap();
      showToast.success('Thành công', 'Đã thêm đồ uống!');
      setDrinkDialogOpen(false);
    } catch (error: any) {
      showToast.error('Thất bại', error || 'Lỗi thêm đồ uống');
    }
  };

  // ---- Court Transfer ----
  const handleOpenTransferDialog = (booking: Booking) => {
    setTransferBooking(booking);
    const currentCourtId = booking.courtId && typeof booking.courtId === 'object'
      ? (booking.courtId as any)._id
      : booking.courtId;
    setTransferForm({
      courtId: currentCourtId || '',
      courtNumber: booking.courtNumber || 0,
      notes: '',
    });
    if (adminId) dispatch(fetchAdminCourts(adminId));
    setTransferDialogOpen(true);
  };

  const selectedTransferCourt = useMemo(() => {
    return courts.find((c) => c._id === transferForm.courtId);
  }, [courts, transferForm.courtId]);

  const handleTransferCourt = async () => {
    if (!transferBooking) return;
    try {
      const currentCourtId = transferBooking.courtId && typeof transferBooking.courtId === 'object'
        ? (transferBooking.courtId as any)._id
        : transferBooking.courtId;

      const updateData: any = {};
      if (transferForm.courtId !== currentCourtId) {
        updateData.courtId = transferForm.courtId;
      }
      if (transferForm.courtNumber !== (transferBooking.courtNumber || 0)) {
        updateData.courtNumber = transferForm.courtNumber;
      }
      if (transferForm.notes.trim()) {
        updateData.notes = transferForm.notes.trim();
      }

      if (Object.keys(updateData).length === 0) {
        showToast.warning('Chú ý', 'Không có thay đổi nào để cập nhật');
        return;
      }

      await dispatch(
        updateBookingCourt({ bookingId: transferBooking._id, data: updateData })
      ).unwrap();
      showToast.success('Thành công', 'Đã chuyển sân thành công!');
      setTransferDialogOpen(false);
      setTransferBooking(null);
    } catch (error: any) {
      showToast.error('Thất bại', error || 'Lỗi chuyển sân');
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Avatar sx={{ bgcolor: '#006837', width: 44, height: 44 }}>
            <EventIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.2 }}>
              Quản lý Đặt sân
            </Typography>
            <Typography color="text.secondary" fontSize="0.85rem">
              {bookings.length} booking
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper
        sx={{
          borderRadius: '16px',
          mb: 3,
          background: '#fff',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}
      >
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 1,
            '& .MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none',
              minHeight: 52,
              fontSize: '0.9rem',
            },
            '& .Mui-selected': { color: '#006837' },
            '& .MuiTabs-indicator': { backgroundColor: '#006837', height: 3, borderRadius: '3px 3px 0 0' },
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} />
          ))}
        </Tabs>
      </Paper>

      {/* Table */}
      <Paper sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)' }}>
                <TableCell sx={{ fontWeight: 700, color: '#495057', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mã</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#495057', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Khách hàng</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#495057', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sân</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#495057', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Lịch đặt</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#495057', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tổng tiền</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#495057', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#495057', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }} align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={36} sx={{ color: '#006837' }} />
                    <Typography color="text.secondary" mt={1} fontSize="0.85rem">Đang tải...</Typography>
                  </TableCell>
                </TableRow>
              ) : !bookings.length ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <EventIcon sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                    <Typography color="text.secondary" fontSize="0.9rem">Không có booking nào</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => {
                  const courtName = booking.courtId && typeof booking.courtId === 'object'
                    ? ((booking.courtId as any).name || 'N/A')
                    : 'N/A';
                  return (
                    <TableRow
                      key={booking._id}
                      hover
                      sx={{
                        '&:hover': { background: '#f8fffe' },
                        transition: 'background 0.15s',
                      }}
                    >
                      <TableCell>
                        <Chip
                          label={booking.bookingNumber}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
                            color: '#2e7d32',
                            border: 'none',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography fontWeight={600} fontSize="0.9rem">{booking.customerName}</Typography>
                          <Typography color="text.secondary" fontSize="0.78rem">{booking.customerPhone}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: '#e8f5e9', color: '#2e7d32' }}>
                            <CourtIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Box>
                            <Typography fontWeight={500} fontSize="0.85rem">{courtName}</Typography>
                            {typeof booking.courtNumber === 'number' ? (
                              <Typography color="text.secondary" fontSize="0.75rem">Sân {booking.courtNumber + 1}</Typography>
                            ) : null}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography fontWeight={500} fontSize="0.85rem">
                            {dayjs(booking.startDate).format('DD/MM/YYYY')}
                          </Typography>
                          <Typography color="text.secondary" fontSize="0.78rem">
                            {booking.startTime} - {booking.endTime}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={700} color="#006837" fontSize="0.9rem">
                          {formatCurrency(booking.totalPrice)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statusConfig[booking.status]?.label}
                          color={statusConfig[booking.status]?.color}
                          size="small"
                          sx={{ fontWeight: 600, fontSize: '0.78rem' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.3, justifyContent: 'center' }}>
                          <Tooltip title="Chi tiết" arrow>
                            <IconButton
                              size="small"
                              onClick={() => setDetailBooking(booking)}
                              sx={{ color: '#6c757d', '&:hover': { color: '#495057', bgcolor: '#f1f3f5' } }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {booking.status === 'PENDING_APPROVAL' && (
                            <>
                              <Tooltip title="Duyệt" arrow>
                                <IconButton
                                  size="small"
                                  onClick={() => handleApprove(booking._id)}
                                  sx={{ color: '#2e7d32', '&:hover': { bgcolor: '#e8f5e9' } }}
                                >
                                  <ApproveIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Từ chối" arrow>
                                <IconButton
                                  size="small"
                                  onClick={() => handleReject(booking._id)}
                                  sx={{ color: '#c62828', '&:hover': { bgcolor: '#ffebee' } }}
                                >
                                  <RejectIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          {(booking.status === 'CONFIRMED' || booking.status === 'PLAYING') && (
                            <>
                              <Tooltip title="Chuyển sân" arrow>
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenTransferDialog(booking)}
                                  sx={{ color: '#6a1b9a', '&:hover': { bgcolor: '#f3e5f5' } }}
                                >
                                  <SwapIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Hoàn thành" arrow>
                                <IconButton
                                  size="small"
                                  onClick={() => handleComplete(booking._id)}
                                  sx={{ color: '#1565c0', '&:hover': { bgcolor: '#e3f2fd' } }}
                                >
                                  <CompleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Thêm đồ uống" arrow>
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDrinkDialog(booking._id)}
                                  sx={{ color: '#e65100', '&:hover': { bgcolor: '#fff3e0' } }}
                                >
                                  <DrinkIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Detail Dialog */}
      <Dialog
        open={!!detailBooking}
        onClose={() => setDetailBooking(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden' } }}
      >
        {detailBooking && (
          <>
            {/* Dialog Header */}
            <Box
              sx={{
                background: statusConfig[detailBooking.status]?.bg || '#f5f5f5',
                px: 3,
                py: 2.5,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography fontWeight={700} fontSize="1.15rem">
                  Booking #{detailBooking.bookingNumber}
                </Typography>
                <Chip
                  label={statusConfig[detailBooking.status]?.label}
                  color={statusConfig[detailBooking.status]?.color}
                  size="small"
                  sx={{ fontWeight: 600, mt: 0.5 }}
                />
              </Box>
              <IconButton onClick={() => setDetailBooking(null)} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.05)' }}>
                <CloseIcon />
              </IconButton>
            </Box>
            <DialogContent sx={{ px: 3, py: 2.5 }}>
              {/* Customer Info */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
                <Box sx={{ flex: 1, p: 2, bgcolor: '#f8f9fa', borderRadius: '12px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <PersonIcon sx={{ fontSize: 18, color: '#6c757d' }} />
                    <Typography color="text.secondary" fontSize="0.78rem">Khách hàng</Typography>
                  </Box>
                  <Typography fontWeight={600}>{detailBooking.customerName}</Typography>
                </Box>
                <Box sx={{ flex: 1, p: 2, bgcolor: '#f8f9fa', borderRadius: '12px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <PhoneIcon sx={{ fontSize: 18, color: '#6c757d' }} />
                    <Typography color="text.secondary" fontSize="0.78rem">Số điện thoại</Typography>
                  </Box>
                  <Typography fontWeight={600}>{detailBooking.customerPhone}</Typography>
                </Box>
              </Box>

              {/* Schedule */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
                <Box sx={{ flex: 1, p: 2, bgcolor: '#f8f9fa', borderRadius: '12px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <CalendarIcon sx={{ fontSize: 18, color: '#6c757d' }} />
                    <Typography color="text.secondary" fontSize="0.78rem">Ngày</Typography>
                  </Box>
                  <Typography fontWeight={600}>{dayjs(detailBooking.startDate).format('DD/MM/YYYY')}</Typography>
                </Box>
                <Box sx={{ flex: 1, p: 2, bgcolor: '#f8f9fa', borderRadius: '12px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <TimeIcon sx={{ fontSize: 18, color: '#6c757d' }} />
                    <Typography color="text.secondary" fontSize="0.78rem">Giờ</Typography>
                  </Box>
                  <Typography fontWeight={600}>{detailBooking.startTime} - {detailBooking.endTime}</Typography>
                </Box>
              </Box>

              {/* Pricing */}
              <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden', mb: 2 }}>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography fontSize="0.9rem">Giá sân ({detailBooking.durationHours}h)</Typography>
                  <Typography fontWeight={600}>{formatCurrency(detailBooking.courtPrice)}</Typography>
                </Box>
                {detailBooking.drinkItems && detailBooking.drinkItems.length > 0 && (
                  <>
                    <Divider />
                    <Box sx={{ p: 2 }}>
                      <Typography fontWeight={600} fontSize="0.85rem" mb={1}>Đồ uống</Typography>
                      {detailBooking.drinkItems.map((item, idx) => (
                        <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
                          <Typography fontSize="0.85rem" color="text.secondary">
                            {item.name} × {item.quantity}
                          </Typography>
                          <Typography fontSize="0.85rem">{formatCurrency(item.price * item.quantity)}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </>
                )}
                <Divider />
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', bgcolor: '#f8f9fa' }}>
                  <Typography fontWeight={700} fontSize="1rem">Tổng cộng</Typography>
                  <Typography fontWeight={700} fontSize="1rem" color="#006837">
                    {formatCurrency(detailBooking.totalPrice)}
                  </Typography>
                </Box>
              </Paper>

              {/* Payment info */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label={detailBooking.paymentMethod === 'cash' ? '💵 Tiền mặt' : '💳 Online'}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
                {detailBooking.bookingType === 'recurring' && (
                  <Chip label="🔄 Định kỳ" size="small" variant="outlined" sx={{ fontWeight: 500 }} />
                )}
              </Box>

              {detailBooking.notes && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#fff3e0', borderRadius: '10px' }}>
                  <Typography fontSize="0.85rem" color="text.secondary">📝 {detailBooking.notes}</Typography>
                </Box>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Add Drink Dialog */}
      <Dialog
        open={drinkDialogOpen}
        onClose={() => setDrinkDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px' } }}
      >
        <Box sx={{ px: 3, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: '#fff3e0', color: '#e65100', width: 36, height: 36 }}>
              <DrinkIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Typography fontWeight={700} fontSize="1.05rem">Thêm đồ uống</Typography>
          </Box>
          <IconButton onClick={() => setDrinkDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ px: 3, pt: 0 }}>
          <TextField
            fullWidth
            select
            label="Chọn đồ uống"
            value={drinkForm.drinkId}
            onChange={(e) => setDrinkForm({ ...drinkForm, drinkId: e.target.value })}
            size="small"
            sx={{ mb: 2 }}
          >
            {(drinks || []).map((d) => (
              <MenuItem key={d._id} value={d._id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                  {d.image ? (
                    <Avatar src={d.image} sx={{ width: 32, height: 32, borderRadius: '8px' }} variant="rounded" />
                  ) : (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#fff3e0', color: '#e65100', borderRadius: '8px' }} variant="rounded">
                      <DrinkIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography fontSize="0.85rem" fontWeight={500}>{d.name}</Typography>
                    <Typography fontSize="0.75rem" color="text.secondary">
                      {formatCurrency(d.price)} • Tồn: {d.quantity}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Số lượng"
            type="number"
            value={drinkForm.quantity}
            onChange={(e) => setDrinkForm({ ...drinkForm, quantity: Number(e.target.value) })}
            size="small"
            inputProps={{ min: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDrinkDialogOpen(false)} sx={{ borderRadius: '10px' }}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleAddDrink}
            disabled={!drinkForm.drinkId || drinkForm.quantity < 1}
            sx={{
              background: 'linear-gradient(135deg, #006837, #4CAF50)',
              borderRadius: '10px',
              px: 3,
            }}
          >
            Thêm đồ uống
          </Button>
        </DialogActions>
      </Dialog>

      {/* Transfer Court Dialog */}
      <Dialog
        open={transferDialogOpen}
        onClose={() => setTransferDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden' } }}
      >
        {/* Dialog Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #7b1fa2, #9c27b0)',
            px: 3,
            py: 2.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>
              <SwapIcon sx={{ color: '#fff' }} />
            </Avatar>
            <Box>
              <Typography fontWeight={700} fontSize="1.1rem" color="#fff">
                Chuyển sân
              </Typography>
              {transferBooking && (
                <Typography fontSize="0.78rem" color="rgba(255,255,255,0.8)">
                  Booking #{transferBooking.bookingNumber}
                </Typography>
              )}
            </Box>
          </Box>
          <IconButton onClick={() => setTransferDialogOpen(false)} size="small" sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.15)' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ px: 3, py: 2.5 }}>
          {/* Current court info */}
          {transferBooking && (
            <Alert
              severity="info"
              icon={<CourtIcon />}
              sx={{ mb: 2.5, borderRadius: '12px', '& .MuiAlert-message': { width: '100%' } }}
            >
              <Typography fontWeight={600} fontSize="0.85rem" mb={0.3}>Sân hiện tại</Typography>
              <Typography fontSize="0.85rem">
                {transferBooking.courtId && typeof transferBooking.courtId === 'object'
                  ? (transferBooking.courtId as any).name
                  : 'N/A'}
                {typeof transferBooking.courtNumber === 'number' ? ` - Sân ${transferBooking.courtNumber + 1}` : ''}
              </Typography>
            </Alert>
          )}

          {/* Select new court */}
          <TextField
            fullWidth
            select
            label="Chọn sân mới"
            value={transferForm.courtId}
            onChange={(e) => setTransferForm({ ...transferForm, courtId: e.target.value, courtNumber: 0 })}
            size="small"
            sx={{ mb: 2 }}
          >
            {(courts || []).filter(c => c.status === 'active').map((court) => (
              <MenuItem key={court._id} value={court._id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#f3e5f5', color: '#7b1fa2', borderRadius: '8px' }} variant="rounded">
                    <CourtIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontSize="0.85rem" fontWeight={500}>{court.name}</Typography>
                    <Typography fontSize="0.75rem" color="text.secondary">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(court.pricePerHour)}/giờ • {court.totalCourts} sân
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </TextField>

          {/* Select court number */}
          {selectedTransferCourt && selectedTransferCourt.totalCourts > 0 && (
            <TextField
              fullWidth
              select
              label="Chọn số sân"
              value={transferForm.courtNumber}
              onChange={(e) => setTransferForm({ ...transferForm, courtNumber: Number(e.target.value) })}
              size="small"
              sx={{ mb: 2 }}
            >
              {Array.from({ length: selectedTransferCourt.totalCourts }, (_, i) => i).map((num) => (
                <MenuItem key={num} value={num}>Sân {num + 1}</MenuItem>
              ))}
            </TextField>
          )}

          {/* Price preview */}
          {selectedTransferCourt && transferBooking && (
            <Paper
              variant="outlined"
              sx={{ borderRadius: '12px', overflow: 'hidden', mb: 2 }}
            >
              <Box sx={{ p: 2 }}>
                <Typography fontSize="0.85rem" fontWeight={600} mb={1} color="text.secondary">
                  💰 Giá sân mới (preview)
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography fontSize="0.85rem">Giá/giờ:</Typography>
                  <Typography fontSize="0.85rem" fontWeight={600}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedTransferCourt.pricePerHour)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography fontSize="0.85rem">Số giờ:</Typography>
                  <Typography fontSize="0.85rem" fontWeight={600}>
                    {transferBooking.durationHours}h
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography fontSize="0.95rem" fontWeight={700}>Tổng giá sân:</Typography>
                  <Typography fontSize="0.95rem" fontWeight={700} color="#7b1fa2">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                      selectedTransferCourt.pricePerHour * transferBooking.durationHours
                    )}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}

          {/* Notes */}
          <TextField
            fullWidth
            label="Ghi chú lý do chuyển sân"
            multiline
            rows={2}
            value={transferForm.notes}
            onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
            size="small"
            placeholder="VD: Sân A1 gặp sự cố, chuyển sang sân A2"
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setTransferDialogOpen(false)} sx={{ borderRadius: '10px' }}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleTransferCourt}
            disabled={!transferForm.courtId}
            sx={{
              background: 'linear-gradient(135deg, #7b1fa2, #9c27b0)',
              borderRadius: '10px',
              px: 3,
              '&:hover': { background: 'linear-gradient(135deg, #6a1b9a, #8e24aa)' },
            }}
          >
            Xác nhận chuyển sân
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminBookings;
