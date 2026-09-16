import { createAsyncThunk } from '@reduxjs/toolkit';
import { facultySeatApi } from '../../api/facultySeatService';
import { FacultySeatMatrix, PageResponse } from '../../types';

export interface FacultySearchParams {
  sessionCode?: string;
  instituteId?: number;
  department?: string;
  search?: string;
  page?: number;
  size?: number;
}

export const fetchFacultyPage = createAsyncThunk<PageResponse<FacultySeatMatrix>, FacultySearchParams, { rejectValue: string }>(
  'faculty/fetchPage',
  async (params, { rejectWithValue }) => {
    try {
      return await facultySeatApi.search(params);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch faculty seat matrix');
    }
  }
);

export const createFacultySeat = createAsyncThunk<FacultySeatMatrix, Partial<FacultySeatMatrix>, { rejectValue: string }>(
  'faculty/create',
  async (data, { rejectWithValue }) => {
    try {
      return await facultySeatApi.create(data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to create faculty supervisor entry');
    }
  }
);

export const updateFacultySeat = createAsyncThunk<FacultySeatMatrix, { id: number; data: Partial<FacultySeatMatrix> }, { rejectValue: string }>(
  'faculty/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await facultySeatApi.update(id, data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update faculty supervisor entry');
    }
  }
);

export const deleteFacultySeat = createAsyncThunk<number, number, { rejectValue: string }>(
  'faculty/delete',
  async (id, { rejectWithValue }) => {
    try {
      await facultySeatApi.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete faculty supervisor entry');
    }
  }
);
