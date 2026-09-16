import { createAsyncThunk } from '@reduxjs/toolkit';
import { instituteApi } from '../../api/instituteService';
import { Institute } from '../../types';

export const fetchInstitutes = createAsyncThunk<Institute[], void, { rejectValue: string }>(
  'institutes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await instituteApi.getAll();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch institutes');
    }
  }
);

export const createInstitute = createAsyncThunk<Institute, Partial<Institute>, { rejectValue: string }>(
  'institutes/create',
  async (data, { rejectWithValue }) => {
    try {
      return await instituteApi.create(data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to create institute');
    }
  }
);

export const updateInstitute = createAsyncThunk<Institute, { id: number; data: Partial<Institute> }, { rejectValue: string }>(
  'institutes/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await instituteApi.update(id, data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update institute');
    }
  }
);

export const deleteInstitute = createAsyncThunk<number, number, { rejectValue: string }>(
  'institutes/delete',
  async (id, { rejectWithValue }) => {
    try {
      await instituteApi.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete institute');
    }
  }
);
