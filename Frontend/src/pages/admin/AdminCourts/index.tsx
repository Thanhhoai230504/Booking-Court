import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Grid,
  MenuItem,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  SportsTennis as CourtIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../../../store/store';
import { fetchAdminCourts, createCourt, updateCourt, deleteCourt } from '../../../store/slices/adminSlice';
import { Court, CreateCourtRequest, UpdateCourtRequest } from '../../../types';
import { toast } from 'react-toastify';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const statusMap: Record<string, { label: string; color: 'success' | 'warning' | 'default'; bg: string; textColor: string }> = {
  active: { label: 'Hoạt động', color: 'success', bg: '#e8f5e9', textColor: '#2e7d32' },
  maintenance: { label: 'Bảo trì', color: 'warning', bg: '#fff3e0', textColor: '#e65100' },
  inactive: { label: 'Ngưng', color: 'default', bg: '#f5f5f5', textColor: '#757575' },
};

const AdminCourts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { courts, isLoading } = useSelector((state: RootState) => state.admin);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    description: '',
    totalCourts: 1,
    pricePerHour: 0,
    status: 'active' as 'active' | 'maintenance' | 'inactive',
    openStart: '06:00',
    openEnd: '22:00',
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (user?._id || user?.id) {
      dispatch(fetchAdminCourts(user._id || user.id));
    }
  }, [dispatch, user]);

  const handleOpenCreate = () => {
    setEditingCourt(null);
    setForm({
      name: '', address: '', city: '', description: '',
      totalCourts: 1, pricePerHour: 0, status: 'active',
      openStart: '06:00', openEnd: '22:00',
    });
    setImageFiles([]);
    setImagePreviews([]);
    setDialogOpen(true);
  };

  const handleOpenEdit = (court: Court) => {
    setEditingCourt(court);
    setForm({
      name: court.name,
      address: court.address,
      city: court.city || '',
      description: court.description || '',
      totalCourts: court.totalCourts,
      pricePerHour: court.pricePerHour,
      status: court.status,
      openStart: court.openingHours?.start || '06:00',
      openEnd: court.openingHours?.end || '22:00',
    });
    setImageFiles([]);
    setImagePreviews(court.images || []);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingCourt) {
        const data: Record<string, any> = {
          name: form.name, address: form.address,
          city: form.city || undefined, description: form.description || undefined,
          totalCourts: form.totalCourts, pricePerHour: form.pricePerHour,
          status: form.status,
          openingHours: { start: form.openStart, end: form.openEnd },
        };
        await dispatch(updateCourt({ id: editingCourt._id, data, imageFiles: imageFiles.length ? imageFiles : undefined })).unwrap();
        toast.success('Cập nhật sân thành công!');
      } else {
        const data: Record<string, any> = {
          name: form.name, address: form.address,
          city: form.city || undefined, description: form.description || undefined,
          totalCourts: form.totalCourts, pricePerHour: form.pricePerHour,
          openingHours: { start: form.openStart, end: form.openEnd },
        };
        await dispatch(createCourt({ data, imageFiles: imageFiles.length ? imageFiles : undefined })).unwrap();
        toast.success('Tạo sân mới thành công!');
      }
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error || 'Có lỗi xảy ra');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (imageFiles.length + filesArray.length > 10) {
        toast.error('Chỉ được upload tối đa 10 ảnh');
        return;
      }
      const newFiles = [...imageFiles, ...filesArray];
      setImageFiles(newFiles);
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index: number) => {
    // We roughly remove from both, but if they are mix of old URLs and new Files, 
    // it's tricky. Since we completely overwrite images on update right now if there are new files,
    // we just reset files array for simplicity if they remove something.
    // For a real app, keeping track of separate old and new is better.
    const newFiles = [...imageFiles];
    if (index >= imagePreviews.length - imageFiles.length) {
      newFiles.splice(index - (imagePreviews.length - imageFiles.length), 1);
      setImageFiles(newFiles);
    }
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleDelete = async () => {
    if (!selectedCourt) return;
    try {
      await dispatch(deleteCourt(selectedCourt._id)).unwrap();
      toast.success('Đã xóa sân thành công!');
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error || 'Lỗi xóa sân');
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: '#2e7d32', width: 44, height: 44 }}>
            <CourtIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.2 }}>
              Quản lý Sân
            </Typography>
            <Typography color="text.secondary" fontSize="0.85rem">
              {courts.length} cụm sân
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{
            background: 'linear-gradient(135deg, #006837, #4CAF50)',
            borderRadius: '12px',
            px: 3,
            py: 1.2,
            fontWeight: 600,
            boxShadow: '0 4px 15px rgba(0,104,55,0.3)',
            '&:hover': { boxShadow: '0 6px 20px rgba(0,104,55,0.4)' },
          }}
        >
          Thêm sân mới
        </Button>
      </Box>

      {/* Table */}
      <Paper sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)' }}>
                {['Tên sân', 'Địa chỉ', 'Số sân', 'Giá/giờ', 'Giờ mở cửa', 'Trạng thái', ''].map((h, i) => (
                  <TableCell key={i} sx={{ fontWeight: 700, color: '#495057', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={36} sx={{ color: '#006837' }} />
                    <Typography color="text.secondary" mt={1} fontSize="0.85rem">Đang tải...</Typography>
                  </TableCell>
                </TableRow>
              ) : !courts.length ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CourtIcon sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                    <Typography color="text.secondary">Chưa có sân nào</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                courts.map((court) => (
                  <TableRow
                    key={court._id}
                    hover
                    sx={{ '&:hover': { background: '#f8fffe' }, transition: 'background 0.15s' }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{ width: 40, height: 40, bgcolor: '#e8f5e9', color: '#2e7d32', borderRadius: '10px' }}
                          variant="rounded"
                        >
                          <CourtIcon sx={{ fontSize: 22 }} />
                        </Avatar>
                        <Box>
                          <Typography fontWeight={600} fontSize="0.9rem">{court.name}</Typography>
                          {court.description && (
                            <Typography color="text.secondary" fontSize="0.75rem" noWrap sx={{ maxWidth: 180 }}>
                              {court.description}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />
                        <Box>
                          <Typography fontSize="0.85rem">{court.address}</Typography>
                          {court.city && <Typography fontSize="0.75rem" color="text.secondary">{court.city}</Typography>}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${court.totalCourts} sân`}
                        size="small"
                        sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 600, fontSize: '0.78rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={700} color="#006837" fontSize="0.9rem">
                        {formatCurrency(court.pricePerHour)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TimeIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />
                        <Typography fontSize="0.85rem">
                          {court.openingHours?.start} - {court.openingHours?.end}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusMap[court.status]?.label}
                        size="small"
                        sx={{
                          bgcolor: statusMap[court.status]?.bg,
                          color: statusMap[court.status]?.textColor,
                          fontWeight: 600,
                          fontSize: '0.78rem',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Chỉnh sửa" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(court)}
                            sx={{ bgcolor: '#f3e5f5', color: '#7b1fa2', '&:hover': { bgcolor: '#e1bee7' } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa sân" arrow>
                          <IconButton
                            size="small"
                            onClick={() => { setSelectedCourt(court); setDeleteDialogOpen(true); }}
                            sx={{ bgcolor: '#ffebee', color: '#c62828', '&:hover': { bgcolor: '#ffcdd2' } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px' } }}
      >
        <Box sx={{ px: 3, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', width: 36, height: 36 }}>
              <CourtIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Typography fontWeight={700} fontSize="1.1rem">
              {editingCourt ? 'Chỉnh sửa sân' : 'Thêm sân mới'}
            </Typography>
          </Box>
          <IconButton onClick={() => setDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ px: 3, pt: 0 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={600} mb={1}>Hình ảnh sân (Tối đa 10 ảnh)</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
              {imagePreviews.map((preview, index) => (
                <Box key={index} sx={{ position: 'relative', width: 80, height: 80, borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                    <img src={preview} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <IconButton size="small" sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(255,255,255,0.7)', p: 0.3 }} onClick={() => handleRemoveImage(index)}>
                        <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </Box>
              ))}
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="court-images-file"
                type="file"
                multiple
                onChange={handleFileChange}
              />
              <label htmlFor="court-images-file">
                <Button variant="outlined" component="span" sx={{ height: 80, width: 80, borderStyle: 'dashed', display: 'flex', flexDirection: 'column' }}>
                  <AddIcon />
                </Button>
              </label>
            </Box>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Tên sân *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} size="small" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Địa chỉ *" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} size="small" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Thành phố" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} size="small" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Số sân *" type="number" value={form.totalCourts} onChange={(e) => setForm({ ...form, totalCourts: Number(e.target.value) })} size="small" inputProps={{ min: 1 }} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Giá/giờ (VNĐ) *" type="number" value={form.pricePerHour} onChange={(e) => setForm({ ...form, pricePerHour: Number(e.target.value) })} size="small" inputProps={{ min: 0 }} />
            </Grid>
            {editingCourt && (
              <Grid item xs={6}>
                <TextField fullWidth select label="Trạng thái" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} size="small">
                  <MenuItem value="active">Hoạt động</MenuItem>
                  <MenuItem value="maintenance">Bảo trì</MenuItem>
                  <MenuItem value="inactive">Ngưng</MenuItem>
                </TextField>
              </Grid>
            )}
            <Grid item xs={6}>
              <TextField fullWidth label="Giờ mở cửa" type="time" value={form.openStart} onChange={(e) => setForm({ ...form, openStart: e.target.value })} size="small" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Giờ đóng cửa" type="time" value={form.openEnd} onChange={(e) => setForm({ ...form, openEnd: e.target.value })} size="small" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Mô tả" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} size="small" multiline rows={3} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ borderRadius: '10px' }}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!form.name || !form.address || !form.pricePerHour}
            sx={{
              background: 'linear-gradient(135deg, #006837, #4CAF50)',
              borderRadius: '10px',
              px: 3,
              fontWeight: 600,
            }}
          >
            {editingCourt ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px' } }}
      >
        <Box sx={{ px: 3, py: 2.5 }}>
          <Typography fontWeight={700} fontSize="1.1rem" gutterBottom>Xác nhận xóa sân</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#ffebee', borderRadius: '12px', mb: 2 }}>
            <Avatar sx={{ width: 48, height: 48, borderRadius: '10px', bgcolor: '#e8f5e9', color: '#2e7d32' }} variant="rounded">
              <CourtIcon />
            </Avatar>
            <Box>
              <Typography fontWeight={600}>{selectedCourt?.name}</Typography>
              <Typography color="text.secondary" fontSize="0.85rem">{selectedCourt?.address}</Typography>
            </Box>
          </Box>
          <Typography color="text.secondary" fontSize="0.85rem">
            Bạn có chắc muốn xóa sân này? Hành động này không thể hoàn tác.
          </Typography>
        </Box>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ borderRadius: '10px' }}>Hủy</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{ borderRadius: '10px', px: 3, fontWeight: 600 }}
          >
            Xóa sân
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCourts;
