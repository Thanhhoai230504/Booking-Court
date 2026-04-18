import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Tooltip,
  TextField,
} from '@mui/material';
import {
  Block as BlockIcon,
  CheckCircle as ActiveIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  SportsTennis as CourtIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import adminManagementService, { OwnerWithStats, OwnerDetail } from '../../../services/adminManagementService';
import { showToast } from '../../../utils/toastNotify';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const ManageOwners: React.FC = () => {
  const [owners, setOwners] = useState<OwnerWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOwner, setSelectedOwner] = useState<OwnerDetail | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const [addOpen, setAddOpen] = useState(false);
  const [newOwner, setNewOwner] = useState({ name: '', email: '', phone: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOwners = async () => {
    try {
      const data = await adminManagementService.getAllOwners();
      setOwners(data);
    } catch (error) {
      console.error('Failed to fetch owners:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchOwners(); }, []);

  const handleToggleStatus = async (id: string) => {
    try {
      await adminManagementService.toggleUserStatus(id);
      fetchOwners();
      showToast.success('Thành công', 'Đã thay đổi trạng thái');
    } catch (error) {
      console.error('Failed to toggle status:', error);
      showToast.error('Thất bại', 'Có lỗi xảy ra khi đổi trạng thái');
    }
  };

  const handleAddOwner = async () => {
    try {
      setIsSubmitting(true);
      await adminManagementService.createOwner(newOwner);
      showToast.success('Thành công', 'Đã thêm chủ sân mới');
      setAddOpen(false);
      setNewOwner({ name: '', email: '', phone: '', password: '' });
      fetchOwners();
    } catch (error: any) {
      console.error('Failed to create owner:', error);
      showToast.error('Thất bại', error.response?.data?.error || 'Không thể tạo chủ sân');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminManagementService.deleteUser(id);
      setDeleteConfirm(null);
      fetchOwners();
      showToast.success('Thành công', 'Đã xóa chủ sân');
    } catch (error) {
      console.error('Failed to delete user:', error);
      showToast.error('Thất bại', 'Có lỗi xảy ra khi xóa');
    }
  };

  const handleViewDetail = async (id: string) => {
    try {
      const data = await adminManagementService.getOwnerById(id);
      setSelectedOwner(data);
      setDetailOpen(true);
    } catch (error) {
      console.error('Failed to fetch owner detail:', error);
      showToast.error('Thất bại', 'Không thể lấy thông tin chi tiết');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress size={40} sx={{ color: '#e65100' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Quản lý Chủ sân</Typography>
          <Typography color="text.secondary" fontSize="0.85rem" mt={0.3}>
            Danh sách tất cả chủ sân trong hệ thống ({owners.length})
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddOpen(true)}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
            boxShadow: '0 4px 14px 0 rgba(255, 107, 107, 0.39)',
            '&:hover': {
              background: 'linear-gradient(135deg, #FF8E53 0%, #FF6B6B 100%)',
              boxShadow: '0 6px 20px rgba(255,107,107,0.23)',
            },
          }}
        >
          Thêm chủ sân
        </Button>
      </Box>

      <Paper sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)' }}>
                {['Chủ sân', 'Email', 'SĐT', 'Số sân', 'Doanh thu', 'Trạng thái', 'Thao tác'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 700, color: '#495057', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {owners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    Chưa có chủ sân nào
                  </TableCell>
                </TableRow>
              ) : (
                owners.map((owner) => (
                  <TableRow key={owner._id || owner.id} hover sx={{ '&:hover': { background: '#f8fffe' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: '#1565c0', width: 36, height: 36, fontSize: '0.85rem' }}>
                          {owner.name?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <Typography fontWeight={600} fontSize="0.85rem">{owner.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Typography fontSize="0.85rem">{owner.email}</Typography></TableCell>
                    <TableCell><Typography fontSize="0.85rem">{owner.phone || 'N/A'}</Typography></TableCell>
                    <TableCell>
                      <Chip label={owner.courtCount} size="small" icon={<CourtIcon sx={{ fontSize: 16 }} />} sx={{ fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={700} color="#e65100" fontSize="0.85rem">
                        {formatCurrency(owner.totalRevenue)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={owner.isActive !== false ? 'Hoạt động' : 'Đã khoá'}
                        color={owner.isActive !== false ? 'success' : 'error'}
                        size="small"
                        sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Xem chi tiết">
                          <IconButton size="small" onClick={() => handleViewDetail(owner._id || owner.id)}>
                            <ViewIcon fontSize="small" sx={{ color: '#1565c0' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={owner.isActive !== false ? 'Khoá tài khoản' : 'Mở khoá'}>
                          <IconButton size="small" onClick={() => handleToggleStatus(owner._id || owner.id)}>
                            {owner.isActive !== false ? <BlockIcon fontSize="small" sx={{ color: '#e65100' }} /> : <ActiveIcon fontSize="small" sx={{ color: '#2e7d32' }} />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xoá">
                          <IconButton size="small" onClick={() => setDeleteConfirm(owner._id || owner.id)}>
                            <DeleteIcon fontSize="small" sx={{ color: '#d32f2f' }} />
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

      {/* Owner Detail Dialog */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Chi tiết chủ sân</DialogTitle>
        <DialogContent>
          {selectedOwner && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, p: 2, borderRadius: '12px', background: '#f8f9fa' }}>
                <Avatar sx={{ bgcolor: '#1565c0', width: 48, height: 48 }}>
                  {selectedOwner.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Box>
                  <Typography fontWeight={700}>{selectedOwner.name}</Typography>
                  <Typography color="text.secondary" fontSize="0.85rem">{selectedOwner.email}</Typography>
                  <Typography color="text.secondary" fontSize="0.85rem">{selectedOwner.phone}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Paper sx={{ flex: 1, p: 2, borderRadius: '12px', textAlign: 'center', background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)' }}>
                  <Typography fontWeight={800} fontSize="1.5rem" color="#2e7d32">{selectedOwner.courts?.length || 0}</Typography>
                  <Typography fontSize="0.78rem" color="text.secondary">Sân</Typography>
                </Paper>
                <Paper sx={{ flex: 1, p: 2, borderRadius: '12px', textAlign: 'center', background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)' }}>
                  <Typography fontWeight={800} fontSize="1.2rem" color="#e65100">{formatCurrency(selectedOwner.totalRevenue)}</Typography>
                  <Typography fontSize="0.78rem" color="text.secondary">Doanh thu</Typography>
                </Paper>
                <Paper sx={{ flex: 1, p: 2, borderRadius: '12px', textAlign: 'center', background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)' }}>
                  <Typography fontWeight={800} fontSize="1.5rem" color="#1565c0">{selectedOwner.bookingCount}</Typography>
                  <Typography fontSize="0.78rem" color="text.secondary">Booking</Typography>
                </Paper>
              </Box>
              {selectedOwner.courts?.length > 0 && (
                <Box>
                  <Typography fontWeight={600} fontSize="0.9rem" mb={1}>Danh sách sân</Typography>
                  {selectedOwner.courts.map((court: any) => (
                    <Box key={court._id} sx={{ p: 1.5, borderRadius: '10px', background: '#f8f9fa', mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography fontWeight={600} fontSize="0.85rem">{court.name}</Typography>
                        <Typography color="text.secondary" fontSize="0.78rem">{court.address}</Typography>
                      </Box>
                      <Chip
                        label={court.status === 'active' ? 'Hoạt động' : court.status}
                        color={court.status === 'active' ? 'success' : 'default'}
                        size="small"
                        sx={{ fontSize: '0.73rem' }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDetailOpen(false)} variant="outlined" sx={{ borderRadius: '10px' }}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Xác nhận xoá</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xoá tài khoản này? Hành động này không thể hoàn tác.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteConfirm(null)} variant="outlined" sx={{ borderRadius: '10px' }}>Huỷ</Button>
          <Button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} variant="contained" color="error" sx={{ borderRadius: '10px' }}>Xoá</Button>
        </DialogActions>
      </Dialog>

      {/* Add Owner Dialog */}
      <Dialog open={addOpen} onClose={() => !isSubmitting && setAddOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Thêm chủ sân mới</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Họ và tên"
              fullWidth
              value={newOwner.name}
              onChange={(e) => setNewOwner({ ...newOwner, name: e.target.value })}
              disabled={isSubmitting}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={newOwner.email}
              onChange={(e) => setNewOwner({ ...newOwner, email: e.target.value })}
              disabled={isSubmitting}
            />
            <TextField
              label="Số điện thoại"
              fullWidth
              value={newOwner.phone}
              onChange={(e) => setNewOwner({ ...newOwner, phone: e.target.value })}
              disabled={isSubmitting}
            />
            <TextField
              label="Mật khẩu"
              type="password"
              fullWidth
              value={newOwner.password}
              onChange={(e) => setNewOwner({ ...newOwner, password: e.target.value })}
              disabled={isSubmitting}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setAddOpen(false)}
            variant="outlined"
            sx={{ borderRadius: '10px' }}
            disabled={isSubmitting}
          >
            Huỷ
          </Button>
          <Button
            onClick={handleAddOwner}
            variant="contained"
            disableElevation
            disabled={isSubmitting || !newOwner.name || !newOwner.email || !newOwner.password}
            sx={{ borderRadius: '10px', background: 'linear-gradient(135deg, #1565c0, #1976d2)' }}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Thêm chủ sân'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageOwners;
