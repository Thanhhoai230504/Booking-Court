import axiosPickleball from '../api/axiosPickleball';
import { Booking, CreateBookingRequest } from '../types';

export const bookingService = {
  createBooking: async (data: CreateBookingRequest): Promise<{ message: string; booking: Booking }> => {
    const response = await axiosPickleball.post('/bookings', data);
    return response.data;
  },

  getMyBookings: async (params?: { status?: string; startDate?: string; endDate?: string }): Promise<Booking[]> => {
    const queryParams = new URLSearchParams();
    if (params) {
      if (params.status) queryParams.append('status', params.status);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
    }
    const response = await axiosPickleball.get(`/bookings?${queryParams.toString()}`);
    return response.data;
  },

  getBookingById: async (id: string): Promise<Booking> => {
    const response = await axiosPickleball.get(`/bookings/${id}`);
    return response.data;
  },

  deleteBooking: async (id: string): Promise<void> => {
    await axiosPickleball.delete(`/bookings/${id}`);
  },
};

export default bookingService;
