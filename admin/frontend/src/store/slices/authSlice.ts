import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthResponse } from '../../types';
import { checkCurrentUser, loginAdmin, registerAdmin } from '../thunks/authThunks';
import { authApi } from '../../api/authService';

interface AuthState {
  currentUser: AuthResponse | null;
  authChecked: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  currentUser: authApi.getStoredUser(),
  authChecked: false,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authApi.logout();
      state.currentUser = null;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // checkCurrentUser
      .addCase(checkCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.authChecked = true;
      })
      .addCase(checkCurrentUser.rejected, (state) => {
        state.loading = false;
        state.currentUser = null;
        state.authChecked = true;
      })
      // loginAdmin
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.authChecked = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      // registerAdmin
      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAdmin.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.authChecked = true;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
