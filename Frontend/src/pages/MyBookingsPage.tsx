import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Chip,
    Tabs,
    Tab,
    IconButton,
    Button,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    ArrowBackRounded as BackIcon,
    AccessTimeRounded as TimeIcon,
    LocationOnRounded as LocationIcon,
    DeleteOutlineRounded as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import { mockBookings, mockCourts, formatPrice, formatDate } from '../data/mockData';
import { Booking } from '../types';

const statusConfig: Record<string, { label: string; color: string; bgcolor: string }> = {
    PENDING_APPROVAL: { label: 'Chờ duyệt', color: '#F57C00', bgcolor: '#FFF3E0' },
    CONFIRMED: { label: 'Đã xác nhận', color: '#2E7D32', bgcolor: '#E8F5E9' },
    PLAYING: { label: 'Đang chơi', color: '#1565C0', bgcolor: '#E3F2FD' },
    COMPLETED: { label: 'Hoàn thành', color: '#616161', bgcolor: '#F5F5F5' },
    CANCELLED: { label: 'Đã hủy', color: '#C62828', bgcolor: '#FFEBEE' },
};

const MyBookingsPage: React.FC = () => {
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
    const [bookings, setBookings] = useState<Booking[]>(
        mockBookings.filter((b) => b.customerId === 'user001')
    );

    const filterStatuses = [
        ['PENDING_APPROVAL', 'CONFIRMED', 'PLAYING'],
        ['COMPLETED'],
        ['CANCELLED'],
    ];

    const filteredBookings = bookings.filter((b) =>
        filterStatuses[tabValue].includes(b.status)
    );

    const handleDelete = (id: string) => {
        setBookings((prev) => prev.filter((b) => b._id !== id));
        setDeleteDialog(null);
    };

    const getCourtName = (courtId: string | object) => {
        const id = typeof courtId === 'string' ? courtId : '';
        return mockCourts.find((c) => c._id === id)?.name || 'Sân không xác định';
    };

    return (
        <MainLayout hideHeader>
            {/* Header */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #004D28 0%, #006D38 100%)',
                    px: 2,
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                }}
            >
                <IconButton onClick={() => navigate(-1)} sx={{ color: 'white' }}>
                    <BackIcon />
                </IconButton>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                    Sân đã đặt
                </Typography>
            </Box>

            {/* Tabs */}
            <Tabs
                value={tabValue}
                onChange={(_, v) => setTabValue(v)}
                variant="fullWidth"
                sx={{
                    bgcolor: 'white',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                    '& .MuiTab-root': {
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textTransform: 'none',
                    },
                    '& .Mui-selected': { color: '#006D38' },
                    '& .MuiTabs-indicator': { bgcolor: '#006D38' },
                }}
            >
                <Tab label={`Đang hoạt động (${bookings.filter(b => filterStatuses[0].includes(b.status)).length})`} />
                <Tab label={`Hoàn thành (${bookings.filter(b => filterStatuses[1].includes(b.status)).length})`} />
                <Tab label={`Đã hủy (${bookings.filter(b => filterStatuses[2].includes(b.status)).length})`} />
            </Tabs>

            {/* Booking list */}
            <Box sx={{ p: 2 }}>
                {filteredBookings.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                        <Typography variant="h4" sx={{ mb: 1 }}>📋</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Không có đơn đặt sân nào
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {filteredBookings.map((booking) => {
                            const status = statusConfig[booking.status];
                            return (
                                <Paper key={booking._id} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                                    {/* Status bar */}
                                    <Box sx={{ bgcolor: status.bgcolor, px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Chip
                                            label={status.label}
                                            size="small"
                                            sx={{ bgcolor: status.color, color: 'white', fontWeight: 600, fontSize: '0.7rem' }}
                                        />
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                            {booking.bookingNumber}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ p: 2 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                                            {getCourtName(booking.courtId)}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                            <TimeIcon sx={{ fontSize: '0.9rem', color: '#999' }} />
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDate(booking.startDate)} | {booking.startTime} - {booking.endTime}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                            <LocationIcon sx={{ fontSize: '0.9rem', color: '#999' }} />
                                            <Typography variant="caption" color="text.secondary">
                                                {booking.durationHours} giờ
                                                {booking.bookingType === 'recurring' && ' • Đặt cố định'}
                                            </Typography>
                                        </Box>

                                        <Divider sx={{ mb: 1.5 }} />

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Tổng cộng
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#D4A017' }}>
                                                    {formatPrice(booking.totalPrice)}
                                                </Typography>
                                            </Box>
                                            {booking.status === 'PENDING_APPROVAL' && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setDeleteDialog(booking._id)}
                                                    sx={{ color: '#E53935' }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </Box>
                                </Paper>
                            );
                        })}
                    </Box>
                )}
            </Box>

            {/* Delete dialog */}
            <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
                <DialogTitle sx={{ fontWeight: 700 }}>Hủy đặt sân?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        Bạn có chắc muốn hủy đơn đặt sân này không? Hành động này không thể hoàn tác.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDeleteDialog(null)} sx={{ borderRadius: 2 }}>
                        Giữ lại
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => deleteDialog && handleDelete(deleteDialog)}
                        sx={{ borderRadius: 2 }}
                    >
                        Hủy đặt sân
                    </Button>
                </DialogActions>
            </Dialog>
        </MainLayout>
    );
};

export default MyBookingsPage;
