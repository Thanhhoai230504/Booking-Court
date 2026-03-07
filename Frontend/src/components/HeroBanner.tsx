import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import {
    ChevronLeftRounded as PrevIcon,
    ChevronRightRounded as NextIcon,
} from '@mui/icons-material';
import { mockBanners } from '../data/mockData';

const HeroBanner: React.FC = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % mockBanners.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const goTo = (index: number) => {
        setCurrent((index + mockBanners.length) % mockBanners.length);
    };

    return (
        <Box sx={{ position: 'relative', overflow: 'hidden', mx: 2, mt: 2, borderRadius: 3 }}>
            <Box
                sx={{
                    display: 'flex',
                    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: `translateX(-${current * 100}%)`,
                }}
            >
                {mockBanners.map((banner) => (
                    <Box
                        key={banner.id}
                        sx={{
                            minWidth: '100%',
                            background: banner.gradient,
                            borderRadius: 3,
                            p: 3,
                            py: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            minHeight: 140,
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: -20,
                                right: -20,
                                width: 120,
                                height: 120,
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -30,
                                left: '40%',
                                width: 160,
                                height: 160,
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.05)',
                            },
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'white',
                                fontWeight: 700,
                                mb: 0.5,
                                textShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                position: 'relative',
                                zIndex: 1,
                            }}
                        >
                            {banner.title}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'rgba(255,255,255,0.9)',
                                position: 'relative',
                                zIndex: 1,
                                maxWidth: '85%',
                            }}
                        >
                            {banner.subtitle}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Navigation arrows */}
            <IconButton
                onClick={() => goTo(current - 1)}
                sx={{
                    position: 'absolute',
                    left: 4,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.25)',
                    color: 'white',
                    width: 28,
                    height: 28,
                    backdropFilter: 'blur(4px)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.4)' },
                }}
            >
                <PrevIcon fontSize="small" />
            </IconButton>
            <IconButton
                onClick={() => goTo(current + 1)}
                sx={{
                    position: 'absolute',
                    right: 4,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.25)',
                    color: 'white',
                    width: 28,
                    height: 28,
                    backdropFilter: 'blur(4px)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.4)' },
                }}
            >
                <NextIcon fontSize="small" />
            </IconButton>

            {/* Dots */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 0.8,
                }}
            >
                {mockBanners.map((_, i) => (
                    <Box
                        key={i}
                        onClick={() => setCurrent(i)}
                        sx={{
                            width: i === current ? 20 : 6,
                            height: 6,
                            borderRadius: 3,
                            bgcolor: i === current ? 'white' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default HeroBanner;
