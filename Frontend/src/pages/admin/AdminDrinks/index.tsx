import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Grid,
  Avatar,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as StockIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  LocalCafe as DrinkIconDefault,
  CheckCircle as InStockIcon,
  PhotoCamera,
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../../../store/store';
import {
  fetchAdminDrinks,
  createDrink,
  updateDrink,
  updateStock,
  deleteDrink,
} from '@/store/slices/adminSlice';
import { Drink, CreateDrinkRequest, UpdateDrinkRequest } from '../../../types';
import { toast } from 'react-toastify';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const AdminDrinks: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { drinks, isLoading } = useSelector((state: RootState) => state.admin);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingDrink, setEditingDrink] = useState<Drink | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [form, setForm] = useState({
    name: '',
    price: 0,
    quantity: 0,
    minStock: 10,
    description: '',
    image: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const adminId = user?._id || user?.id || '';

  useEffect(() => {
    if (adminId) dispatch(fetchAdminDrinks(adminId));
  }, [dispatch, adminId]);

  const handleOpenCreate = () => {
    setEditingDrink(null);
    setForm({ name: '', price: 0, quantity: 0, minStock: 10, description: '', image: '' });
    setImageFile(null);
    setImagePreview('');
    setDialogOpen(true);
  };

  const handleOpenEdit = (drink: Drink) => {
    setEditingDrink(drink);
    setForm({
      name: drink.name,
      price: drink.price,
      quantity: drink.quantity,
      minStock: drink.minStock,
      description: drink.description || '',
      image: drink.image || '',
    });
    setImageFile(null);
    setImagePreview(drink.image || '');
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingDrink) {
        const data: Record<string, any> = {
          name: form.name,
          price: form.price,
          minStock: form.minStock,
          description: form.description || undefined,
        };
        await dispatch(updateDrink({ id: editingDrink._id, data, imageFile: imageFile || undefined })).unwrap();
        toast.success('Cập nhật đồ uống thành công!');
      } else {
        const data: Record<string, any> = {
          name: form.name,
          price: form.price,
          quantity: form.quantity,
          minStock: form.minStock,
          description: form.description || undefined,
        };
        await dispatch(createDrink({ data, imageFile: imageFile || undefined })).unwrap();
        toast.success('Thêm đồ uống thành công!');
      }
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error || 'Có lỗi xảy ra');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateStock = async () => {
    if (!selectedDrink) return;
    try {
      await dispatch(updateStock({ id: selectedDrink._id, quantity: stockQuantity })).unwrap();
      toast.success('Cập nhật tồn kho thành công!');
      setStockDialogOpen(false);
    } catch (error: any) {
      toast.error(error || 'Lỗi cập nhật tồn kho');
    }
  };

  const handleDelete = async () => {
    if (!selectedDrink) return;
    try {
      await dispatch(deleteDrink(selectedDrink._id)).unwrap();
      toast.success('Đã xóa đồ uống!');
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error || 'Lỗi xóa đồ uống');
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: '#e65100', width: 44, height: 44 }}>
            <DrinkIconDefault />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.2 }}>
              Quản lý Đồ uống
            </Typography>
            <Typography color="text.secondary" fontSize="0.85rem">
              {drinks.length} sản phẩm
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
          Thêm đồ uống
        </Button>
      </Box>

      {/* Cards Grid */}
      {isLoading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={40} sx={{ color: '#006837' }} />
          <Typography color="text.secondary" mt={2}>Đang tải...</Typography>
        </Box>
      ) : !drinks.length ? (
        <Paper sx={{ textAlign: 'center', py: 8, borderRadius: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <DrinkIconDefault sx={{ fontSize: 64, color: '#ddd', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">Chưa có đồ uống nào</Typography>
          <Typography color="text.secondary" fontSize="0.85rem" mb={2}>Bắt đầu thêm đồ uống cho cửa hàng</Typography>
          <Button variant="outlined" onClick={handleOpenCreate} sx={{ borderRadius: '10px' }}>
            Thêm đồ uống đầu tiên
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {drinks.map((drink) => {
            const isLowStock = drink.quantity <= drink.minStock;
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={drink._id}>
                <Card
                  sx={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                    transition: 'all 0.25s ease',
                    border: isLowStock ? '2px solid #ff8a80' : '2px solid transparent',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  {/* Image */}
                  {drink.image ? (
                    <CardMedia
                      component="img"
                      height={160}
                      image={drink.image}
                      alt={drink.name}
                      sx={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 160,
                        background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <DrinkIconDefault sx={{ fontSize: 56, color: '#e65100', opacity: 0.5 }} />
                    </Box>
                  )}

                  <CardContent sx={{ p: 2 }}>
                    {/* Name & Price */}
                    <Typography fontWeight={700} fontSize="1rem" noWrap>
                      {drink.name}
                    </Typography>
                    <Typography fontWeight={700} color="#006837" fontSize="1.1rem" mt={0.3}>
                      {formatCurrency(drink.price)}
                    </Typography>

                    {/* Description */}
                    {drink.description && (
                      <Typography
                        color="text.secondary"
                        fontSize="0.78rem"
                        mt={0.5}
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {drink.description}
                      </Typography>
                    )}

                    {/* Stock info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {isLowStock ? (
                          <Chip
                            icon={<WarningIcon sx={{ fontSize: '16px !important' }} />}
                            label={`Tồn: ${drink.quantity}`}
                            size="small"
                            sx={{
                              bgcolor: '#ffebee',
                              color: '#c62828',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              '& .MuiChip-icon': { color: '#c62828' },
                            }}
                          />
                        ) : (
                          <Chip
                            icon={<InStockIcon sx={{ fontSize: '16px !important' }} />}
                            label={`Tồn: ${drink.quantity}`}
                            size="small"
                            sx={{
                              bgcolor: '#e8f5e9',
                              color: '#2e7d32',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              '& .MuiChip-icon': { color: '#2e7d32' },
                            }}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 1.5, justifyContent: 'flex-end' }}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedDrink(drink);
                          setStockQuantity(0);
                          setStockDialogOpen(true);
                        }}
                        sx={{
                          bgcolor: '#e3f2fd',
                          color: '#1565c0',
                          '&:hover': { bgcolor: '#bbdefb' },
                        }}
                      >
                        <StockIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEdit(drink)}
                        sx={{
                          bgcolor: '#f3e5f5',
                          color: '#7b1fa2',
                          '&:hover': { bgcolor: '#e1bee7' },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedDrink(drink);
                          setDeleteDialogOpen(true);
                        }}
                        sx={{
                          bgcolor: '#ffebee',
                          color: '#c62828',
                          '&:hover': { bgcolor: '#ffcdd2' },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

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
            <Avatar sx={{ bgcolor: '#fff3e0', color: '#e65100', width: 36, height: 36 }}>
              <DrinkIconDefault sx={{ fontSize: 20 }} />
            </Avatar>
            <Typography fontWeight={700} fontSize="1.1rem">
              {editingDrink ? 'Chỉnh sửa đồ uống' : 'Thêm đồ uống mới'}
            </Typography>
          </Box>
          <IconButton onClick={() => setDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ px: 3, pt: 0 }}>
          {/* Image preview */}
          <Box sx={{ mb: 2.5, textAlign: 'center' }}>
            {imagePreview ? (
              <Box sx={{ borderRadius: '12px', overflow: 'hidden', height: 140, mb: 1.5, position: 'relative', display: 'inline-block' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ height: '100%', objectFit: 'cover' }}
                  onError={(e: any) => { e.target.style.display = 'none'; }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  height: 100,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.5,
                }}
              >
                <DrinkIconDefault sx={{ fontSize: 40, color: '#e65100', opacity: 0.4 }} />
              </Box>
            )}
            <Box>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="drink-image-file"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="drink-image-file">
                <Button variant="outlined" component="span" startIcon={<PhotoCamera />}>
                  {imagePreview ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
                </Button>
              </label>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên đồ uống *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Giá (VNĐ) *"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                size="small"
                inputProps={{ min: 0 }}
              />
            </Grid>
            {!editingDrink && (
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Số lượng ban đầu"
                  type="number"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                  size="small"
                  inputProps={{ min: 0 }}
                />
              </Grid>
            )}
            <Grid item xs={editingDrink ? 6 : 12}>
              <TextField
                fullWidth
                label="Mức tồn kho tối thiểu"
                type="number"
                value={form.minStock}
                onChange={(e) => setForm({ ...form, minStock: Number(e.target.value) })}
                size="small"
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                size="small"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ borderRadius: '10px' }}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!form.name || !form.price}
            sx={{
              background: 'linear-gradient(135deg, #006837, #4CAF50)',
              borderRadius: '10px',
              px: 3,
              fontWeight: 600,
            }}
          >
            {editingDrink ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Stock Dialog */}
      <Dialog
        open={stockDialogOpen}
        onClose={() => setStockDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px' } }}
      >
        <Box sx={{ px: 3, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1565c0', width: 36, height: 36 }}>
              <StockIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Typography fontWeight={700} fontSize="1.05rem">Cập nhật tồn kho</Typography>
          </Box>
          <IconButton onClick={() => setStockDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ px: 3, pt: 0 }}>
          {selectedDrink && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5, p: 2, bgcolor: '#f8f9fa', borderRadius: '12px' }}>
              {selectedDrink.image ? (
                <Avatar src={selectedDrink.image} sx={{ width: 48, height: 48, borderRadius: '10px' }} variant="rounded" />
              ) : (
                <Avatar sx={{ width: 48, height: 48, borderRadius: '10px', bgcolor: '#fff3e0', color: '#e65100' }} variant="rounded">
                  <DrinkIconDefault />
                </Avatar>
              )}
              <Box>
                <Typography fontWeight={600}>{selectedDrink.name}</Typography>
                <Typography color="text.secondary" fontSize="0.85rem">
                  Tồn kho hiện tại: <strong>{selectedDrink.quantity}</strong>
                </Typography>
              </Box>
            </Box>
          )}
          <TextField
            fullWidth
            label="Số lượng thêm/bớt"
            type="number"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(Number(e.target.value))}
            size="small"
            helperText="Nhập số dương để thêm, số âm để giảm"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setStockDialogOpen(false)} sx={{ borderRadius: '10px' }}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleUpdateStock}
            sx={{
              background: 'linear-gradient(135deg, #1565c0, #42a5f5)',
              borderRadius: '10px',
              px: 3,
              fontWeight: 600,
            }}
          >
            Cập nhật
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
          <Typography fontWeight={700} fontSize="1.1rem" gutterBottom>Xác nhận xóa</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#ffebee', borderRadius: '12px', mb: 2 }}>
            {selectedDrink?.image ? (
              <Avatar src={selectedDrink.image} sx={{ width: 48, height: 48, borderRadius: '10px' }} variant="rounded" />
            ) : (
              <Avatar sx={{ width: 48, height: 48, borderRadius: '10px', bgcolor: '#fff3e0', color: '#e65100' }} variant="rounded">
                <DrinkIconDefault />
              </Avatar>
            )}
            <Typography>
              Bạn có chắc muốn xóa <strong>{selectedDrink?.name}</strong>?
            </Typography>
          </Box>
        </Box>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ borderRadius: '10px' }}>Hủy</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{ borderRadius: '10px', px: 3, fontWeight: 600 }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDrinks;
