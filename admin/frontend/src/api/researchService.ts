import apiClient from './client';
import { ApiResponse, PageResponse, ResearchItem, Stats } from '../types';

export interface ResearchFilterParams {
  sessionCode?: string;
  categoryCode?: string;
  instituteId?: number;
  year?: string;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export const researchApi = {
  searchResearchItems: async (params: ResearchFilterParams = {}): Promise<PageResponse<ResearchItem>> => {
    const res = await apiClient.get<ApiResponse<PageResponse<ResearchItem>>>('/research-items', { params });
    return res.data.data;
  },

  getByCategory: async (categoryCode: string, sessionCode?: string): Promise<ResearchItem[]> => {
    const res = await apiClient.get<ApiResponse<ResearchItem[]>>(`/research-items/by-category/${categoryCode}`, {
      params: { sessionCode },
    });
    return res.data.data;
  },

  getById: async (id: number): Promise<ResearchItem> => {
    const res = await apiClient.get<ApiResponse<ResearchItem>>(`/research-items/${id}`);
    return res.data.data;
  },

  create: async (item: Partial<ResearchItem>): Promise<ResearchItem> => {
    const res = await apiClient.post<ApiResponse<ResearchItem>>('/research-items', item);
    return res.data.data;
  },

  update: async (id: number, item: Partial<ResearchItem>): Promise<ResearchItem> => {
    const res = await apiClient.put<ApiResponse<ResearchItem>>(`/research-items/${id}`, item);
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/research-items/${id}`);
  },

  getStats: async (sessionCode?: string): Promise<Stats> => {
    const res = await apiClient.get<ApiResponse<Stats>>('/stats', {
      params: { sessionCode },
    });
    return res.data.data;
  },
};
