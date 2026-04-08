import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courtReducer from './slices/courtSlice';
import bookingReducer from './slices/bookingSlice';
import favoriteReducer from './slices/favoriteSlice';
import adminReducer from './slices/adminSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    courts: courtReducer,
    bookings: bookingReducer,
    favorites: favoriteReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
