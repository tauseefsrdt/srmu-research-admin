import apiClient from './client';
import { AcademicSession, ApiResponse, ResearchCategory } from '../types';

export const sessionApi = {
  getAll: async (): Promise<AcademicSession[]> => {
    const res = await apiClient.get<ApiResponse<AcademicSession[]>>('/academic-sessions');
    return res.data.data;
  },

  getCurrent: async (): Promise<AcademicSession> => {
    const res = await apiClient.get<ApiResponse<AcademicSession>>('/academic-sessions/current');
    return res.data.data;
  },

  create: async (session: Partial<AcademicSession>): Promise<AcademicSession> => {
    const res = await apiClient.post<ApiResponse<AcademicSession>>('/academic-sessions', session);
    return res.data.data;
  },

  update: async (id: number, session: Partial<AcademicSession>): Promise<AcademicSession> => {
    const res = await apiClient.put<ApiResponse<AcademicSession>>(`/academic-sessions/${id}`, session);
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/academic-sessions/${id}`);
  },
};

export const categoryApi = {
  getAll: async (): Promise<ResearchCategory[]> => {
    const res = await apiClient.get<ApiResponse<ResearchCategory[]>>('/research-categories');
    return res.data.data;
  },

  create: async (category: Partial<ResearchCategory>): Promise<ResearchCategory> => {
    const res = await apiClient.post<ApiResponse<ResearchCategory>>('/research-categories', category);
    return res.data.data;
  },

  update: async (id: number, category: Partial<ResearchCategory>): Promise<ResearchCategory> => {
    const res = await apiClient.put<ApiResponse<ResearchCategory>>(`/research-categories/${id}`, category);
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/research-categories/${id}`);
  },
};
