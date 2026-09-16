import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/apiClient';

export interface SearchResultItem {
  id: string;
  type: string; // PUBLICATION, PATENT, BOOK, THESIS_AWARDED, INSTITUTE, FACULTY_SUPERVISOR, PAGE
  categoryLabel: string;
  title: string;
  subtitle?: string;
  identifier?: string;
  venueOrDepartment?: string;
  year?: string | number;
  url: string;
  snippet?: string;
  metadata?: Record<string, any>;
}

export interface SearchResponse {
  query: string;
  totalResults: number;
  typeCounts: Record<string, number>;
  items: SearchResultItem[];
  page: number;
  size: number;
  totalPages: number;
}

interface SearchState {
  query: string;
  selectedType: string; // 'ALL' or specific type
  items: SearchResultItem[];
  typeCounts: Record<string, number>;
  totalResults: number;
  page: number;
  size: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
}

const initialState: SearchState = {
  query: '',
  selectedType: 'ALL',
  items: [],
  typeCounts: {
    PUBLICATION: 0,
    PATENT: 0,
    BOOK: 0,
    THESIS_AWARDED: 0,
    INSTITUTE: 0,
    FACULTY_SUPERVISOR: 0,
    PAGE: 0,
  },
  totalResults: 0,
  page: 0,
  size: 20,
  totalPages: 0,
  loading: false,
  error: null,
  hasSearched: false,
};

export const searchGlobal = createAsyncThunk(
  'search/searchGlobal',
  async (
    params: { q: string; type?: string; sessionCode?: string; page?: number; size?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get('/search', {
        params: {
          q: params.q,
          type: params.type && params.type !== 'ALL' ? params.type : undefined,
          sessionCode: params.sessionCode,
          page: params.page ?? 0,
          size: params.size ?? 20,
        },
      });

      if (response.data && response.data.success) {
        return response.data.data as SearchResponse;
      }
      return rejectWithValue(response.data?.message || 'Search failed');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Error executing search');
    }
  }
);

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setSelectedType: (state, action: PayloadAction<string>) => {
      state.selectedType = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
      state.items = [];
      state.totalResults = 0;
      state.hasSearched = false;
      state.error = null;
      state.typeCounts = {
        PUBLICATION: 0,
        PATENT: 0,
        BOOK: 0,
        THESIS_AWARDED: 0,
        INSTITUTE: 0,
        FACULTY_SUPERVISOR: 0,
        PAGE: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchGlobal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchGlobal.fulfilled, (state, action: PayloadAction<SearchResponse>) => {
        state.loading = false;
        state.hasSearched = true;
        state.items = action.payload.items || [];
        state.typeCounts = action.payload.typeCounts || {};
        state.totalResults = action.payload.totalResults || 0;
        state.page = action.payload.page || 0;
        state.size = action.payload.size || 20;
        state.totalPages = action.payload.totalPages || 0;
      })
      .addCase(searchGlobal.rejected, (state, action) => {
        state.loading = false;
        state.hasSearched = true;
        state.error = action.payload as string;
      });
  },
});

export const { setQuery, setSelectedType, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
