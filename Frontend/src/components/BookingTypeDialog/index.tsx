import React from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Paper,
  Chip,
} from '@mui/material';
import {
  Close,
  ArrowForward,
  CalendarMonth,
  EmojiEvents,
} from '@mui/icons-material';

interface BookingTypeDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectDaily: () => void;
  onSelectEvent: () => void;
}

const BookingTypeDialog: React.FC<BookingTypeDialogProps> = ({
  open,
  onClose,
  onSelectDaily,
  onSelectEvent,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'visible',
          p: 0,
        },
      }}
    >
      <DialogContent sx={{ p: { xs: 2.5, md: 3.5 }, position: 'relative' }}>
        {/* Close button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            color: '#757575',
            '&:hover': { bgcolor: '#f5f5f5' },
          }}
        >
          <Close />
        </IconButton>

        {/* Title */}
        <Typography
          variant="h5"
          fontWeight={800}
          textAlign="center"
          sx={{ mb: 3, mt: 1 }}
        >
          Chọn hình thức đặt
        </Typography>

        {/* Option 1: Daily booking */}
        <Paper
          onClick={onSelectDaily}
          sx={{
            p: 2.5,
            mb: 2,
            borderRadius: 3,
            border: '2px solid #E8F5E9',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#006837',
              bgcolor: '#F1F8E9',
              transform: 'translateX(4px)',
            },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <CalendarMonth sx={{ color: '#006837', fontSize: 22 }} />
              <Typography variant="h6" fontWeight={700} color="#006837">
                Đặt lịch ngày trực quan
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
              Đặt lịch ngày khi khách chơi nhiều khung giờ, nhiều sân.
            </Typography>
          </Box>
          <IconButton
            sx={{
              bgcolor: '#006837',
              color: 'white',
              width: 40,
              height: 40,
              flexShrink: 0,
              '&:hover': { bgcolor: '#004D25' },
            }}
          >
            <ArrowForward fontSize="small" />
          </IconButton>
        </Paper>

        {/* Option 2: Event booking */}
        <Paper
          onClick={onSelectEvent}
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: '2px solid #FFF3E0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#E65100',
              bgcolor: '#FFF8E1',
              transform: 'translateX(4px)',
            },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <EmojiEvents sx={{ color: '#E65100', fontSize: 22 }} />
              <Typography variant="h6" fontWeight={700} color="#E65100">
                Đặt lịch sự kiện
              </Typography>
              <Chip
                label="Hot"
                size="small"
                sx={{
                  bgcolor: '#C62828',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  height: 20,
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
              Sự kiện giúp bạn chơi chung với người có cùng niềm đam mê, trình độ.
              Hay những giải đấu mang tính cạnh tranh cao, nâng cao trình độ do chủ sân tổ chức.
            </Typography>
          </Box>
          <IconButton
            sx={{
              bgcolor: '#E65100',
              color: 'white',
              width: 40,
              height: 40,
              flexShrink: 0,
              '&:hover': { bgcolor: '#BF360C' },
            }}
          >
            <ArrowForward fontSize="small" />
          </IconButton>
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

export default BookingTypeDialog;
