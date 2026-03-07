import React, { useMemo, useState } from 'react';
import {
    Box,
    Typography,
    Chip,
    Paper,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    ChevronLeftRounded as PrevIcon,
    ChevronRightRounded as NextIcon,
} from '@mui/icons-material';
import { Court, CourtTimeSlots } from '../types';
import { generateTimeSlots, formatPrice } from '../data/mockData';

interface BookingGridProps {
    court: Court;
    selectedDate: string;
    onSlotSelect: (courtIndex: number, time: string) => void;
    selectedSlots: { courtIndex: number; time: string }[];
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    available: { bg: '#FFFFFF', text: '#333', label: 'Trống' },
    booked: { bg: '#EF5350', text: '#FFF', label: 'Đã đặt' },
    locked: { bg: '#BDBDBD', text: '#FFF', label: 'Khóa' },
    event: { bg: '#F48FB1', text: '#FFF', label: 'Sự kiện' },
    selected: { bg: '#43A047', text: '#FFF', label: 'Đã chọn' },
};

const BookingGrid: React.FC<BookingGridProps> = ({ court, selectedDate, onSlotSelect, selectedSlots }) => {
    const [scrollOffset, setScrollOffset] = useState(0);
    const timeSlots: CourtTimeSlots[] = useMemo(
        () => generateTimeSlots(court._id, selectedDate),
        [court._id, selectedDate]
    );

    if (timeSlots.length === 0) return null;

    const allTimes = timeSlots[0].slots.map((s) => s.time);
    const visibleCount = 8;
    const maxOffset = Math.max(0, allTimes.length - visibleCount);
    const visibleTimes = allTimes.slice(scrollOffset, scrollOffset + visibleCount);

    const isSelected = (courtIndex: number, time: string) =>
        selectedSlots.some((s) => s.courtIndex === courtIndex && s.time === time);

    const getPriceForTime = (time: string): number => {
        const hour = parseInt(time.split(':')[0]);
        const pricing = court.hourlyPricing.find((p) => {
            const [start] = p.hour.split('-');
            const startH = parseInt(start.split(':')[0]);
            const endH = parseInt(p.hour.split('-')[1].split(':')[0]);
            return hour >= startH && hour < endH;
        });
        return pricing?.price || court.pricePerHour;
    };

    return (
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            {/* Legend */}
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    px: 2,
                    py: 1.5,
                    bgcolor: '#FAFAFA',
                    borderBottom: '1px solid #eee',
                    flexWrap: 'wrap',
                }}
            >
                {Object.entries(statusColors).map(([key, val]) => (
                    <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box
                            sx={{
                                width: 14,
                                height: 14,
                                borderRadius: 1,
                                bgcolor: val.bg,
                                border: key === 'available' ? '1px solid #ddd' : 'none',
                            }}
                        />
                        <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#666' }}>
                            {val.label}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Time scroll controls */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: '#006D38',
                    color: 'white',
                }}
            >
                <IconButton
                    size="small"
                    disabled={scrollOffset === 0}
                    onClick={() => setScrollOffset(Math.max(0, scrollOffset - 2))}
                    sx={{ color: 'white', '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' } }}
                >
                    <PrevIcon fontSize="small" />
                </IconButton>

                <Box
                    sx={{
                        display: 'flex',
                        flex: 1,
                        pl: 8,
                    }}
                >
                    <Box sx={{ width: 'auto' }} />
                    {visibleTimes.map((time) => (
                        <Box
                            key={time}
                            sx={{
                                flex: 1,
                                textAlign: 'center',
                                py: 1,
                                minWidth: 56,
                            }}
                        >
                            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem', color: 'white' }}>
                                {time}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', fontSize: '0.55rem', color: 'rgba(255,255,255,0.7)' }}>
                                {formatPrice(getPriceForTime(time))}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <IconButton
                    size="small"
                    disabled={scrollOffset >= maxOffset}
                    onClick={() => setScrollOffset(Math.min(maxOffset, scrollOffset + 2))}
                    sx={{ color: 'white', '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' } }}
                >
                    <NextIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Grid body */}
            {timeSlots.map((courtSlots) => (
                <Box
                    key={courtSlots.courtIndex}
                    sx={{
                        display: 'flex',
                        alignItems: 'stretch',
                        borderBottom: '1px solid #f0f0f0',
                        '&:last-child': { borderBottom: 'none' },
                    }}
                >
                    {/* Court name */}
                    <Box
                        sx={{
                            width: 80,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            px: 1,
                            py: 1.5,
                            bgcolor: '#FAFAFA',
                            borderRight: '1px solid #eee',
                            flexShrink: 0,
                        }}
                    >
                        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem', textAlign: 'center' }}>
                            {courtSlots.courtName}
                        </Typography>
                    </Box>

                    {/* Slots */}
                    <Box sx={{ display: 'flex', flex: 1, px: 0.5 }}>
                        {courtSlots.slots
                            .filter((_, i) => i >= scrollOffset && i < scrollOffset + visibleCount)
                            .map((slot) => {
                                const selected = isSelected(courtSlots.courtIndex, slot.time);
                                const color = selected ? statusColors.selected : statusColors[slot.status];
                                const clickable = slot.status === 'available' || selected;

                                return (
                                    <Tooltip
                                        key={slot.time}
                                        title={`${courtSlots.courtName} - ${slot.time} - ${color.label}`}
                                        arrow
                                    >
                                        <Box
                                            onClick={() => clickable && onSlotSelect(courtSlots.courtIndex, slot.time)}
                                            sx={{
                                                flex: 1,
                                                minWidth: 56,
                                                height: 40,
                                                m: 0.3,
                                                borderRadius: 1.5,
                                                bgcolor: color.bg,
                                                border: slot.status === 'available' && !selected ? '1px solid #E0E0E0' : 'none',
                                                cursor: clickable ? 'pointer' : 'default',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.15s ease',
                                                '&:hover': clickable
                                                    ? {
                                                        transform: 'scale(1.05)',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                    }
                                                    : {},
                                            }}
                                        >
                                            {selected && (
                                                <Typography variant="caption" sx={{ color: 'white', fontWeight: 700, fontSize: '0.65rem' }}>
                                                    ✓
                                                </Typography>
                                            )}
                                        </Box>
                                    </Tooltip>
                                );
                            })}
                    </Box>
                </Box>
            ))}
        </Paper>
    );
};

export default BookingGrid;
