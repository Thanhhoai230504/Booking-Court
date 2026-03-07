import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import MainLayout from '../components/Layout/MainLayout';
import HeroBanner from '../components/HeroBanner';
import CourtCard from '../components/CourtCard';
import BookingTypeModal from '../components/BookingTypeModal';
import { mockCourts } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import { BookingTypeOption } from '../types';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCourtId, setSelectedCourtId] = useState<string>('');

    const selectedCourt = mockCourts.find((c) => c._id === selectedCourtId);

    const handleBook = (courtId: string) => {
        setSelectedCourtId(courtId);
        setModalOpen(true);
    };

    const handleBookingTypeSelect = (type: BookingTypeOption) => {
        setModalOpen(false);
        navigate(`/booking/${selectedCourtId}?type=${type}`);
    };

    return (
        <MainLayout>
            <HeroBanner />

            {/* Section header */}
            <Box sx={{ px: { xs: 2, md: 4 }, mt: 2.5, mb: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                        Sân Pickleball gần bạn
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: '#006D38',
                            fontWeight: 600,
                            cursor: 'pointer',
                            '&:hover': { textDecoration: 'underline' },
                        }}
                    >
                        Xem tất cả →
                    </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                    {mockCourts.length} sân đang hoạt động tại Hồ Chí Minh
                </Typography>
            </Box>

            {/* Court grid */}
            <Box sx={{ px: { xs: 2, md: 4 } }}>
                <Grid container spacing={2}>
                    {mockCourts.map((court) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={court._id}>
                            <CourtCard court={court} onBook={handleBook} />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Booking type modal */}
            <BookingTypeModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSelect={handleBookingTypeSelect}
                courtName={selectedCourt?.name || ''}
            />
        </MainLayout>
    );
};

export default HomePage;
