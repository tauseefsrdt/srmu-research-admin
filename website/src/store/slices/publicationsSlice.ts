import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/apiClient';
import { ResearchPaper, Department } from '../../types';
import { researchPapers as fallbackPapers } from '../../data/data';

interface PublicationsState {
  items: ResearchPaper[];
  departments: Department[];
  loading: boolean;
  error: string | null;
}

const initialState: PublicationsState = {
  items: (fallbackPapers as any[]).map((p, idx) => ({
    ...p,
    id: p._id || p.srNo || idx + 1,
    year: p.yearOfPublication,
    journal: p.journalName,
    issn: p.issnNumber,
    link: p.ugcRecognitionLink,
  })),
  departments: [],
  loading: false,
  error: null,
};

export const fetchPublications = createAsyncThunk(
  'publications/fetchPublications',
  async (sessionCode: string = '2025-26', { rejectWithValue }) => {
    try {
      const res = await api.get('/research-items/by-category/PUBLICATION', {
        params: { sessionCode },
      });
      if (res.data?.data && res.data.data.length > 0) {
        return res.data.data.map((item: any, idx: number) => ({
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
      return rejectWithValue(err.message || 'Failed to fetch publications');
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
        if (action.payload && action.payload.length > 0) {
          state.items = action.payload;
        }
        // Compute departments
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
