import axiosPickleball from '../api/axiosPickleball';
import {
  Court,
  Booking,
  Drink,
  DashboardData,
  RevenueByDate,
  RevenueByMonth,
  RevenueByCourt,
} from '../types';

export const adminService = {
  // ---- Courts ----
  getAdminCourts: async (adminId: string): Promise<Court[]> => {
    const response = await axiosPickleball.get(`/courts/admin/${adminId}/courts`);
    return response.data;
  },

  createCourt: async (data: Record<string, any>, imageFiles?: File[]): Promise<{ message: string; court: Court }> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('address', data.address);
    if (data.city) formData.append('city', data.city);
    if (data.description) formData.append('description', data.description);
    formData.append('totalCourts', String(data.totalCourts));
    formData.append('pricePerHour', String(data.pricePerHour));
    if (data.openingHours) formData.append('openingHours', JSON.stringify(data.openingHours));
    if (data.hourlyPricing) formData.append('hourlyPricing', JSON.stringify(data.hourlyPricing));

    if (imageFiles) {
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });
    }

    const response = await axiosPickleball.post('/courts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateCourt: async (id: string, data: Record<string, any>, imageFiles?: File[]): Promise<{ message: string; court: Court }> => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.address) formData.append('address', data.address);
    if (data.city !== undefined) formData.append('city', data.city);
    if (data.description !== undefined) formData.append('description', data.description);
    if (data.totalCourts) formData.append('totalCourts', String(data.totalCourts));
    if (data.pricePerHour) formData.append('pricePerHour', String(data.pricePerHour));
    if (data.status) formData.append('status', data.status);
    if (data.openingHours) formData.append('openingHours', JSON.stringify(data.openingHours));
    if (data.hourlyPricing) formData.append('hourlyPricing', JSON.stringify(data.hourlyPricing));

    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });
    }

    const response = await axiosPickleball.put(`/courts/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteCourt: async (id: string): Promise<{ message: string }> => {
    const response = await axiosPickleball.delete(`/courts/${id}`);
    return response.data;
  },

  // ---- Bookings ----
  getAdminBookings: async (
    adminId: string,
    params?: { status?: string; startDate?: string; endDate?: string }
  ): Promise<Booking[]> => {
    const queryParams = new URLSearchParams();
    if (params) {
      if (params.status) queryParams.append('status', params.status);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
    }
    const response = await axiosPickleball.get(
      `/bookings/admin/${adminId}/bookings?${queryParams.toString()}`
    );
    return response.data;
  },

  approveBooking: async (id: string): Promise<{ message: string; booking: Booking }> => {
    const response = await axiosPickleball.post(`/bookings/${id}/approve`);
    return response.data;
  },

  rejectBooking: async (id: string): Promise<{ message: string; booking: Booking }> => {
    const response = await axiosPickleball.post(`/bookings/${id}/reject`);
    return response.data;
  },

  completeBooking: async (id: string): Promise<{ message: string; booking: Booking }> => {
    const response = await axiosPickleball.post(`/bookings/${id}/complete`);
    return response.data;
  },

  addDrinkToBooking: async (
    bookingId: string,
    data: { drinkId: string; quantity: number }
  ): Promise<{ message: string; booking: Booking }> => {
    const response = await axiosPickleball.post(`/bookings/${bookingId}/add-drink`, data);
    return response.data;
  },

  updateBooking: async (
    id: string,
    data: Partial<Booking>
  ): Promise<{ message: string; booking: Booking }> => {
    const response = await axiosPickleball.put(`/bookings/${id}`, data);
    return response.data;
  },

  // ---- Drinks ----
  getAdminDrinks: async (adminId: string): Promise<Drink[]> => {
    const response = await axiosPickleball.get(`/drinks/admin/${adminId}`);
    return response.data.drinks;
  },

  createDrink: async (data: Record<string, any>, imageFile?: File): Promise<{ message: string; drink: Drink }> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', String(data.price));
    if (data.quantity !== undefined) formData.append('quantity', String(data.quantity));
    if (data.minStock !== undefined) formData.append('minStock', String(data.minStock));
    if (data.description) formData.append('description', data.description);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await axiosPickleball.post('/drinks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateDrink: async (id: string, data: Record<string, any>, imageFile?: File): Promise<{ message: string; drink: Drink }> => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.price !== undefined) formData.append('price', String(data.price));
    if (data.minStock !== undefined) formData.append('minStock', String(data.minStock));
    if (data.description !== undefined) formData.append('description', data.description);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await axiosPickleball.put(`/drinks/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateStock: async (id: string, quantity: number): Promise<{ message: string; drink: Drink }> => {
    const response = await axiosPickleball.post(`/drinks/${id}/update-stock`, { quantity });
    return response.data;
  },

  deleteDrink: async (id: string): Promise<{ message: string }> => {
    const response = await axiosPickleball.delete(`/drinks/${id}`);
    return response.data;
  },

  // ---- Revenue ----
  getDashboard: async (
    adminId: string,
    params?: { startDate?: string; endDate?: string; courtId?: string }
  ): Promise<DashboardData> => {
    const queryParams = new URLSearchParams();
    if (params) {
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.courtId) queryParams.append('courtId', params.courtId);
    }
    const response = await axiosPickleball.get(
      `/revenue/admin/${adminId}/dashboard?${queryParams.toString()}`
    );
    return response.data;
  },

  getRevenueByDate: async (
    adminId: string,
    params?: { startDate?: string; endDate?: string }
  ): Promise<RevenueByDate[]> => {
    const queryParams = new URLSearchParams();
    if (params) {
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
    }
    const response = await axiosPickleball.get(
      `/revenue/admin/${adminId}/revenue-by-date?${queryParams.toString()}`
    );
    return response.data;
  },

  getRevenueByMonth: async (
    adminId: string,
    params?: { year?: string }
  ): Promise<RevenueByMonth[]> => {
    const queryParams = new URLSearchParams();
    if (params?.year) queryParams.append('year', params.year);
    const response = await axiosPickleball.get(
      `/revenue/admin/${adminId}/revenue-by-month?${queryParams.toString()}`
    );
    return response.data;
  },

  getRevenueByCourt: async (
    adminId: string,
    params?: { startDate?: string; endDate?: string }
  ): Promise<RevenueByCourt[]> => {
    const queryParams = new URLSearchParams();
    if (params) {
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
    }
    const response = await axiosPickleball.get(
      `/revenue/admin/${adminId}/revenue-by-court?${queryParams.toString()}`
    );
    return response.data;
  },
};

export default adminService;
