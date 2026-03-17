import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courtReducer from './slices/courtSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courts: courtReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
