import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authService';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../types';

export const checkCurrentUser = createAsyncThunk<AuthResponse | null, void, { rejectValue: string }>(
  'auth/checkCurrent',
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.getCurrentUser();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Session expired');
    }
  }
);

export const loginAdmin = createAsyncThunk<AuthResponse, LoginRequest, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await authApi.login(credentials);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const registerAdmin = createAsyncThunk<AuthResponse, RegisterRequest, { rejectValue: string }>(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      return await authApi.register(data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Registration failed');
    }
  }
);
