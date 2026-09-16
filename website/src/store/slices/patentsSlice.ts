import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/apiClient';
import { Patent, Department } from '../../types';
import { patents as fallbackPatents } from '../../data/data';

interface PatentsState {
  items: Patent[];
  departments: Department[];
  loading: boolean;
  error: string | null;
}

const initialState: PatentsState = {
  items: (fallbackPatents as any[]).map((p, idx) => ({
    ...p,
    id: p._id || p.srNo || idx + 1,
    authors: p.patenterName,
    year: p.yearOfAward,
    abstract: p.patentNumber,
  })),
  departments: [],
  loading: false,
  error: null,
};

export const fetchPatents = createAsyncThunk(
  'patents/fetchPatents',
  async (sessionCode: string = '2025-26', { rejectWithValue }) => {
    try {
      const res = await api.get('/research-items/by-category/PATENT', {
        params: { sessionCode },
      });
      if (res.data?.data && res.data.data.length > 0) {
        return res.data.data.map((item: any, idx: number) => ({
          srNo: item.srNo || idx + 1,
          _id: item.id,
          id: item.id,
          patenterName: item.primaryAuthor,
          authors: item.primaryAuthor,
          patentNumber: item.identifier,
          abstract: item.identifier,
          title: item.title,
          yearOfAward: item.eventOrAwardDate || item.publicationYear || '',
          year: item.eventOrAwardDate || item.publicationYear || '',
        }));
      }
      return [];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch patents');
    }
  }
);

const patentsSlice = createSlice({
  name: 'patents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatents.fulfilled, (state, action: PayloadAction<Patent[]>) => {
        state.loading = false;
        if (action.payload && action.payload.length > 0) {
          state.items = action.payload;
        }
      })
      .addCase(fetchPatents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default patentsSlice.reducer;
