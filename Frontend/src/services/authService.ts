import axiosPickleball from '../api/axiosPickleball';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosPickleball.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosPickleball.post('/auth/register', data);
    return response.data;
  },
};

export default authService;
