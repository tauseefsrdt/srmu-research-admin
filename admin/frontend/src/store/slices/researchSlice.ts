import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ResearchItem, Stats, PageResponse } from '../../types';
import {
  fetchResearchPage,
  createResearchItem,
  updateResearchItem,
  deleteResearchItem,
  fetchAdminStats,
} from '../thunks/researchThunks';

interface ResearchState {
  items: ResearchItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  pageSize: number;
  stats: Stats | null;
  loading: boolean;
  statsLoading: boolean;
  error: string | null;
  actionSuccess: string | null;
}

const initialState: ResearchState = {
  items: [],
  totalElements: 0,
  totalPages: 0,
  page: 0,
  pageSize: 15,
  stats: null,
  loading: false,
  statsLoading: false,
  error: null,
  actionSuccess: null,
};

export const researchSlice = createSlice({
  name: 'research',
  initialState,
  reducers: {
    setResearchPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    clearResearchStatus: (state) => {
      state.error = null;
      state.actionSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchResearchPage
      .addCase(fetchResearchPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResearchPage.fulfilled, (state, action: PayloadAction<PageResponse<ResearchItem>>) => {
        state.loading = false;
        state.items = action.payload.content || [];
        state.totalElements = action.payload.totalElements || 0;
        state.totalPages = action.payload.totalPages || 0;
      })
      .addCase(fetchResearchPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch research items';
      })

      // createResearchItem
      .addCase(createResearchItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createResearchItem.fulfilled, (state, action: PayloadAction<ResearchItem>) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.totalElements += 1;
        state.actionSuccess = 'Research item created successfully';
      })
      .addCase(createResearchItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create research item';
      })

      // updateResearchItem
      .addCase(updateResearchItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateResearchItem.fulfilled, (state, action: PayloadAction<ResearchItem>) => {
        state.loading = false;
        const index = state.items.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.actionSuccess = 'Research item updated successfully';
      })
      .addCase(updateResearchItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update research item';
      })

      // deleteResearchItem
      .addCase(deleteResearchItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteResearchItem.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.items = state.items.filter((i) => i.id !== action.payload);
        state.totalElements = Math.max(0, state.totalElements - 1);
        state.actionSuccess = 'Research item deleted successfully';
      })
      .addCase(deleteResearchItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete research item';
      })

      // fetchAdminStats
      .addCase(fetchAdminStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action: PayloadAction<Stats>) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state) => {
        state.statsLoading = false;
      });
  },
});

export const { setResearchPage, clearResearchStatus } = researchSlice.actions;
export default researchSlice.reducer;
