import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    Typography,
    Skeleton,
    Alert,
    Paper,
    Button,
} from '@mui/material';
import {
    FavoriteRounded as FavIcon,
    ArrowBackRounded as BackIcon,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store/store';
import { fetchAvailableCourts } from '../../store/slices/courtSlice';
import CourtCard from '../../components/SlideBar';

const FavoriteCourts: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { courts, isLoading } = useSelector((state: RootState) => state.courts);
    const { favoriteIds } = useSelector((state: RootState) => state.favorites);

    useEffect(() => {
        if (courts.length === 0) {
            dispatch(fetchAvailableCourts());
        }
    }, [dispatch, courts.length]);

    const favoriteCourts = courts.filter((c) => favoriteIds.includes(c._id));

    return (
        <Box>
            {/* Header */}
            <Paper
                elevation={0}
                sx={{
                    borderBottom: '1px solid #e0e0e0',
                    bgcolor: 'white',
                    py: 2,
                    position: 'sticky',
                    top: 72,
                    zIndex: 10,
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            startIcon={<BackIcon />}
                            onClick={() => navigate('/account')}
                            sx={{ color: '#006837', fontWeight: 600 }}
                        >
                            Quay lại
                        </Button>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#C62828' }}>
                            <FavIcon />
                            <Typography fontWeight={700} fontSize="1.1rem">
                                Sân yêu thích
                            </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                            <strong style={{ color: '#C62828' }}>{favoriteCourts.length}</strong> sân yêu thích
                        </Typography>
                    </Box>
                </Container>
            </Paper>

            {/* Content */}
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {isLoading ? (
                    <Grid container spacing={3}>
                        {[...Array(3)].map((_, i) => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <Skeleton
                                    variant="rounded"
                                    height={340}
                                    sx={{ borderRadius: 3 }}
                                    animation="wave"
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : favoriteCourts.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 8,
                        }}
                    >
                        <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>
                            💚
                        </Typography>
                        <Typography variant="h5" fontWeight={700} color="text.secondary" gutterBottom>
                            Chưa có sân yêu thích
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Hãy bấm vào biểu tượng trái tim trên các sân để thêm vào danh sách yêu thích
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/')}
                            sx={{
                                bgcolor: '#006837',
                                borderRadius: 2,
                                px: 4,
                                fontWeight: 600,
                                '&:hover': { bgcolor: '#004D25' },
                            }}
                        >
                            Khám phá sân
                        </Button>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {favoriteCourts.map((court, index) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                key={court._id}
                                sx={{
                                    animation: `fadeInUp 0.5s ease forwards`,
                                    animationDelay: `${index * 0.1}s`,
                                    opacity: 0,
                                }}
                            >
                                <CourtCard court={court} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default FavoriteCourts;
