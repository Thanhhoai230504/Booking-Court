import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    IconButton,
} from '@mui/material';
import {
    CloseRounded as CloseIcon,
    CalendarTodayRounded as DayIcon,
    EventRepeatRounded as RecurringIcon,
    CelebrationRounded as EventIcon,
} from '@mui/icons-material';
import { BookingTypeOption } from '../types';

interface BookingTypeModalProps {
    open: boolean;
    onClose: () => void;
    onSelect: (type: BookingTypeOption) => void;
    courtName: string;
}

const bookingTypes = [
    {
        type: 'single' as BookingTypeOption,
        title: 'Đặt theo ngày',
        subtitle: 'Đặt sân một lần cho ngày cụ thể',
        icon: DayIcon,
        gradient: 'linear-gradient(135deg, #43A047 0%, #66BB6A 100%)',
        shadowColor: 'rgba(67, 160, 71, 0.4)',
    },
    {
        type: 'recurring' as BookingTypeOption,
        title: 'Đặt cố định',
        subtitle: 'Đặt sân định kỳ hàng tuần',
        icon: RecurringIcon,
        gradient: 'linear-gradient(135deg, #1E88E5 0%, #42A5F5 100%)',
        shadowColor: 'rgba(30, 136, 229, 0.4)',
    },
    {
        type: 'event' as BookingTypeOption,
        title: 'Sự kiện',
        subtitle: 'Đặt cho nhóm lớn hoặc sự kiện',
        icon: EventIcon,
        gradient: 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)',
        shadowColor: 'rgba(233, 30, 99, 0.4)',
    },
];

const BookingTypeModal: React.FC<BookingTypeModalProps> = ({ open, onClose, onSelect, courtName }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    overflow: 'hidden',
                },
            }}
        >
            <DialogTitle
                sx={{
                    background: 'linear-gradient(135deg, #004D28 0%, #006D38 100%)',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2,
                }}
            >
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Chọn loại đặt sân
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {courtName}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    {bookingTypes.map((bt) => {
                        const Icon = bt.icon;
                        return (
                            <Box
                                key={bt.type}
                                onClick={() => onSelect(bt.type)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    p: 2,
                                    borderRadius: 3,
                                    cursor: 'pointer',
                                    border: '1px solid #eee',
                                    transition: 'all 0.25s ease',
                                    '&:hover': {
                                        transform: 'translateX(4px)',
                                        boxShadow: `0 4px 16px ${bt.shadowColor}`,
                                        borderColor: 'transparent',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 52,
                                        height: 52,
                                        borderRadius: 3,
                                        background: bt.gradient,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <Icon sx={{ color: 'white', fontSize: 28 }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                                        {bt.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {bt.subtitle}
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default BookingTypeModal;
