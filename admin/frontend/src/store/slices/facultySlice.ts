import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FacultySeatMatrix, PageResponse } from '../../types';
import {
  fetchFacultyPage,
  createFacultySeat,
  updateFacultySeat,
  deleteFacultySeat,
} from '../thunks/facultyThunks';

interface FacultyState {
  items: FacultySeatMatrix[];
  totalElements: number;
  totalPages: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  actionSuccess: string | null;
}

const initialState: FacultyState = {
  items: [],
  totalElements: 0,
  totalPages: 0,
  page: 0,
  pageSize: 15,
  loading: false,
  error: null,
  actionSuccess: null,
};

export const facultySlice = createSlice({
  name: 'faculty',
  initialState,
  reducers: {
    setFacultyPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    clearFacultyStatus: (state) => {
      state.error = null;
      state.actionSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchFacultyPage
      .addCase(fetchFacultyPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFacultyPage.fulfilled, (state, action: PayloadAction<PageResponse<FacultySeatMatrix>>) => {
        state.loading = false;
        state.items = action.payload.content || [];
        state.totalElements = action.payload.totalElements || 0;
        state.totalPages = action.payload.totalPages || 0;
      })
      .addCase(fetchFacultyPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch faculty seat matrix';
      })

      // createFacultySeat
      .addCase(createFacultySeat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFacultySeat.fulfilled, (state, action: PayloadAction<FacultySeatMatrix>) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.totalElements += 1;
        state.actionSuccess = 'Faculty supervisor entry created successfully';
      })
      .addCase(createFacultySeat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create faculty supervisor entry';
      })

      // updateFacultySeat
      .addCase(updateFacultySeat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFacultySeat.fulfilled, (state, action: PayloadAction<FacultySeatMatrix>) => {
        state.loading = false;
        const index = state.items.findIndex((f) => f.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.actionSuccess = 'Faculty supervisor entry updated successfully';
      })
      .addCase(updateFacultySeat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update faculty supervisor entry';
      })

      // deleteFacultySeat
      .addCase(deleteFacultySeat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFacultySeat.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.items = state.items.filter((f) => f.id !== action.payload);
        state.totalElements = Math.max(0, state.totalElements - 1);
        state.actionSuccess = 'Faculty supervisor entry deleted successfully';
      })
      .addCase(deleteFacultySeat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete faculty supervisor entry';
      });
  },
});

export const { setFacultyPage, clearFacultyStatus } = facultySlice.actions;
export default facultySlice.reducer;
