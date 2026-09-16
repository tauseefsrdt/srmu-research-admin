import apiClient from './client';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from '../types';

export const authApi = {
  login: async (request: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', request);
    if (res.data?.data?.token) {
      localStorage.setItem('srmu_admin_token', res.data.data.token);
      localStorage.setItem('srmu_admin_user', JSON.stringify(res.data.data));
    }
    return res.data.data;
  },

  register: async (request: RegisterRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', request);
    if (res.data?.data?.token) {
      localStorage.setItem('srmu_admin_token', res.data.data.token);
      localStorage.setItem('srmu_admin_user', JSON.stringify(res.data.data));
    }
    return res.data.data;
  },

  getCurrentUser: async (): Promise<AuthResponse | null> => {
    const token = localStorage.getItem('srmu_admin_token');
    if (!token) return null;
    try {
      const res = await apiClient.get<ApiResponse<AuthResponse>>('/auth/me');
      return res.data.data;
    } catch {
      localStorage.removeItem('srmu_admin_token');
      localStorage.removeItem('srmu_admin_user');
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('srmu_admin_token');
    localStorage.removeItem('srmu_admin_user');
  },

  getStoredUser: (): AuthResponse | null => {
    const userStr = localStorage.getItem('srmu_admin_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
};
