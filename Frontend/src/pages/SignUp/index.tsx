import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
  ArrowBack,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store/store';
import { register, clearError } from '../../store/slices/authSlice';

const SignUp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
    setLocalError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Mật khẩu xác nhận không khớp');
      return;
    }
    if (formData.password.length < 6) {
      setLocalError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    dispatch(register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: 'customer',
    }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #C62828 0%, #8E0000 50%, #B71C1C 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      {/* Decorative stars */}
      {[...Array(20)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: { xs: 4, md: 6 },
            height: { xs: 4, md: 6 },
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '50%',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      <IconButton
        component={Link}
        to="/"
        sx={{
          position: 'absolute',
          top: 24,
          left: 24,
          color: 'white',
          bgcolor: 'rgba(255,255,255,0.15)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
        }}
      >
        <ArrowBack />
      </IconButton>

      <Container maxWidth="sm">
        <Typography
          variant="h4"
          sx={{
            color: 'white',
            fontWeight: 800,
            textAlign: 'center',
            mb: 4,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          Đăng ký tài khoản
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          {(error || localError) && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {localError || error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Typography fontWeight={700} sx={{ mb: 1 }}>
              Họ và tên (*)
            </Typography>
            <TextField
              fullWidth
              placeholder="Nhập họ và tên"
              value={formData.name}
              onChange={handleChange('name')}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: '#999' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2.5 }}
            />

            <Typography fontWeight={700} sx={{ mb: 1 }}>
              Email (*)
            </Typography>
            <TextField
              fullWidth
              placeholder="Nhập email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#999' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2.5 }}
            />

            <Typography fontWeight={700} sx={{ mb: 1 }}>
              Số điện thoại (*)
            </Typography>
            <TextField
              fullWidth
              placeholder="Nhập số điện thoại"
              value={formData.phone}
              onChange={handleChange('phone')}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone sx={{ color: '#999' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2.5 }}
            />

            <Typography fontWeight={700} sx={{ mb: 1 }}>
              Mật khẩu (*)
            </Typography>
            <TextField
              fullWidth
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#999' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2.5 }}
            />

            <Typography fontWeight={700} sx={{ mb: 1 }}>
              Xác nhận mật khẩu (*)
            </Typography>
            <TextField
              fullWidth
              placeholder="Nhập lại mật khẩu"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#999' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                bgcolor: '#006837',
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: 2,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                '&:hover': { bgcolor: '#004D25' },
                mb: 2,
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'ĐĂNG KÝ'}
            </Button>
          </form>
        </Paper>

        <Typography
          textAlign="center"
          sx={{ color: 'white', mt: 3, fontSize: '0.95rem' }}
        >
          Đã có tài khoản?{' '}
          <Typography
            component={Link}
            to="/login"
            sx={{
              color: 'white',
              fontWeight: 700,
              textDecoration: 'underline',
              '&:hover': { opacity: 0.9 },
            }}
          >
            Đăng nhập
          </Typography>
        </Typography>
      </Container>
    </Box>
  );
};

export default SignUp;
