import React, { useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    TextField,
    Chip,
} from '@mui/material';
import {
    ArrowBackRounded as BackIcon,
    CalendarTodayRounded as CalendarIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import BookingGrid from '../components/BookingGrid';
import BookingForm from '../components/BookingForm';
import { mockCourts } from '../data/mockData';

const BookingPage: React.FC = () => {
    const { courtId } = useParams<{ courtId: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const bookingType = searchParams.get('type') || 'single';

    const court = mockCourts.find((c) => c._id === courtId);

    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);
    const [selectedSlots, setSelectedSlots] = useState<{ courtIndex: number; time: string }[]>([]);

    if (!court) {
        return (
            <MainLayout>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography>Không tìm thấy sân</Typography>
                </Box>
            </MainLayout>
        );
    }

    const handleSlotSelect = (courtIndex: number, time: string) => {
        setSelectedSlots((prev) => {
            const exists = prev.find((s) => s.courtIndex === courtIndex && s.time === time);
            if (exists) {
                return prev.filter((s) => !(s.courtIndex === courtIndex && s.time === time));
            }
            return [...prev, { courtIndex, time }];
        });
    };

    const typeLabels: Record<string, { label: string; color: string }> = {
        single: { label: 'Đặt theo ngày', color: '#43A047' },
        recurring: { label: 'Đặt cố định', color: '#1E88E5' },
        event: { label: 'Sự kiện', color: '#E91E63' },
    };

    const typeInfo = typeLabels[bookingType] || typeLabels.single;

    return (
        <MainLayout hideHeader>
            {/* Header */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #004D28 0%, #006D38 100%)',
                    px: 2,
                    py: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                }}
            >
                <IconButton onClick={() => navigate(-1)} sx={{ color: 'white' }}>
                    <BackIcon />
                </IconButton>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 700 }}>
                        {court.name}
                    </Typography>
                    <Chip
                        label={typeInfo.label}
                        size="small"
                        sx={{
                            bgcolor: typeInfo.color,
                            color: 'white',
                            fontSize: '0.65rem',
                            height: 20,
                            mt: 0.3,
                        }}
                    />
                </Box>
            </Box>

            <Box sx={{ p: 2 }}>
                {/* Date picker */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <CalendarIcon sx={{ color: '#006D38' }} />
                    <TextField
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setSelectedSlots([]);
                        }}
                        size="small"
                        sx={{
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            },
                        }}
                    />
                </Box>

                {/* Booking grid */}
                <BookingGrid
                    court={court}
                    selectedDate={selectedDate}
                    onSlotSelect={handleSlotSelect}
                    selectedSlots={selectedSlots}
                />

                {/* Selected info */}
                {selectedSlots.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#006D38' }}>
                            Đã chọn {selectedSlots.length} khung giờ
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                            {selectedSlots.map((s) => (
                                <Chip
                                    key={`${s.courtIndex}-${s.time}`}
                                    label={`Sân ${String.fromCharCode(65 + s.courtIndex)} - ${s.time}`}
                                    size="small"
                                    onDelete={() => handleSlotSelect(s.courtIndex, s.time)}
                                    sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontSize: '0.7rem' }}
                                />
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Booking form */}
                {selectedSlots.length > 0 && (
                    <BookingForm
                        court={court}
                        selectedSlots={selectedSlots}
                        onSubmit={() => {
                            setSelectedSlots([]);
                            setTimeout(() => navigate('/my-bookings'), 2000);
                        }}
                        onCancel={() => setSelectedSlots([])}
                    />
                )}
            </Box>
        </MainLayout>
    );
};

export default BookingPage;
