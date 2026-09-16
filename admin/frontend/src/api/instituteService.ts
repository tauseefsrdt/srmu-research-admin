import apiClient from './client';
import { ApiResponse, Institute } from '../types';

export const instituteApi = {
  getAll: async (): Promise<Institute[]> => {
    const res = await apiClient.get<ApiResponse<Institute[]>>('/institutes');
    return res.data.data;
  },

  getById: async (id: number): Promise<Institute> => {
    const res = await apiClient.get<ApiResponse<Institute>>(`/institutes/${id}`);
    return res.data.data;
  },

  create: async (institute: Partial<Institute>): Promise<Institute> => {
    const res = await apiClient.post<ApiResponse<Institute>>('/institutes', institute);
    return res.data.data;
  },

  update: async (id: number, institute: Partial<Institute>): Promise<Institute> => {
    const res = await apiClient.put<ApiResponse<Institute>>(`/institutes/${id}`, institute);
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/institutes/${id}`);
  },
};
