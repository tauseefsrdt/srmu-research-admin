import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/apiClient';
import { Patent, Department } from '../../types';

interface FetchPatentsParams {
  sessionCode?: string;
  search?: string;
  year?: string;
  page?: number;
  size?: number;
}

interface PatentsState {
  items: Patent[];
  departments: Department[];
  totalElements: number;
  loading: boolean;
  error: string | null;
}

const initialState: PatentsState = {
  items: [],
  departments: [],
  totalElements: 0,
  loading: false,
  error: null,
};

export const fetchPatents = createAsyncThunk(
  'patents/fetchPatents',
  async (params: FetchPatentsParams | string = {}, { rejectWithValue }) => {
    try {
      const options: FetchPatentsParams =
        typeof params === 'string' ? { sessionCode: params } : params;

      const hasAdvancedParams = options.search || options.year || (options.page !== undefined);

      let res;
      if (hasAdvancedParams) {
        res = await api.get('/research-items', {
          params: {
            categoryCode: 'PATENT',
            sessionCode: options.sessionCode || '2025-26',
            search: options.search || undefined,
            year: options.year || undefined,
            page: options.page ?? 0,
            size: options.size ?? 500,
          },
        });
      } else {
        res = await api.get('/research-items/by-category/PATENT', {
          params: { sessionCode: options.sessionCode || '2025-26' },
        });
      }

      const rawList = res.data?.data?.content || res.data?.data || [];

      if (Array.isArray(rawList)) {
        return rawList.map((item: any, idx: number) => ({
          srNo: item.srNo || idx + 1,
          _id: item.id,
          id: item.id,
          patenterName: item.primaryAuthor,
          authors: item.primaryAuthor,
          patentNumber: item.identifier,
          abstract: item.identifier,
          title: item.title,
          department: item.department || '',
          departmentKey: item.department || '',
          yearOfAward: item.eventOrAwardDate || item.publicationYear || '',
          year: item.eventOrAwardDate || item.publicationYear || '',
        }));
      }
      return [];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch patents');
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
        state.items = action.payload || [];
        state.totalElements = action.payload ? action.payload.length : 0;
      })
      .addCase(fetchPatents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default patentsSlice.reducer;
