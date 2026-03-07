import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    IconButton,
    InputAdornment,
    Divider,
} from '@mui/material';
import {
    ArrowBackRounded as BackIcon,
    VisibilityRounded as ShowIcon,
    VisibilityOffRounded as HideIcon,
    SportsTennisRounded as LogoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        // Mock login
        navigate('/');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                maxWidth: 960,
                mx: 'auto',
                background: 'linear-gradient(180deg, #004D28 0%, #006D38 40%, #F5F5F5 40%)',
            }}
        >
            {/* Back button */}
            <Box sx={{ p: 2 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ color: 'white' }}>
                    <BackIcon />
                </IconButton>
            </Box>

            {/* Logo area */}
            <Box sx={{ textAlign: 'center', pb: 4 }}>
                <Box
                    sx={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        backdropFilter: 'blur(8px)',
                    }}
                >
                    <LogoIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                    Đăng nhập
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
                    Chào mừng trở lại!
                </Typography>
            </Box>

            {/* Form */}
            <Paper
                sx={{
                    mx: 2,
                    p: 3,
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                }}
            >
                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                    placeholder="example@email.com"
                />
                <TextField
                    fullWidth
                    label="Mật khẩu"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 1 }}
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

                <Box sx={{ textAlign: 'right', mb: 2.5 }}>
                    <Typography
                        variant="caption"
                        sx={{ color: '#006D38', cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                    >
                        Quên mật khẩu?
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleLogin}
                    sx={{
                        background: 'linear-gradient(135deg, #004D28 0%, #006D38 100%)',
                        borderRadius: 3,
                        py: 1.5,
                        fontWeight: 700,
                        fontSize: '1rem',
                        mb: 2,
                    }}
                >
                    Đăng nhập
                </Button>

                <Divider sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        hoặc
                    </Typography>
                </Divider>

                <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                        borderRadius: 3,
                        py: 1.2,
                        borderColor: '#ddd',
                        color: '#333',
                        '&:hover': { borderColor: '#006D38', color: '#006D38' },
                    }}
                >
                    Đăng nhập bằng Google
                </Button>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        Chưa có tài khoản?{' '}
                        <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: '#006D38', fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                            onClick={() => navigate('/register')}
                        >
                            Đăng ký ngay
                        </Typography>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default LoginPage;
