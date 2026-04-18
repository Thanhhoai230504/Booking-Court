import React from 'react';
import { toast, ToastOptions } from 'react-toastify';
import { Box, Typography } from '@mui/material';
import {
  CheckCircleRounded,
  ErrorRounded,
  WarningRounded,
  InfoRounded,
} from '@mui/icons-material';

interface ToastContentProps {
  title: string;
  message?: string;
}

const ToastContent: React.FC<ToastContentProps> = ({ title, message }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
    <Typography
      variant="subtitle2"
      sx={{
        fontWeight: 700,
        fontSize: '0.95rem',
        lineHeight: 1.2,
      }}
    >
      {title}
    </Typography>
    {message && (
      <Typography
        variant="body2"
        sx={{
          opacity: 0.9,
          fontSize: '0.85rem',
          lineHeight: 1.4,
          mt: 0.5,
        }}
      >
        {message}
      </Typography>
    )}
  </Box>
);

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showToast = {
  success: (title: string, message?: string, options?: ToastOptions) => {
    toast.success(<ToastContent title={title} message={message} />, {
      ...defaultOptions,
      ...options,
      icon: <CheckCircleRounded sx={{ fontSize: 28 }} />,
    });
  },
  error: (title: string, message?: string, options?: ToastOptions) => {
    toast.error(<ToastContent title={title} message={message} />, {
      ...defaultOptions,
      ...options,
      icon: <ErrorRounded sx={{ fontSize: 28 }} />,
    });
  },
  warning: (title: string, message?: string, options?: ToastOptions) => {
    toast.warning(<ToastContent title={title} message={message} />, {
      ...defaultOptions,
      ...options,
      icon: <WarningRounded sx={{ fontSize: 28 }} />,
    });
  },
  info: (title: string, message?: string, options?: ToastOptions) => {
    toast.info(<ToastContent title={title} message={message} />, {
      ...defaultOptions,
      ...options,
      icon: <InfoRounded sx={{ fontSize: 28 }} />,
    });
  },
};
