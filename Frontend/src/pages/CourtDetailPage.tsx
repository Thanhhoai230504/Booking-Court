import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Chip,
    Rating,
    IconButton,
    Divider,
    Paper,
} from '@mui/material';
import {
    ArrowBackRounded as BackIcon,
    LocationOnRounded as LocationIcon,
    AccessTimeRounded as TimeIcon,
    SportsTennisRounded as CourtIcon,
    FavoriteBorderRounded as FavIcon,
    FavoriteRounded as FavFilledIcon,
    ShareRounded as ShareIcon,
    PhoneRounded as PhoneIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import BookingTypeModal from '../components/BookingTypeModal';
import { mockCourts } from '../data/mockData';
import { formatPrice } from '../data/mockData';
import { BookingTypeOption } from '../types';

const CourtDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isFav, setIsFav] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const court = mockCourts.find((c) => c._id === id);

    if (!court) {
        return (
            <MainLayout>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography>Không tìm thấy sân</Typography>
                </Box>
            </MainLayout>
        );
    }

    const courtColors = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    ];
    const colorIndex = parseInt(court._id.replace(/\D/g, '')) % courtColors.length;

    const handleBookingTypeSelect = (type: BookingTypeOption) => {
        setModalOpen(false);
        navigate(`/booking/${court._id}?type=${type}`);
    };

    return (
        <MainLayout hideHeader>
            {/* Hero image */}
            <Box sx={{ position: 'relative' }}>
                <Box
                    sx={{
                        height: 250,
                        background: courtColors[colorIndex],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <CourtIcon sx={{ fontSize: 100, color: 'rgba(255,255,255,0.2)' }} />
                </Box>

                {/* Back button */}
                <IconButton
                    onClick={() => navigate(-1)}
                    sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        bgcolor: 'rgba(0,0,0,0.4)',
                        color: 'white',
                        backdropFilter: 'blur(8px)',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
                    }}
                >
                    <BackIcon />
                </IconButton>

                {/* Actions */}
                <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
                    <IconButton
                        onClick={() => setIsFav(!isFav)}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(8px)',
                            '&:hover': { bgcolor: 'white' },
                        }}
                    >
                        {isFav ? <FavFilledIcon sx={{ color: '#E53935' }} /> : <FavIcon />}
                    </IconButton>
                    <IconButton
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(8px)',
                            '&:hover': { bgcolor: 'white' },
                        }}
                    >
                        <ShareIcon />
                    </IconButton>
                </Box>

                {/* Rating badge */}
                {court.rating && (
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 16,
                            left: 16,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            bgcolor: 'rgba(0,0,0,0.7)',
                            borderRadius: 2,
                            px: 1.5,
                            py: 0.5,
                            backdropFilter: 'blur(8px)',
                        }}
                    >
                        <Rating value={court.rating} readOnly size="small" precision={0.1} />
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                            {court.rating}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            ({court.reviewCount})
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Content */}
            <Box sx={{ p: 2.5, mt: -2, position: 'relative', bgcolor: '#F5F5F5', borderRadius: '16px 16px 0 0' }}>
                {/* Name & badges */}
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip label="Đơn ngày" size="small" sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 600 }} />
                    {court.totalCourts > 2 && (
                        <Chip label="Cố định" size="small" sx={{ bgcolor: '#E3F2FD', color: '#1565C0', fontWeight: 600 }} />
                    )}
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {court.name}
                </Typography>

                {/* Info rows */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                    <LocationIcon sx={{ fontSize: '1.1rem', color: '#666' }} />
                    <Typography variant="body2" color="text.secondary">
                        {court.address}, {court.city}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                    <TimeIcon sx={{ fontSize: '1.1rem', color: '#666' }} />
                    <Typography variant="body2" color="text.secondary">
                        {court.openingHours.start} - {court.openingHours.end}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CourtIcon sx={{ fontSize: '1.1rem', color: '#666' }} />
                    <Typography variant="body2" color="text.secondary">
                        {court.totalCourts} sân
                    </Typography>
                </Box>

                {/* Description */}
                <Paper sx={{ p: 2, borderRadius: 3, mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                        Mô tả
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {court.description}
                    </Typography>
                </Paper>

                {/* Pricing */}
                <Paper sx={{ p: 2, borderRadius: 3, mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                        Bảng giá
                    </Typography>
                    {court.hourlyPricing.map((p, i) => (
                        <Box key={i}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {p.hour}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#006D38' }}>
                                    {formatPrice(p.price)}/h
                                </Typography>
                            </Box>
                            {i < court.hourlyPricing.length - 1 && <Divider />}
                        </Box>
                    ))}
                </Paper>

                {/* Contact */}
                <Paper sx={{ p: 2, borderRadius: 3, mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                        Liên hệ
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ color: '#006D38' }} />
                        <Typography variant="body2">0987 654 321</Typography>
                    </Box>
                </Paper>

                {/* Book button */}
                <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    size="large"
                    onClick={() => setModalOpen(true)}
                    sx={{
                        borderRadius: 3,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 700,
                    }}
                >
                    ĐẶT LỊCH NGAY
                </Button>
            </Box>

            <BookingTypeModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSelect={handleBookingTypeSelect}
                courtName={court.name}
            />
        </MainLayout>
    );
};

export default CourtDetailPage;
