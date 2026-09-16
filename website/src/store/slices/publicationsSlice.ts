import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/apiClient';
import { ResearchPaper, Department } from '../../types';

interface FetchPublicationsParams {
  sessionCode?: string;
  search?: string;
  department?: string;
  year?: string;
  page?: number;
  size?: number;
}

interface PublicationsState {
  items: ResearchPaper[];
  departments: Department[];
  totalElements: number;
  loading: boolean;
  error: string | null;
}

const initialState: PublicationsState = {
  items: [],
  departments: [],
  totalElements: 0,
  loading: false,
  error: null,
};

export const fetchPublications = createAsyncThunk(
  'publications/fetchPublications',
  async (params: FetchPublicationsParams | string = {}, { rejectWithValue }) => {
    try {
      const options: FetchPublicationsParams =
        typeof params === 'string' ? { sessionCode: params } : params;

      const hasAdvancedParams = options.search || options.year || options.department || (options.page !== undefined);

      let res;
      if (hasAdvancedParams) {
        res = await api.get('/research-items', {
          params: {
            categoryCode: 'PUBLICATION',
            sessionCode: options.sessionCode || '2025-26',
            search: options.search || undefined,
            year: options.year || undefined,
            page: options.page ?? 0,
            size: options.size ?? 500,
          },
        });
      } else {
        res = await api.get('/research-items/by-category/PUBLICATION', {
          params: { sessionCode: options.sessionCode || '2025-26' },
        });
      }

      const rawList = res.data?.data?.content || res.data?.data || [];

      if (Array.isArray(rawList)) {
        return rawList.map((item: any, idx: number) => ({
          srNo: item.srNo || idx + 1,
          _id: item.id,
          id: item.id,
          title: item.title,
          authorName: item.primaryAuthor,
          authors: item.primaryAuthor,
          department: item.department || item.rawFacultyInstitute || '',
          departmentKey: item.department || item.rawFacultyInstitute || '',
          journalName: item.venue,
          journal: item.venue,
          yearOfPublication: item.publicationYear || item.eventOrAwardDate || '',
          year: item.publicationYear || item.eventOrAwardDate || '',
          issnNumber: item.identifier,
          ugcRecognitionLink: item.externalLink,
          doi: item.externalLink,
          abstract: item.abstractText || item.identifier,
        }));
      }
      return [];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch publications');
    }
  }
);

const publicationsSlice = createSlice({
  name: 'publications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublications.fulfilled, (state, action: PayloadAction<ResearchPaper[]>) => {
        state.loading = false;
        state.items = action.payload || [];
        state.totalElements = action.payload ? action.payload.length : 0;

        // Compute departments dynamically from live backend data
        const deptCounts: Record<string, number> = {};
        state.items.forEach((p) => {
          const dept = (p.department || '').trim();
          if (dept) {
            deptCounts[dept] = (deptCounts[dept] || 0) + 1;
          }
        });
        state.departments = Object.entries(deptCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([key, count]) => ({ key, name: key, count }));
      })
      .addCase(fetchPublications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default publicationsSlice.reducer;
