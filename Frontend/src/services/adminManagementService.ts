import axiosPickleball from '../api/axiosPickleball';
import { User } from '../types';

export interface OwnerWithStats extends User {
  courtCount: number;
  totalRevenue: number;
  isActive: boolean;
}

export interface CustomerWithStats extends User {
  bookingCount: number;
  isActive: boolean;
}

export interface OwnerDetail extends User {
  courts: any[];
  totalRevenue: number;
  bookingCount: number;
  isActive: boolean;
}

export interface SystemDashboard {
  totalOwners: number;
  totalCustomers: number;
  totalCourts: number;
  totalBookings: number;
  totalRevenue: number;
  courtRevenue: number;
  drinkRevenue: number;
  revenueByOwner: Array<{
    _id: string;
    totalRevenue: number;
    transactionCount: number;
    ownerDetails: {
      _id: string;
      name: string;
      email: string;
    };
  }>;
}

export const adminManagementService = {
  getSystemDashboard: async (): Promise<SystemDashboard> => {
    const response = await axiosPickleball.get('/admin-management/dashboard');
    return response.data;
  },

  createOwner: async (data: any): Promise<{ message: string; user: any }> => {
    const response = await axiosPickleball.post('/admin-management/owners', data);
    return response.data;
  },

  getAllOwners: async (): Promise<OwnerWithStats[]> => {
    const response = await axiosPickleball.get('/admin-management/owners');
    return response.data;
  },

  getAllCustomers: async (): Promise<CustomerWithStats[]> => {
    const response = await axiosPickleball.get('/admin-management/customers');
    return response.data;
  },

  getOwnerById: async (id: string): Promise<OwnerDetail> => {
    const response = await axiosPickleball.get(`/admin-management/owners/${id}`);
    return response.data;
  },

  toggleUserStatus: async (id: string): Promise<{ message: string; user: any }> => {
    const response = await axiosPickleball.post(`/admin-management/users/${id}/toggle-status`);
    return response.data;
  },

  deleteUser: async (id: string): Promise<{ message: string }> => {
    const response = await axiosPickleball.delete(`/admin-management/users/${id}`);
    return response.data;
  },
};

export default adminManagementService;
