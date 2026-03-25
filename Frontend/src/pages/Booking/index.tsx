import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  Chip,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  ArrowBack,
  CalendarMonth,
  AccessTime,
  Person,
  Phone,
  Payment,
  CheckCircle,
  SportsTennis,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store/store';
import { fetchCourtDetail } from '../../store/slices/courtSlice';
import { createBooking, resetCreateSuccess } from '../../store/slices/bookingSlice';

const steps = ['Chọn thời gian', 'Thông tin cá nhân', 'Xác nhận'];

const Booking: React.FC = () => {
  const { courtId } = useParams<{ courtId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedCourt: court } = useSelector((state: RootState) => state.courts);
  const { isLoading, error, createSuccess } = useSelector((state: RootState) => state.bookings);
  const { user } = useSelector((state: RootState) => state.auth);

  const [activeStep, setActiveStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    startTime: '',
    endTime: '',
    durationHours: 1,
    customerName: user?.name || '',
    customerPhone: '',
    bookingType: 'single' as 'single' | 'recurring',
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

  useEffect(() => {
    if (user) {
      setBookingData(prev => ({
        ...prev,
        customerName: user.name || '',
      }));
    }
  }, [user]);

  // Auto-calculate duration
  useEffect(() => {
    if (bookingData.startTime && bookingData.endTime) {
      const [sh, sm] = bookingData.startTime.split(':').map(Number);
      const [eh, em] = bookingData.endTime.split(':').map(Number);
      const duration = (eh * 60 + em - sh * 60 - sm) / 60;
      if (duration > 0) {
        setBookingData(prev => ({ ...prev, durationHours: duration }));
      }
    }
  }, [bookingData.startTime, bookingData.endTime]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookingData({ ...bookingData, [field]: e.target.value });
  };

  const handleSubmit = () => {
    if (!courtId) return;
    dispatch(createBooking({
      courtId,
      startDate: bookingData.startDate,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      durationHours: bookingData.durationHours,
      customerName: bookingData.customerName,
      customerPhone: bookingData.customerPhone,
      bookingType: bookingData.bookingType,
      paymentMethod: bookingData.paymentMethod,
    }));
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

  const totalPrice = court ? court.pricePerHour * bookingData.durationHours : 0;

  const canProceedStep0 = bookingData.startDate && bookingData.startTime && bookingData.endTime && bookingData.durationHours > 0;
  const canProceedStep1 = bookingData.customerName && bookingData.customerPhone;

  // Success view
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
            sx={{
              bgcolor: '#006837',
              px: 4,
              py: 1.5,
              fontWeight: 700,
              '&:hover': { bgcolor: '#004D25' },
            }}
          >
            Xem đơn đặt sân
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{
              borderColor: '#006837',
              color: '#006837',
              px: 4,
              py: 1.5,
              fontWeight: 700,
            }}
          >
            Về trang chủ
          </Button>
        </Box>
      </Container>
    );
  }

  if (!court) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#006837' }} />
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Top bar */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0', py: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Đặt sân - {court.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {court.address}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Stepper */}
        <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      '&.Mui-active': { color: '#006837' },
                      '&.Mui-completed': { color: '#006837' },
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
        )}

        <Grid container spacing={3}>
          {/* Left - Form */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              {/* Step 0: Time selection */}
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarMonth sx={{ color: '#006837' }} /> Chọn thời gian
                  </Typography>

                  <Grid container spacing={2.5}>
                    <Grid item xs={12}>
                      <TextField
                        label="Ngày đặt sân"
                        type="date"
                        fullWidth
                        value={bookingData.startDate}
                        onChange={handleChange('startDate')}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: new Date().toISOString().split('T')[0] }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Giờ bắt đầu"
                        type="time"
                        fullWidth
                        value={bookingData.startTime}
                        onChange={handleChange('startTime')}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Giờ kết thúc"
                        type="time"
                        fullWidth
                        value={bookingData.endTime}
                        onChange={handleChange('endTime')}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Paper
                        variant="outlined"
                        sx={{ p: 2, borderRadius: 2, bgcolor: '#F1F8E9', borderColor: '#C8E6C9' }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Thời lượng
                          </Typography>
                          <Typography fontWeight={700} color="#006837">
                            {bookingData.durationHours > 0 ? `${bookingData.durationHours} giờ` : '—'}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                      variant="contained"
                      disabled={!canProceedStep0}
                      onClick={() => setActiveStep(1)}
                      sx={{
                        bgcolor: '#006837',
                        px: 4,
                        py: 1.2,
                        fontWeight: 700,
                        '&:hover': { bgcolor: '#004D25' },
                      }}
                    >
                      Tiếp theo
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Step 1: Personal info */}
              {activeStep === 1 && (
                <Box>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person sx={{ color: '#006837' }} /> Thông tin cá nhân
                  </Typography>

                  <Grid container spacing={2.5}>
                    <Grid item xs={12}>
                      <TextField
                        label="Họ và tên"
                        fullWidth
                        value={bookingData.customerName}
                        onChange={handleChange('customerName')}
                        required
                        InputProps={{
                          startAdornment: <Person sx={{ color: '#999', mr: 1 }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Số điện thoại"
                        fullWidth
                        value={bookingData.customerPhone}
                        onChange={handleChange('customerPhone')}
                        required
                        InputProps={{
                          startAdornment: <Phone sx={{ color: '#999', mr: 1 }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl>
                        <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                          Phương thức thanh toán
                        </FormLabel>
                        <RadioGroup
                          value={bookingData.paymentMethod}
                          onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value as 'online' | 'cash' })}
                          row
                        >
                          <FormControlLabel
                            value="cash"
                            control={<Radio sx={{ '&.Mui-checked': { color: '#006837' } }} />}
                            label="Thanh toán tại sân"
                          />
                          <FormControlLabel
                            value="online"
                            control={<Radio sx={{ '&.Mui-checked': { color: '#006837' } }} />}
                            label="Thanh toán online"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button
                      variant="outlined"
                      onClick={() => setActiveStep(0)}
                      sx={{ borderColor: '#006837', color: '#006837' }}
                    >
                      Quay lại
                    </Button>
                    <Button
                      variant="contained"
                      disabled={!canProceedStep1}
                      onClick={() => setActiveStep(2)}
                      sx={{
                        bgcolor: '#006837',
                        px: 4,
                        py: 1.2,
                        fontWeight: 700,
                        '&:hover': { bgcolor: '#004D25' },
                      }}
                    >
                      Tiếp theo
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Step 2: Confirmation */}
              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ color: '#006837' }} /> Xác nhận đặt sân
                  </Typography>

                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, mb: 2.5 }}>
                    <Typography fontWeight={700} sx={{ mb: 2, color: '#006837' }}>
                      🏓 Thông tin sân
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={5}><Typography variant="body2" color="text.secondary">Sân</Typography></Grid>
                      <Grid item xs={7}><Typography variant="body2" fontWeight={600}>{court.name}</Typography></Grid>
                      <Grid item xs={5}><Typography variant="body2" color="text.secondary">Địa chỉ</Typography></Grid>
                      <Grid item xs={7}><Typography variant="body2" fontWeight={600}>{court.address}</Typography></Grid>
                    </Grid>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, mb: 2.5 }}>
                    <Typography fontWeight={700} sx={{ mb: 2, color: '#006837' }}>
                      📅 Thời gian
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={5}><Typography variant="body2" color="text.secondary">Ngày</Typography></Grid>
                      <Grid item xs={7}><Typography variant="body2" fontWeight={600}>{bookingData.startDate}</Typography></Grid>
                      <Grid item xs={5}><Typography variant="body2" color="text.secondary">Giờ</Typography></Grid>
                      <Grid item xs={7}><Typography variant="body2" fontWeight={600}>{bookingData.startTime} - {bookingData.endTime}</Typography></Grid>
                      <Grid item xs={5}><Typography variant="body2" color="text.secondary">Thời lượng</Typography></Grid>
                      <Grid item xs={7}><Typography variant="body2" fontWeight={600}>{bookingData.durationHours} giờ</Typography></Grid>
                    </Grid>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, mb: 2.5 }}>
                    <Typography fontWeight={700} sx={{ mb: 2, color: '#006837' }}>
                      👤 Khách hàng
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={5}><Typography variant="body2" color="text.secondary">Tên</Typography></Grid>
                      <Grid item xs={7}><Typography variant="body2" fontWeight={600}>{bookingData.customerName}</Typography></Grid>
                      <Grid item xs={5}><Typography variant="body2" color="text.secondary">Điện thoại</Typography></Grid>
                      <Grid item xs={7}><Typography variant="body2" fontWeight={600}>{bookingData.customerPhone}</Typography></Grid>
                      <Grid item xs={5}><Typography variant="body2" color="text.secondary">Thanh toán</Typography></Grid>
                      <Grid item xs={7}>
                        <Chip
                          label={bookingData.paymentMethod === 'cash' ? 'Tại sân' : 'Online'}
                          size="small"
                          sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 600 }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Total */}
                  <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: '#006837', color: 'white', mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography fontWeight={700} fontSize="1.1rem">
                        Tổng tiền
                      </Typography>
                      <Typography fontWeight={800} fontSize="1.5rem">
                        {formatPrice(totalPrice)}
                      </Typography>
                    </Box>
                  </Paper>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      variant="outlined"
                      onClick={() => setActiveStep(1)}
                      sx={{ borderColor: '#006837', color: '#006837' }}
                    >
                      Quay lại
                    </Button>
                    <Button
                      variant="contained"
                      disabled={isLoading}
                      onClick={handleSubmit}
                      sx={{
                        bgcolor: '#006837',
                        px: 5,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 700,
                        '&:hover': { bgcolor: '#004D25' },
                      }}
                    >
                      {isLoading ? <CircularProgress size={24} color="inherit" /> : 'XÁC NHẬN ĐẶT SÂN'}
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Right - Booking summary */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 100 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SportsTennis sx={{ color: '#006837' }} /> {court.name}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Giá/giờ</Typography>
                  <Typography variant="body2" fontWeight={600}>{formatPrice(court.pricePerHour)}</Typography>
                </Box>
                {bookingData.durationHours > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Thời lượng</Typography>
                    <Typography variant="body2" fontWeight={600}>{bookingData.durationHours} giờ</Typography>
                  </Box>
                )}
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography fontWeight={700}>Tổng cộng</Typography>
                  <Typography fontWeight={700} color="#006837" fontSize="1.1rem">
                    {formatPrice(totalPrice)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Booking;
