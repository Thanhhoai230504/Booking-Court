import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Booking, CreateBookingRequest } from '../../types';
import axiosPickleball from '../../api/axiosPickleball';

interface CourtScheduleSlot {
  _id: string;
  startTime: string;
  endTime: string;
  status: string;
  courtNumber?: number;
}

interface BookingState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  createSuccess: boolean;
  courtSchedule: CourtScheduleSlot[];
}

const initialState: BookingState = {
  bookings: [],
  selectedBooking: null,
  isLoading: false,
  error: null,
  createSuccess: false,
  courtSchedule: [],
};

export const fetchMyBookings = createAsyncThunk<Booking[], { status?: string; startDate?: string; endDate?: string } | void>(
  'bookings/fetchMine',
  async (params, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        if (params.status) queryParams.append('status', params.status);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
      }
      const response = await axiosPickleball.get(`/bookings?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Không thể tải danh sách đặt sân');
    }
  }
);

export const fetchBookingDetail = createAsyncThunk<Booking, string>(
  'bookings/fetchDetail',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await axiosPickleball.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Không thể tải chi tiết đơn đặt sân');
    }
  }
);

export const createBooking = createAsyncThunk<Booking, CreateBookingRequest>(
  'bookings/create',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axiosPickleball.post('/bookings', bookingData);
      return response.data.booking;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Đặt sân thất bại');
    }
  }
);

export const deleteBooking = createAsyncThunk<string, string>(
  'bookings/delete',
  async (bookingId, { rejectWithValue }) => {
    try {
      await axiosPickleball.delete(`/bookings/${bookingId}`);
      return bookingId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Hủy đặt sân thất bại');
    }
  }
);

export const fetchCourtSchedule = createAsyncThunk<
  CourtScheduleSlot[],
  { courtId: string; date: string }
>(
  'bookings/fetchCourtSchedule',
  async ({ courtId, date }, { rejectWithValue }) => {
    try {
      const response = await axiosPickleball.get(`/bookings/court/${courtId}/schedule?date=${date}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Không thể tải lịch sân');
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },
    resetCreateSuccess: (state) => {
      state.createSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBookingDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBookingDetail.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.isLoading = false;
        state.selectedBooking = action.payload;
      })
      .addCase(fetchBookingDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.isLoading = false;
        state.bookings.unshift(action.payload);
        state.createSuccess = true;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.createSuccess = false;
      })
      .addCase(deleteBooking.fulfilled, (state, action: PayloadAction<string>) => {
        state.bookings = state.bookings.filter((b) => b._id !== action.payload);
      })
      .addCase(fetchCourtSchedule.fulfilled, (state, action: PayloadAction<CourtScheduleSlot[]>) => {
        state.courtSchedule = action.payload;
      });
  },
});

export const { clearBookingError, resetCreateSuccess } = bookingSlice.actions;
export default bookingSlice.reducer;
