import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Institute } from '../../types';
import {
  fetchInstitutes,
  createInstitute,
  updateInstitute,
  deleteInstitute,
} from '../thunks/instituteThunks';

interface InstitutesState {
  items: Institute[];
  loading: boolean;
  error: string | null;
  actionSuccess: string | null;
}

const initialState: InstitutesState = {
  items: [],
  loading: false,
  error: null,
  actionSuccess: null,
};

export const institutesSlice = createSlice({
  name: 'institutes',
  initialState,
  reducers: {
    clearInstituteStatus: (state) => {
      state.error = null;
      state.actionSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchInstitutes
      .addCase(fetchInstitutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstitutes.fulfilled, (state, action: PayloadAction<Institute[]>) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchInstitutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch institutes';
      })
      // createInstitute
      .addCase(createInstitute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInstitute.fulfilled, (state, action: PayloadAction<Institute>) => {
        state.loading = false;
        state.items.push(action.payload);
        state.actionSuccess = 'Institute created successfully';
      })
      .addCase(createInstitute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create institute';
      })
      // updateInstitute
      .addCase(updateInstitute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInstitute.fulfilled, (state, action: PayloadAction<Institute>) => {
        state.loading = false;
        const index = state.items.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.actionSuccess = 'Institute updated successfully';
      })
      .addCase(updateInstitute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update institute';
      })
      // deleteInstitute
      .addCase(deleteInstitute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInstitute.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.items = state.items.filter((i) => i.id !== action.payload);
        state.actionSuccess = 'Institute deleted successfully';
      })
      .addCase(deleteInstitute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete institute';
      });
  },
});

export const { clearInstituteStatus } = institutesSlice.actions;
export default institutesSlice.reducer;
