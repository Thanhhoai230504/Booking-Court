import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    IconButton,
    Typography,
    CircularProgress,
    Alert,
} from '@mui/material';
import { CloseRounded as CloseIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { updateProfile } from '../../store/slices/authSlice';

interface EditProfileDialogProps {
    open: boolean;
    onClose: () => void;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({ open, onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, isLoading } = useSelector((state: RootState) => state.auth);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open && user) {
            setName(user.name || '');
            setPhone(user.phone || '');
            setSuccess(false);
            setError('');
        }
    }, [open, user]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError('Tên không được để trống');
            return;
        }
        if (!phone.trim()) {
            setError('Số điện thoại không được để trống');
            return;
        }
        setError('');
        try {
            await dispatch(updateProfile({ name: name.trim(), phone: phone.trim() })).unwrap();
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (err: any) {
            setError(err || 'Cập nhật thất bại');
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3 },
            }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Chỉnh sửa hồ sơ
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                        Cập nhật thành công!
                    </Alert>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
                    <TextField
                        label="Email"
                        value={user?.email || ''}
                        disabled
                        fullWidth
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: 2 },
                        }}
                        helperText="Email không thể thay đổi"
                    />
                    <TextField
                        label="Họ và tên"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        size="small"
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: 2 },
                        }}
                    />
                    <TextField
                        label="Số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        fullWidth
                        size="small"
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: 2 },
                        }}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5 }}>
                <Button
                    onClick={onClose}
                    sx={{ borderRadius: 2, color: '#666' }}
                >
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    sx={{
                        borderRadius: 2,
                        bgcolor: '#006D38',
                        px: 3,
                        fontWeight: 600,
                        '&:hover': { bgcolor: '#004D25' },
                    }}
                >
                    {isLoading ? <CircularProgress size={22} color="inherit" /> : 'Lưu thay đổi'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfileDialog;
