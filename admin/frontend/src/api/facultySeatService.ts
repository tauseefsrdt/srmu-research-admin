import apiClient from './client';
import { ApiResponse, FacultySeatMatrix, PageResponse } from '../types';

export const facultySeatApi = {
  search: async (params: { sessionCode?: string; instituteId?: number; search?: string; page?: number; size?: number }): Promise<PageResponse<FacultySeatMatrix>> => {
    const res = await apiClient.get<ApiResponse<PageResponse<FacultySeatMatrix>>>('/faculty-seats', { params });
    return res.data.data;
  },

  getAllBySession: async (sessionCode?: string): Promise<FacultySeatMatrix[]> => {
    const res = await apiClient.get<ApiResponse<FacultySeatMatrix[]>>('/faculty-seats/all', {
      params: { sessionCode },
    });
    return res.data.data;
  },

  getById: async (id: number): Promise<FacultySeatMatrix> => {
    const res = await apiClient.get<ApiResponse<FacultySeatMatrix>>(`/faculty-seats/${id}`);
    return res.data.data;
  },

  create: async (item: Partial<FacultySeatMatrix>): Promise<FacultySeatMatrix> => {
    const res = await apiClient.post<ApiResponse<FacultySeatMatrix>>('/faculty-seats', item);
    return res.data.data;
  },

  update: async (id: number, item: Partial<FacultySeatMatrix>): Promise<FacultySeatMatrix> => {
    const res = await apiClient.put<ApiResponse<FacultySeatMatrix>>(`/faculty-seats/${id}`, item);
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/faculty-seats/${id}`);
  },
};
