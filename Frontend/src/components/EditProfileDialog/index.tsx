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
    Avatar,
} from '@mui/material';
import { CloseRounded as CloseIcon, PhotoCamera } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { updateProfile } from '../../store/slices/authSlice';
import { showToast } from '../../utils/toastNotify';

interface EditProfileDialogProps {
    open: boolean;
    onClose: () => void;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({ open, onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, isLoading } = useSelector((state: RootState) => state.auth);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>('');
    useEffect(() => {
        if (open && user) {
            setName(user.name || '');
            setPhone(user.phone || '');
            setAvatarFile(null);
            setAvatarPreview(user.avatar ? `${user.avatar}` : '');
        }
    }, [open, user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            showToast.warning('Lỗi', 'Tên không được để trống');
            return;
        }
        if (!phone.trim()) {
            showToast.warning('Lỗi', 'Số điện thoại không được để trống');
            return;
        }
        try {
            await dispatch(updateProfile({ name: name.trim(), phone: phone.trim(), avatarFile: avatarFile || undefined })).unwrap();
            showToast.success('Thành công', 'Cập nhật hồ sơ thành công!');
            onClose();
        } catch (err: any) {
            showToast.error('Thất bại', err || 'Cập nhật thất bại');
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1, alignItems: 'center' }}>
                    <Box sx={{ position: 'relative' }}>
                        <Avatar
                            src={avatarPreview || undefined}
                            sx={{ width: 100, height: 100, fontSize: '2.5rem', mb: 1, bgcolor: '#e0e0e0', color: '#555' }}
                        >
                            {!avatarPreview && user?.name.charAt(0)}
                        </Avatar>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="icon-button-file"
                            type="file"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="icon-button-file">
                            <IconButton
                                color="primary"
                                aria-label="upload picture"
                                component="span"
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: -10,
                                    bgcolor: 'white',
                                    boxShadow: 2,
                                    '&:hover': { bgcolor: '#f0f0f0' },
                                }}
                            >
                                <PhotoCamera />
                            </IconButton>
                        </label>
                    </Box>

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
