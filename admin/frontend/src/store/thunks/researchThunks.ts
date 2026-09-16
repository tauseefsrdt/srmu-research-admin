import { createAsyncThunk } from '@reduxjs/toolkit';
import { researchApi } from '../../api/researchService';
import { ResearchItem, PageResponse, Stats } from '../../types';

export interface ResearchSearchParams {
  sessionCode?: string;
  categoryCode?: string;
  instituteId?: number;
  year?: string;
  search?: string;
  page?: number;
  size?: number;
}

export const fetchResearchPage = createAsyncThunk<PageResponse<ResearchItem>, ResearchSearchParams, { rejectValue: string }>(
  'research/fetchPage',
  async (params, { rejectWithValue }) => {
    try {
      return await researchApi.searchResearchItems(params);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch research items');
    }
  }
);

export const createResearchItem = createAsyncThunk<ResearchItem, Partial<ResearchItem>, { rejectValue: string }>(
  'research/create',
  async (data, { rejectWithValue }) => {
    try {
      return await researchApi.create(data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to create research item');
    }
  }
);

export const updateResearchItem = createAsyncThunk<ResearchItem, { id: number; data: Partial<ResearchItem> }, { rejectValue: string }>(
  'research/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await researchApi.update(id, data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update research item');
    }
  }
);

export const deleteResearchItem = createAsyncThunk<number, number, { rejectValue: string }>(
  'research/delete',
  async (id, { rejectWithValue }) => {
    try {
      await researchApi.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete research item');
    }
  }
);

export const fetchAdminStats = createAsyncThunk<Stats, string | undefined, { rejectValue: string }>(
  'research/fetchStats',
  async (sessionCode, { rejectWithValue }) => {
    try {
      return await researchApi.getStats(sessionCode);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch admin stats');
    }
  }
);
