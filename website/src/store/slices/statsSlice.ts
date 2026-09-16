import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/apiClient';
import { Stats } from '../../types';

interface StatsState {
  stats: Stats | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatsState = {
  stats: {
    totalIndexed: 195,
    totalPapers: 17,
    totalBooks: 68,
    totalResearchers: 250,
  },
  loading: false,
  error: null,
};

export const fetchStats = createAsyncThunk(
  'stats/fetchStats',
  async (sessionCode: string = '2025-26', { rejectWithValue }) => {
    try {
      const res = await api.get('/stats', { params: { sessionCode } });
      if (res.data?.data) {
        return {
          totalIndexed: res.data.data.totalPublications || 195,
          totalPapers: res.data.data.totalPatents || 17,
          totalBooks: res.data.data.totalBooks || 68,
          totalResearchers: res.data.data.totalSupervisors || 103,
        };
      }
      return null;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch stats');
    }
  }
);

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.stats = action.payload;
        }
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default statsSlice.reducer;
