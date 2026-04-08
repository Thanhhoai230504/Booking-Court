import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  Court,
  Booking,
  Drink,
  DashboardData,
  RevenueByDate,
  RevenueByMonth,
  RevenueByCourt,
} from '../../types';
import adminService from '@/services/adminService';


interface AdminState {
  courts: Court[];
  bookings: Booking[];
  drinks: Drink[];
  dashboard: DashboardData | null;
  revenueByDate: RevenueByDate[];
  revenueByMonth: RevenueByMonth[];
  revenueByCourt: RevenueByCourt[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  courts: [],
  bookings: [],
  drinks: [],
  dashboard: null,
  revenueByDate: [],
  revenueByMonth: [],
  revenueByCourt: [],
  isLoading: false,
  error: null,
};

// ---- Court thunks ----
export const fetchAdminCourts = createAsyncThunk(
  'admin/fetchCourts',
  async (adminId: string, { rejectWithValue }) => {
    try {
      return await adminService.getAdminCourts(adminId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Lỗi tải danh sách sân');
    }
  }
);

export const createCourt = createAsyncThunk(
  'admin/createCourt',
  async ({ data, imageFiles }: { data: Record<string, any>; imageFiles?: File[] }, { rejectWithValue }) => {
    try {
      const result = await adminService.createCourt(data, imageFiles);
      return result.court;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Lỗi tạo sân');
    }
  }
);

export const updateCourt = createAsyncThunk(
  'admin/updateCourt',
  async ({ id, data, imageFiles }: { id: string; data: Record<string, any>; imageFiles?: File[] }, { rejectWithValue }) => {
    try {
      const result = await adminService.updateCourt(id, data, imageFiles);
      return result.court;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Lỗi cập nhật sân');
    }
  }
);

export const deleteCourt = createAsyncThunk(
  'admin/deleteCourt',
  async (id: string, { rejectWithValue }) => {
    try {
      await adminService.deleteCourt(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Lỗi xóa sân');
    }
  }
);

// ---- Booking thunks ----
export const fetchAdminBookings = createAsyncThunk(
  'admin/fetchBookings',
  async (
    { adminId, params }: { adminId: string; params?: { status?: string; startDate?: string; endDate?: string } },
    { rejectWithValue }
  ) => {
    try {
      return await adminService.getAdminBookings(adminId, params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Lỗi tải danh sách đặt sân');
    }
  }
);

export const approveBooking = createAsyncThunk(
  'admin/approveBooking',
  async (id: string, { rejectWithValue }) => {
    try {
      const result = await adminService.approveBooking(id);
      return result.booking;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Lỗi duyệt booking');
    }
  }
);

export const rejectBooking = createAsyncThunk(
  'admin/rejectBooking',
  async (id: string, { rejectWithValue }) => {
    try {
      const result = await adminService.rejectBooking(id);
      return result.booking;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Lỗi từ chối booking');
    }
  }
);

export const completeBooking = createAsyncThunk(
  'admin/completeBooking',
  async (id: string, { rejectWithValue }) => {
    try {
      const result = await adminService.completeBooking(id);
      return result.booking;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Lỗi hoàn thành booking');
    }
  }
);

export const addDrinkToBooking = createAsyncThunk(
  'admin/addDrinkToBooking',
  async (
    { bookingId, data }: { bookingId: string; data: { drinkId: string; quantity: number } },
    { rejectWithValue }
  ) => {
    try {
      const result = await adminService.addDrinkToBooking(bookingId, data);
      return result.booking;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Lỗi thêm đồ uống');
    }
  }
);

// ---- Drink thunks ----
export const fetchAdminDrinks = createAsyncThunk(
  'admin/fetchDrinks',
  async (adminId: string, { rejectWithValue }) => {
    try {
      return await adminService.getAdminDrinks(adminId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Lỗi tải danh sách đồ uống');
    }
  }
);

export const createDrink = createAsyncThunk(
  'admin/createDrink',
  async ({ data, imageFile }: { data: Record<string, any>; imageFile?: File }, { rejectWithValue }) => {
    try {
      const result = await adminService.createDrink(data, imageFile);
      return result.drink;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Lỗi tạo đồ uống');
    }
  }
);

export const updateDrink = createAsyncThunk(
  'admin/updateDrink',
  async ({ id, data, imageFile }: { id: string; data: Record<string, any>; imageFile?: File }, { rejectWithValue }) => {
    try {
      const result = await adminService.updateDrink(id, data, imageFile);
      return result.drink;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Lỗi cập nhật đồ uống');
    }
  }
);

export const updateStock = createAsyncThunk(
  'admin/updateStock',
  async ({ id, quantity }: { id: string; quantity: number }, { rejectWithValue }) => {
    try {
      const result = await adminService.updateStock(id, quantity);
      return result.drink;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Lỗi cập nhật tồn kho');
    }
  }
);

export const deleteDrink = createAsyncThunk(
  'admin/deleteDrink',
  async (id: string, { rejectWithValue }) => {
    try {
      await adminService.deleteDrink(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Lỗi xóa đồ uống');
    }
  }
);

// ---- Revenue thunks ----
export const fetchDashboard = createAsyncThunk(
  'admin/fetchDashboard',
  async (
    { adminId, params }: { adminId: string; params?: { startDate?: string; endDate?: string; courtId?: string } },
    { rejectWithValue }
  ) => {
    try {
      return await adminService.getDashboard(adminId, params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Lỗi tải dashboard');
    }
  }
);

export const fetchRevenueByDate = createAsyncThunk(
  'admin/fetchRevenueByDate',
  async (
    { adminId, params }: { adminId: string; params?: { startDate?: string; endDate?: string } },
    { rejectWithValue }
  ) => {
    try {
      return await adminService.getRevenueByDate(adminId, params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Lỗi tải doanh thu theo ngày');
    }
  }
);

export const fetchRevenueByMonth = createAsyncThunk(
  'admin/fetchRevenueByMonth',
  async (
    { adminId, params }: { adminId: string; params?: { year?: string } },
    { rejectWithValue }
  ) => {
    try {
      return await adminService.getRevenueByMonth(adminId, params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Lỗi tải doanh thu theo tháng');
    }
  }
);

export const fetchRevenueByCourt = createAsyncThunk(
  'admin/fetchRevenueByCourt',
  async (
    { adminId, params }: { adminId: string; params?: { startDate?: string; endDate?: string } },
    { rejectWithValue }
  ) => {
    try {
      return await adminService.getRevenueByCourt(adminId, params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Lỗi tải doanh thu theo sân');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Generic loading/error pattern helper
    const addLoadingCases = (thunk: any) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
        });
    };

    // Courts
    addLoadingCases(fetchAdminCourts);
    builder.addCase(fetchAdminCourts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.courts = action.payload;
    });

    addLoadingCases(createCourt);
    builder.addCase(createCourt.fulfilled, (state, action) => {
      state.isLoading = false;
      state.courts.push(action.payload);
    });

    addLoadingCases(updateCourt);
    builder.addCase(updateCourt.fulfilled, (state, action) => {
      state.isLoading = false;
      const idx = state.courts.findIndex((c) => c._id === action.payload._id);
      if (idx !== -1) state.courts[idx] = action.payload;
    });

    addLoadingCases(deleteCourt);
    builder.addCase(deleteCourt.fulfilled, (state, action) => {
      state.isLoading = false;
      state.courts = state.courts.filter((c) => c._id !== action.payload);
    });

    // Bookings
    addLoadingCases(fetchAdminBookings);
    builder.addCase(fetchAdminBookings.fulfilled, (state, action) => {
      state.isLoading = false;
      state.bookings = action.payload;
    });

    addLoadingCases(approveBooking);
    builder.addCase(approveBooking.fulfilled, (state, action) => {
      state.isLoading = false;
      const idx = state.bookings.findIndex((b) => b._id === action.payload._id);
      if (idx !== -1) state.bookings[idx] = action.payload;
    });

    addLoadingCases(rejectBooking);
    builder.addCase(rejectBooking.fulfilled, (state, action) => {
      state.isLoading = false;
      const idx = state.bookings.findIndex((b) => b._id === action.payload._id);
      if (idx !== -1) state.bookings[idx] = action.payload;
    });

    addLoadingCases(completeBooking);
    builder.addCase(completeBooking.fulfilled, (state, action) => {
      state.isLoading = false;
      const idx = state.bookings.findIndex((b) => b._id === action.payload._id);
      if (idx !== -1) state.bookings[idx] = action.payload;
    });

    addLoadingCases(addDrinkToBooking);
    builder.addCase(addDrinkToBooking.fulfilled, (state, action) => {
      state.isLoading = false;
      const idx = state.bookings.findIndex((b) => b._id === action.payload._id);
      if (idx !== -1) state.bookings[idx] = action.payload;
    });

    // Drinks
    addLoadingCases(fetchAdminDrinks);
    builder.addCase(fetchAdminDrinks.fulfilled, (state, action) => {
      state.isLoading = false;
      state.drinks = action.payload;
    });

    addLoadingCases(createDrink);
    builder.addCase(createDrink.fulfilled, (state, action) => {
      state.isLoading = false;
      state.drinks.push(action.payload);
    });

    addLoadingCases(updateDrink);
    builder.addCase(updateDrink.fulfilled, (state, action) => {
      state.isLoading = false;
      const idx = state.drinks.findIndex((d) => d._id === action.payload._id);
      if (idx !== -1) state.drinks[idx] = action.payload;
    });

    addLoadingCases(updateStock);
    builder.addCase(updateStock.fulfilled, (state, action) => {
      state.isLoading = false;
      const idx = state.drinks.findIndex((d) => d._id === action.payload._id);
      if (idx !== -1) state.drinks[idx] = action.payload;
    });

    addLoadingCases(deleteDrink);
    builder.addCase(deleteDrink.fulfilled, (state, action) => {
      state.isLoading = false;
      state.drinks = state.drinks.filter((d) => d._id !== action.payload);
    });

    // Revenue
    addLoadingCases(fetchDashboard);
    builder.addCase(fetchDashboard.fulfilled, (state, action) => {
      state.isLoading = false;
      state.dashboard = action.payload;
    });

    addLoadingCases(fetchRevenueByDate);
    builder.addCase(fetchRevenueByDate.fulfilled, (state, action) => {
      state.isLoading = false;
      state.revenueByDate = action.payload;
    });

    addLoadingCases(fetchRevenueByMonth);
    builder.addCase(fetchRevenueByMonth.fulfilled, (state, action) => {
      state.isLoading = false;
      state.revenueByMonth = action.payload;
    });

    addLoadingCases(fetchRevenueByCourt);
    builder.addCase(fetchRevenueByCourt.fulfilled, (state, action) => {
      state.isLoading = false;
      state.revenueByCourt = action.payload;
    });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
