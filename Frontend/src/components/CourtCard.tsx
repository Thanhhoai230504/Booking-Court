import React, { useState } from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Button,
    IconButton,
    Chip,
    Rating,
} from '@mui/material';
import {
    FavoriteBorderRounded as FavIcon,
    FavoriteRounded as FavFilledIcon,
    ShareRounded as ShareIcon,
    AccessTimeRounded as TimeIcon,
    LocationOnRounded as LocationIcon,
    SportsTennisRounded as CourtIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Court } from '../types';
import { formatPrice } from '../data/mockData';

interface CourtCardProps {
    court: Court;
    onBook?: (courtId: string) => void;
}

const CourtCard: React.FC<CourtCardProps> = ({ court, onBook }) => {
    const navigate = useNavigate();
    const [isFav, setIsFav] = useState(false);

    const courtColors = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    ];

    const colorIndex = parseInt(court._id.replace(/\D/g, '')) % courtColors.length;

    return (
        <Card
            sx={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            {/* Image placeholder */}
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    sx={{
                        height: 160,
                        background: courtColors[colorIndex],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <CourtIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.3)' }} />
                </CardMedia>

                {/* Badges */}
                <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 0.5 }}>
                    <Chip
                        label="Đơn ngày"
                        size="small"
                        sx={{
                            bgcolor: 'rgba(0,109,56,0.85)',
                            color: 'white',
                            fontSize: '0.65rem',
                            height: 22,
                            backdropFilter: 'blur(4px)',
                        }}
                    />
                    {court.totalCourts > 2 && (
                        <Chip
                            label="Cố định"
                            size="small"
                            sx={{
                                bgcolor: 'rgba(30,136,229,0.85)',
                                color: 'white',
                                fontSize: '0.65rem',
                                height: 22,
                                backdropFilter: 'blur(4px)',
                            }}
                        />
                    )}
                </Box>

                {/* Favorite & Share */}
                <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
                    <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); setIsFav(!isFav); }}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.85)',
                            width: 30,
                            height: 30,
                            backdropFilter: 'blur(4px)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                        }}
                    >
                        {isFav ? (
                            <FavFilledIcon sx={{ fontSize: 16, color: '#E53935' }} />
                        ) : (
                            <FavIcon sx={{ fontSize: 16, color: '#666' }} />
                        )}
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.85)',
                            width: 30,
                            height: 30,
                            backdropFilter: 'blur(4px)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                        }}
                    >
                        <ShareIcon sx={{ fontSize: 16, color: '#666' }} />
                    </IconButton>
                </Box>

                {/* Rating */}
                {court.rating && (
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 8,
                            left: 8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            bgcolor: 'rgba(0,0,0,0.6)',
                            borderRadius: 2,
                            px: 1,
                            py: 0.3,
                            backdropFilter: 'blur(4px)',
                        }}
                    >
                        <Rating value={1} max={1} readOnly size="small" sx={{ fontSize: '0.85rem' }} />
                        <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, fontSize: '0.75rem' }}>
                            {court.rating}
                        </Typography>
                    </Box>
                )}
            </Box>

            <CardContent sx={{ p: 1.5, pb: '12px !important', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Court name */}
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        lineHeight: 1.3,
                        mb: 0.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                    onClick={() => navigate(`/court/${court._id}`)}
                >
                    {court.name}
                </Typography>

                {/* Address */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mb: 0.3 }}>
                    <LocationIcon sx={{ fontSize: '0.85rem', color: '#999', mt: 0.2 }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', lineHeight: 1.3 }}>
                        {court.address}
                    </Typography>
                </Box>

                {/* Hours */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <TimeIcon sx={{ fontSize: '0.85rem', color: '#999' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        {court.openingHours.start} - {court.openingHours.end}
                    </Typography>
                </Box>

                {/* Price + Book button */}
                <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#006D38', fontSize: '0.8rem' }}>
                        {formatPrice(court.pricePerHour)}/h
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onBook) onBook(court._id);
                        }}
                        sx={{
                            fontSize: '0.7rem',
                            py: 0.5,
                            px: 1.5,
                            borderRadius: 2,
                            fontWeight: 700,
                            minWidth: 'auto',
                        }}
                    >
                        ĐẶT LỊCH
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CourtCard;
