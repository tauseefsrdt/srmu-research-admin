import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AcademicSession, ResearchCategory } from '../../types';
import {
  fetchSessions,
  createSession,
  updateSession,
  deleteSession,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../thunks/masterThunks';

interface MasterDataState {
  sessions: AcademicSession[];
  categories: ResearchCategory[];
  activeSessionCode: string;
  loading: boolean;
  error: string | null;
  actionSuccess: string | null;
}

const initialState: MasterDataState = {
  sessions: [],
  categories: [],
  activeSessionCode: '2025-26',
  loading: false,
  error: null,
  actionSuccess: null,
};

export const masterSlice = createSlice({
  name: 'master',
  initialState,
  reducers: {
    setActiveSessionCode: (state, action: PayloadAction<string>) => {
      state.activeSessionCode = action.payload;
    },
    clearMasterStatus: (state) => {
      state.error = null;
      state.actionSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sessions
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSessions.fulfilled, (state, action: PayloadAction<AcademicSession[]>) => {
        state.loading = false;
        state.sessions = action.payload || [];
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch sessions';
      })
      .addCase(createSession.fulfilled, (state, action: PayloadAction<AcademicSession>) => {
        state.sessions.push(action.payload);
        state.actionSuccess = 'Academic session created successfully';
      })
      .addCase(updateSession.fulfilled, (state, action: PayloadAction<AcademicSession>) => {
        const index = state.sessions.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.sessions[index] = action.payload;
        }
        state.actionSuccess = 'Academic session updated successfully';
      })
      .addCase(deleteSession.fulfilled, (state, action: PayloadAction<number>) => {
        state.sessions = state.sessions.filter((s) => s.id !== action.payload);
        state.actionSuccess = 'Academic session deleted successfully';
      })

      // Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<ResearchCategory[]>) => {
        state.loading = false;
        state.categories = action.payload || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch categories';
      })
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<ResearchCategory>) => {
        state.categories.push(action.payload);
        state.actionSuccess = 'Category created successfully';
      })
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<ResearchCategory>) => {
        const index = state.categories.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        state.actionSuccess = 'Category updated successfully';
      })
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<number>) => {
        state.categories = state.categories.filter((c) => c.id !== action.payload);
        state.actionSuccess = 'Category deleted successfully';
      });
  },
});

export const { setActiveSessionCode, clearMasterStatus } = masterSlice.actions;
export default masterSlice.reducer;
