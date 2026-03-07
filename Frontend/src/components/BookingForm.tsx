import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    ToggleButtonGroup,
    ToggleButton,
    Paper,
    Divider,
    Alert,
} from '@mui/material';
import {
    PaymentRounded as PaymentIcon,
    AccountBalanceWalletRounded as CashIcon,
} from '@mui/icons-material';
import { Court } from '../types';
import { formatPrice, currentUser } from '../data/mockData';

interface BookingFormProps {
    court: Court;
    selectedSlots: { courtIndex: number; time: string }[];
    onSubmit: () => void;
    onCancel: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ court, selectedSlots, onSubmit, onCancel }) => {
    const [customerName, setCustomerName] = useState(currentUser.name);
    const [customerPhone, setCustomerPhone] = useState(currentUser.phone);
    const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('online');
    const [notes, setNotes] = useState('');
    const [submitted, setSubmitted] = useState(false);

    if (selectedSlots.length === 0) return null;

    const sortedSlots = [...selectedSlots].sort((a, b) => a.time.localeCompare(b.time));
    const startTime = sortedSlots[0].time;
    const lastSlotH = parseInt(sortedSlots[sortedSlots.length - 1].time.split(':')[0]);
    const endTime = `${(lastSlotH + 1).toString().padStart(2, '0')}:00`;
    const durationHours = selectedSlots.length;
    const totalPrice = durationHours * court.pricePerHour;

    const handleSubmit = () => {
        setSubmitted(true);
        setTimeout(() => {
            onSubmit();
        }, 1500);
    };

    if (submitted) {
        return (
            <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
                <Box sx={{ fontSize: 48, mb: 2 }}>🎉</Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#006D38', mb: 1 }}>
                    Đặt sân thành công!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Đơn đặt sân của bạn đang chờ phê duyệt. Chúng tôi sẽ thông báo cho bạn sớm nhất.
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Xác nhận đặt sân
            </Typography>

            {/* Booking summary */}
            <Box
                sx={{
                    bgcolor: '#F5F9F7',
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    border: '1px solid rgba(0,109,56,0.1)',
                }}
            >
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#006D38' }}>
                    {court.name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">Sân:</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {[...new Set(selectedSlots.map(s => `Sân ${String.fromCharCode(65 + s.courtIndex)}`))].join(', ')}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">Khung giờ:</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{startTime} - {endTime}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">Thời lượng:</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{durationHours} giờ</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Tổng cộng:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#D4A017' }}>
                        {formatPrice(totalPrice)}
                    </Typography>
                </Box>
            </Box>

            {/* Contact info */}
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Thông tin liên hệ
            </Typography>
            <TextField
                fullWidth
                size="small"
                label="Họ và tên"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                sx={{ mb: 1.5 }}
            />
            <TextField
                fullWidth
                size="small"
                label="Số điện thoại"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                sx={{ mb: 2 }}
            />

            {/* Payment method */}
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Phương thức thanh toán
            </Typography>
            <ToggleButtonGroup
                value={paymentMethod}
                exclusive
                onChange={(_, val) => val && setPaymentMethod(val)}
                fullWidth
                sx={{ mb: 2 }}
            >
                <ToggleButton
                    value="online"
                    sx={{
                        textTransform: 'none',
                        borderRadius: '8px !important',
                        mr: 1,
                        '&.Mui-selected': {
                            bgcolor: 'rgba(0,109,56,0.08)',
                            borderColor: '#006D38',
                            color: '#006D38',
                        },
                    }}
                >
                    <PaymentIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Chuyển khoản</Typography>
                </ToggleButton>
                <ToggleButton
                    value="cash"
                    sx={{
                        textTransform: 'none',
                        borderRadius: '8px !important',
                        '&.Mui-selected': {
                            bgcolor: 'rgba(0,109,56,0.08)',
                            borderColor: '#006D38',
                            color: '#006D38',
                        },
                    }}
                >
                    <CashIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Tiền mặt</Typography>
                </ToggleButton>
            </ToggleButtonGroup>

            {/* Notes */}
            <TextField
                fullWidth
                size="small"
                label="Ghi chú (tùy chọn)"
                multiline
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                sx={{ mb: 2 }}
            />

            <Alert severity="info" sx={{ mb: 2, borderRadius: 2, fontSize: '0.75rem' }}>
                Đơn đặt sân sẽ ở trạng thái chờ duyệt. Chủ sân sẽ xác nhận trong vòng 30 phút.
            </Alert>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={onCancel}
                    sx={{ borderRadius: 2 }}
                >
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={handleSubmit}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                    Xác nhận đặt sân
                </Button>
            </Box>
        </Paper>
    );
};

export default BookingForm;
