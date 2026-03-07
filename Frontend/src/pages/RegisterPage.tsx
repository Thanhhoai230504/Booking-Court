import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    IconButton,
    InputAdornment,
} from '@mui/material';
import {
    ArrowBackRounded as BackIcon,
    VisibilityRounded as ShowIcon,
    VisibilityOffRounded as HideIcon,
    SportsTennisRounded as LogoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [field]: e.target.value });
    };

    const handleRegister = () => {
        navigate('/');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                maxWidth: 960,
                mx: 'auto',
                background: 'linear-gradient(180deg, #004D28 0%, #006D38 35%, #F5F5F5 35%)',
            }}
        >
            <Box sx={{ p: 2 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ color: 'white' }}>
                    <BackIcon />
                </IconButton>
            </Box>

            <Box sx={{ textAlign: 'center', pb: 3 }}>
                <Box
                    sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 1.5,
                    }}
                >
                    <LogoIcon sx={{ fontSize: 36, color: 'white' }} />
                </Box>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                    Đăng ký
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
                    Tạo tài khoản để bắt đầu đặt sân
                </Typography>
            </Box>

            <Paper sx={{ mx: 2, p: 3, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
                <TextField
                    fullWidth
                    label="Họ và tên"
                    value={form.name}
                    onChange={handleChange('name')}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Số điện thoại"
                    value={form.phone}
                    onChange={handleChange('phone')}
                    sx={{ mb: 2 }}
                    placeholder="0901234567"
                />
                <TextField
                    fullWidth
                    label="Mật khẩu"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange('password')}
                    sx={{ mb: 2 }}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                        {showPassword ? <HideIcon /> : <ShowIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
                <TextField
                    fullWidth
                    label="Xác nhận mật khẩu"
                    type={showPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    sx={{ mb: 3 }}
                />

                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleRegister}
                    sx={{
                        background: 'linear-gradient(135deg, #004D28 0%, #006D38 100%)',
                        borderRadius: 3,
                        py: 1.5,
                        fontWeight: 700,
                        fontSize: '1rem',
                        mb: 2,
                    }}
                >
                    Đăng ký
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Đã có tài khoản?{' '}
                        <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: '#006D38', fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                            onClick={() => navigate('/login')}
                        >
                            Đăng nhập
                        </Typography>
                    </Typography>
                </Box>
            </Paper>

            <Box sx={{ height: 40 }} />
        </Box>
    );
};

export default RegisterPage;
