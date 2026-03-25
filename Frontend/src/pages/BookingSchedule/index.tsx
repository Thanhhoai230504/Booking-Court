import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Paper,
  IconButton,
  Button,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Grid,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  CalendarMonth,
  CheckCircle,
  Person,
  Phone,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store/store';
import { fetchCourtDetail } from '../../store/slices/courtSlice';
import { createBooking, resetCreateSuccess, fetchCourtSchedule } from '../../store/slices/bookingSlice';

interface SelectedSlot {
  courtIndex: number;
  timeSlot: string;
}

const BookingSchedule: React.FC = () => {
  const { courtId } = useParams<{ courtId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedCourt: court } = useSelector((state: RootState) => state.courts);
  const { isLoading, error, createSuccess, courtSchedule } = useSelector((state: RootState) => state.bookings);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    customerName: user?.name || '',
    customerPhone: '',
    paymentMethod: 'cash' as 'online' | 'cash',
  });

  useEffect(() => {
    if (courtId) {
      dispatch(fetchCourtDetail(courtId));
    }
    return () => {
      dispatch(resetCreateSuccess());
    };
  }, [courtId, dispatch]);

  // Fetch booked slots from API when court or date changes
  useEffect(() => {
    if (courtId && selectedDate) {
      dispatch(fetchCourtSchedule({ courtId, date: selectedDate }));
    }
  }, [courtId, selectedDate, dispatch]);

  useEffect(() => {
    if (user) {
      setCustomerInfo((prev) => ({ ...prev, customerName: user.name || '' }));
    }
  }, [user]);

  // Generate time slots based on court opening hours
  const timeSlots = useMemo(() => {
    if (!court) return [];
    const start = court.openingHours?.start || '05:00';
    const end = court.openingHours?.end || '22:00';
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const slots: string[] = [];
    let h = startH;
    let m = startM;
    while (h < endH || (h === endH && m < endM)) {
      slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      m += 30;
      if (m >= 60) {
        m = 0;
        h++;
      }
    }
    return slots;
  }, [court]);

  // Generate court names
  const courtNames = useMemo(() => {
    if (!court) return [];
    const count = court.totalCourts || 1;
    return Array.from({ length: count }, (_, i) => `Sân A${i + 1}`);
  }, [court]);

  // Build booked slots set from real API data
  const bookedSlots = useMemo(() => {
    const booked = new Set<string>();
    if (!court || !courtSchedule || courtSchedule.length === 0) return booked;

    // For each booking, expand its startTime-endTime into 30-minute slots
    // Only mark the specific sub-court (courtNumber) as booked
    courtSchedule.forEach((booking) => {
      const courtIdx = booking.courtNumber ?? 0;
      const [startH, startM] = booking.startTime.split(':').map(Number);
      const [endH, endM] = booking.endTime.split(':').map(Number);
      let h = startH;
      let m = startM;
      while (h < endH || (h === endH && m < endM)) {
        const slotTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        booked.add(`${courtIdx}-${slotTime}`);
        m += 30;
        if (m >= 60) {
          m = 0;
          h++;
        }
      }
    });

    return booked;
  }, [court, courtSchedule, courtNames]);

  const isSlotBooked = (courtIndex: number, time: string) => {
    return bookedSlots.has(`${courtIndex}-${time}`);
  };

  // Check if a slot is in the past (only for today)
  const isSlotPast = (time: string) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    if (selectedDate !== todayStr) return false;
    const [slotH, slotM] = time.split(':').map(Number);
    const now = new Date();
    const currentH = now.getHours();
    const currentM = now.getMinutes();
    return slotH < currentH || (slotH === currentH && slotM <= currentM);
  };

  const isSlotSelected = (courtIndex: number, time: string) => {
    return selectedSlots.some((s) => s.courtIndex === courtIndex && s.timeSlot === time);
  };

  const toggleSlot = (courtIndex: number, time: string) => {
    if (isSlotBooked(courtIndex, time) || isSlotPast(time)) return;

    setSelectedSlots((prev) => {
      const exists = prev.find((s) => s.courtIndex === courtIndex && s.timeSlot === time);
      if (exists) {
        return prev.filter((s) => !(s.courtIndex === courtIndex && s.timeSlot === time));
      }
      return [...prev, { courtIndex, timeSlot: time }];
    });
  };

  // Calculate time range from selected slots
  const getBookingInfo = () => {
    if (selectedSlots.length === 0) return null;
    const times = selectedSlots.map((s) => s.timeSlot).sort();
    const startTime = times[0];
    // End time = last slot + 30 minutes
    const lastTime = times[times.length - 1];
    const [h, m] = lastTime.split(':').map(Number);
    let endM = m + 30;
    let endH = h;
    if (endM >= 60) {
      endM = 0;
      endH++;
    }
    const endTime = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
    const durationHours = selectedSlots.length * 0.5;
    const totalPrice = court ? court.pricePerHour * durationHours : 0;

    // Group by court
    const courtGroups: Record<number, string[]> = {};
    selectedSlots.forEach((s) => {
      if (!courtGroups[s.courtIndex]) courtGroups[s.courtIndex] = [];
      courtGroups[s.courtIndex].push(s.timeSlot);
    });

    return { startTime, endTime, durationHours, totalPrice, courtGroups };
  };

  const bookingInfo = getBookingInfo();

  const handleNext = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmBooking = () => {
    if (!courtId || !bookingInfo) return;
    // Get the first selected court index to send as courtNumber
    const courtNumber = selectedSlots.length > 0 ? selectedSlots[0].courtIndex : 0;
    dispatch(
      createBooking({
        courtId,
        courtNumber,
        startDate: selectedDate,
        startTime: bookingInfo.startTime,
        endTime: bookingInfo.endTime,
        durationHours: bookingInfo.durationHours,
        customerName: customerInfo.customerName,
        customerPhone: customerInfo.customerPhone,
        bookingType: 'single',
        paymentMethod: customerInfo.paymentMethod,
      })
    );
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Success screen
  if (createSuccess) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <CheckCircle sx={{ fontSize: 80, color: '#006837', mb: 2 }} />
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Đặt sân thành công!
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem' }}>
          Đơn đặt sân của bạn đã được gửi và đang chờ chủ sân phê duyệt.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={() => navigate('/my-bookings')}
            sx={{ bgcolor: '#006837', px: 4, py: 1.5, fontWeight: 700, '&:hover': { bgcolor: '#004D25' } }}
          >
            Xem đơn đặt sân
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{ borderColor: '#006837', color: '#006837', px: 4, py: 1.5, fontWeight: 700 }}
          >
            Về trang chủ
          </Button>
        </Box>
      </Container>
    );
  }

  if (!court) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#006837' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header bar */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #006837 0%, #004D25 100%)',
          color: 'white',
          py: 2,
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={() => navigate(-1)} sx={{ color: 'white' }}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h5" fontWeight={800} sx={{ fontSize: { xs: '1rem', md: '1.3rem' } }}>
                Đặt lịch ngày trực quan
              </Typography>
            </Box>

            {/* Date picker */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlots([]);
                }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    borderRadius: 2,
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: 'white' },
                  },
                  '& input': { color: 'white', py: 1, px: 1.5, fontSize: '0.9rem' },
                  '& input::-webkit-calendar-picker-indicator': { filter: 'invert(1)' },
                }}
              />
              <CalendarMonth />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Legend */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0', py: 1.5 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 20, height: 20, bgcolor: 'white', border: '2px solid #e0e0e0', borderRadius: 0.5 }} />
              <Typography variant="body2" fontWeight={600}>Trống</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 20, height: 20, bgcolor: '#C62828', borderRadius: 0.5 }} />
              <Typography variant="body2" fontWeight={600}>Đã đặt</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 20, height: 20, bgcolor: '#BDBDBD', borderRadius: 0.5 }} />
              <Typography variant="body2" fontWeight={600}>Khóa</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 20, height: 20, bgcolor: '#006837', borderRadius: 0.5 }} />
              <Typography variant="body2" fontWeight={600}>Đã chọn</Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ color: '#006837', fontWeight: 700, cursor: 'pointer', ml: 'auto', textDecoration: 'underline' }}
            >
              Xem sân & bảng giá
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Notice */}
      <Box sx={{ bgcolor: '#FFF8E1', py: 1, borderBottom: '1px solid #FFE082' }}>
        <Container maxWidth="xl">
          <Typography variant="body2" textAlign="center" color="#E65100" fontWeight={500}>
            <strong>Lưu ý:</strong> Nếu bạn cần đặt lịch cố định vui lòng liên hệ chủ sân để được hỗ trợ.
          </Typography>
        </Container>
      </Box>

      {/* Time slot grid */}
      <Box sx={{ overflow: 'auto', px: { xs: 1, md: 2 }, py: 2 }}>
        <Box
          sx={{
            display: 'inline-block',
            minWidth: '100%',
          }}
        >
          {/* Time header row */}
          <Box sx={{ display: 'flex', ml: '90px' }}>
            {timeSlots.map((time) => (
              <Box
                key={time}
                sx={{
                  minWidth: 52,
                  textAlign: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#616161',
                  py: 0.5,
                  borderLeft: '1px solid #e0e0e0',
                }}
              >
                {time}
              </Box>
            ))}
          </Box>

          {/* Court rows */}
          {courtNames.map((courtName, courtIndex) => (
            <Box
              key={courtIndex}
              sx={{
                display: 'flex',
                alignItems: 'stretch',
                borderTop: '1px solid #e0e0e0',
              }}
            >
              {/* Court label */}
              <Box
                sx={{
                  minWidth: 90,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'white',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  borderRight: '2px solid #e0e0e0',
                  borderBottom: '1px solid #e0e0e0',
                  color: '#333',
                  position: 'sticky',
                  left: 0,
                  zIndex: 2,
                }}
              >
                {courtName}
              </Box>

              {/* Time cells */}
              {timeSlots.map((time) => {
                const booked = isSlotBooked(courtIndex, time);
                const selected = isSlotSelected(courtIndex, time);
                const past = isSlotPast(time);
                const disabled = booked || past;

                return (
                  <Tooltip
                    key={`${courtIndex}-${time}`}
                    title={
                      booked
                        ? 'Đã đặt'
                        : past
                        ? 'Đã qua giờ'
                        : selected
                        ? `${courtName} - ${time} (Đã chọn)`
                        : `${courtName} - ${time}`
                    }
                    arrow
                  >
                    <Box
                      onClick={() => toggleSlot(courtIndex, time)}
                      sx={{
                        minWidth: 52,
                        height: 44,
                        borderLeft: '1px solid #e0e0e0',
                        borderBottom: '1px solid #e0e0e0',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: booked
                          ? '#C62828'
                          : past
                          ? '#BDBDBD'
                          : selected
                          ? '#006837'
                          : 'white',
                        '&:hover': disabled
                          ? {}
                          : {
                              bgcolor: selected ? '#004D25' : '#E8F5E9',
                              transform: 'scale(1.05)',
                              zIndex: 1,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            },
                      }}
                    >
                      {selected && (
                        <CheckCircle sx={{ fontSize: 16, color: 'white' }} />
                      )}
                    </Box>
                  </Tooltip>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Bottom bar with summary and Next button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          bgcolor: 'white',
          borderTop: '2px solid #e0e0e0',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 1.5,
              gap: 2,
            }}
          >
            {/* Selection info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {selectedSlots.length > 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={`${selectedSlots.length} khung giờ`}
                    sx={{ bgcolor: '#E8F5E9', color: '#006837', fontWeight: 700 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {bookingInfo?.durationHours}h •{' '}
                    <strong style={{ color: '#006837', fontSize: '1.1rem' }}>
                      {bookingInfo ? formatPrice(bookingInfo.totalPrice) : ''}
                    </strong>
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Chọn khung giờ trống trên bảng để đặt sân
                </Typography>
              )}
            </Box>

            {/* Next button */}
            <Button
              variant="contained"
              disabled={selectedSlots.length === 0}
              onClick={handleNext}
              sx={{
                bgcolor: '#DAA520',
                color: '#333',
                px: { xs: 4, md: 6 },
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 800,
                borderRadius: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                minWidth: 200,
                '&:hover': { bgcolor: '#C49B1A' },
                '&:disabled': { bgcolor: '#E0E0E0', color: '#999' },
              }}
            >
              TIẾP THEO
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.3rem', pb: 0 }}>
          Xác nhận đặt sân
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
          )}

          {/* Booking summary */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2.5 }}>
            <Typography fontWeight={700} color="#006837" sx={{ mb: 1 }}>
              📋 Thông tin đặt sân
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={4}><Typography variant="body2" color="text.secondary">Sân</Typography></Grid>
              <Grid item xs={8}><Typography variant="body2" fontWeight={600}>{court?.name}</Typography></Grid>
              <Grid item xs={4}><Typography variant="body2" color="text.secondary">Ngày</Typography></Grid>
              <Grid item xs={8}><Typography variant="body2" fontWeight={600}>{formatDisplayDate(selectedDate)}</Typography></Grid>
              <Grid item xs={4}><Typography variant="body2" color="text.secondary">Giờ</Typography></Grid>
              <Grid item xs={8}><Typography variant="body2" fontWeight={600}>{bookingInfo?.startTime} - {bookingInfo?.endTime}</Typography></Grid>
              <Grid item xs={4}><Typography variant="body2" color="text.secondary">Thời lượng</Typography></Grid>
              <Grid item xs={8}><Typography variant="body2" fontWeight={600}>{bookingInfo?.durationHours} giờ</Typography></Grid>
              <Grid item xs={4}><Typography variant="body2" color="text.secondary">Tổng tiền</Typography></Grid>
              <Grid item xs={8}>
                <Typography fontWeight={700} color="#006837">
                  {bookingInfo ? formatPrice(bookingInfo.totalPrice) : ''}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Customer info form */}
          <Typography fontWeight={700} sx={{ mb: 1.5 }}>
            👤 Thông tin khách hàng
          </Typography>
          <TextField
            label="Họ và tên"
            fullWidth
            value={customerInfo.customerName}
            onChange={(e) => setCustomerInfo({ ...customerInfo, customerName: e.target.value })}
            required
            InputProps={{ startAdornment: <Person sx={{ color: '#999', mr: 1 }} /> }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Số điện thoại"
            fullWidth
            value={customerInfo.customerPhone}
            onChange={(e) => setCustomerInfo({ ...customerInfo, customerPhone: e.target.value })}
            required
            InputProps={{ startAdornment: <Phone sx={{ color: '#999', mr: 1 }} /> }}
            sx={{ mb: 2 }}
          />
          <FormControl sx={{ mb: 1 }}>
            <FormLabel sx={{ fontWeight: 600, color: 'text.primary' }}>Phương thức thanh toán</FormLabel>
            <RadioGroup
              value={customerInfo.paymentMethod}
              onChange={(e) => setCustomerInfo({ ...customerInfo, paymentMethod: e.target.value as 'online' | 'cash' })}
              row
            >
              <FormControlLabel
                value="cash"
                control={<Radio sx={{ '&.Mui-checked': { color: '#006837' } }} />}
                label="Tại sân"
              />
              <FormControlLabel
                value="online"
                control={<Radio sx={{ '&.Mui-checked': { color: '#006837' } }} />}
                label="Online"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setShowConfirmDialog(false)} sx={{ color: '#757575' }}>
            Quay lại
          </Button>
          <Button
            variant="contained"
            disabled={isLoading || !customerInfo.customerName || !customerInfo.customerPhone}
            onClick={handleConfirmBooking}
            sx={{
              bgcolor: '#006837',
              px: 4,
              fontWeight: 700,
              '&:hover': { bgcolor: '#004D25' },
            }}
          >
            {isLoading ? <CircularProgress size={22} color="inherit" /> : 'XÁC NHẬN ĐẶT SÂN'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingSchedule;
