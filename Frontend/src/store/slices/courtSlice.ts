import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Court } from "../../types";
import axiosPickleball from "../../api/axiosPickleball";

interface CourtState {
  courts: Court[];
  selectedCourt: Court | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CourtState = {
  courts: [],
  selectedCourt: null,
  isLoading: false,
  error: null,
};

export const fetchAvailableCourts = createAsyncThunk<
  Court[],
  { city?: string; date?: string; maxPrice?: number } | void
>("courts/fetchAvailable", async (params, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();
    if (params) {
      if (params.city) queryParams.append("city", params.city);
      if (params.date) queryParams.append("date", params.date);
      if (params.maxPrice)
        queryParams.append("maxPrice", params.maxPrice.toString());
    }
    const response = await axiosPickleball.get(
      `/courts/available?${queryParams.toString()}`,
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.error || "Không thể tải danh sách sân",
    );
  }
});

export const fetchCourtDetail = createAsyncThunk<Court, string>(
  "courts/fetchDetail",
  async (courtId, { rejectWithValue }) => {
    try {
      const response = await axiosPickleball.get(`/courts/${courtId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Không thể tải chi tiết sân",
      );
    }
  },
);

const courtSlice = createSlice({
  name: "courts",
  initialState,
  reducers: {
    clearSelectedCourt: (state) => {
      state.selectedCourt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableCourts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchAvailableCourts.fulfilled,
        (state, action: PayloadAction<Court[]>) => {
          state.isLoading = false;
          state.courts = action.payload;
        },
      )
      .addCase(fetchAvailableCourts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCourtDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchCourtDetail.fulfilled,
        (state, action: PayloadAction<Court>) => {
          state.isLoading = false;
          state.selectedCourt = action.payload;
        },
      )
      .addCase(fetchCourtDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedCourt } = courtSlice.actions;
export default courtSlice.reducer;
