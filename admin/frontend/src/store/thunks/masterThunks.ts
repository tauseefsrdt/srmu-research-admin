import { createAsyncThunk } from '@reduxjs/toolkit';
import { sessionApi, categoryApi } from '../../api/sessionService';
import { AcademicSession, ResearchCategory } from '../../types';

export const fetchSessions = createAsyncThunk<AcademicSession[], void, { rejectValue: string }>(
  'sessions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await sessionApi.getAll();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch academic sessions');
    }
  }
);

export const createSession = createAsyncThunk<AcademicSession, Partial<AcademicSession>, { rejectValue: string }>(
  'sessions/create',
  async (data, { rejectWithValue }) => {
    try {
      return await sessionApi.create(data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to create academic session');
    }
  }
);

export const updateSession = createAsyncThunk<AcademicSession, { id: number; data: Partial<AcademicSession> }, { rejectValue: string }>(
  'sessions/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await sessionApi.update(id, data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update academic session');
    }
  }
);

export const deleteSession = createAsyncThunk<number, number, { rejectValue: string }>(
  'sessions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await sessionApi.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete academic session');
    }
  }
);

export const fetchCategories = createAsyncThunk<ResearchCategory[], void, { rejectValue: string }>(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await categoryApi.getAll();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch research categories');
    }
  }
);

export const createCategory = createAsyncThunk<ResearchCategory, Partial<ResearchCategory>, { rejectValue: string }>(
  'categories/create',
  async (data, { rejectWithValue }) => {
    try {
      return await categoryApi.create(data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to create research category');
    }
  }
);

export const updateCategory = createAsyncThunk<ResearchCategory, { id: number; data: Partial<ResearchCategory> }, { rejectValue: string }>(
  'categories/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await categoryApi.update(id, data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update research category');
    }
  }
);

export const deleteCategory = createAsyncThunk<number, number, { rejectValue: string }>(
  'categories/delete',
  async (id, { rejectWithValue }) => {
    try {
      await categoryApi.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete research category');
    }
  }
);
