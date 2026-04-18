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
  InputAdornment,
} from '@mui/material';
import {
  Block as BlockIcon,
  CheckCircle as ActiveIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import adminManagementService, { CustomerWithStats } from '../../../services/adminManagementService';
import { showToast } from '../../../utils/toastNotify';

const ManageCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = async () => {
    try {
      const data = await adminManagementService.getAllCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleToggleStatus = async (id: string) => {
    try {
      await adminManagementService.toggleUserStatus(id);
      fetchCustomers();
      showToast.success('Thành công', 'Đã thay đổi trạng thái');
    } catch (error) {
      console.error('Failed to toggle status:', error);
      showToast.error('Thất bại', 'Có lỗi xảy ra khi đổi trạng thái');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminManagementService.deleteUser(id);
      setDeleteConfirm(null);
      fetchCustomers();
      showToast.success('Thành công', 'Đã xóa khách hàng');
    } catch (error) {
      console.error('Failed to delete user:', error);
      showToast.error('Thất bại', 'Có lỗi xảy ra khi xóa');
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm)
  );

  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress size={40} sx={{ color: '#e65100' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Quản lý Khách hàng</Typography>
          <Typography color="text.secondary" fontSize="0.85rem" mt={0.3}>
            Danh sách tất cả khách hàng ({customers.length})
          </Typography>
        </Box>
        <TextField
          placeholder="Tìm kiếm..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' }, minWidth: 250 }}
        />
      </Box>

      <Paper sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)' }}>
                {['Khách hàng', 'Email', 'SĐT', 'Số booking', 'Trạng thái', 'Thao tác'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 700, color: '#495057', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có khách hàng nào'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((customer) => (
                  <TableRow key={customer._id || customer.id} hover sx={{ '&:hover': { background: '#f8fffe' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: '#6a1b9a', width: 36, height: 36, fontSize: '0.85rem' }}>
                          {customer.name?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <Typography fontWeight={600} fontSize="0.85rem">{customer.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Typography fontSize="0.85rem">{customer.email}</Typography></TableCell>
                    <TableCell><Typography fontSize="0.85rem">{customer.phone || 'N/A'}</Typography></TableCell>
                    <TableCell>
                      <Chip label={customer.bookingCount} size="small" sx={{ fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={customer.isActive !== false ? 'Hoạt động' : 'Đã khoá'}
                        color={customer.isActive !== false ? 'success' : 'error'}
                        size="small"
                        sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title={customer.isActive !== false ? 'Khoá tài khoản' : 'Mở khoá'}>
                          <IconButton size="small" onClick={() => handleToggleStatus(customer._id || customer.id)}>
                            {customer.isActive !== false ? <BlockIcon fontSize="small" sx={{ color: '#e65100' }} /> : <ActiveIcon fontSize="small" sx={{ color: '#2e7d32' }} />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xoá">
                          <IconButton size="small" onClick={() => setDeleteConfirm(customer._id || customer.id)}>
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
    </Box>
  );
};

export default ManageCustomers;
