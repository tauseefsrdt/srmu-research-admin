import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/apiClient';
import { DEPARTMENTS_LIST } from '../../data/departmentData';

export interface InstituteCardItem {
  id: string;
  dbId?: number;
  slug: string;
  src: string;
  title: string;
  code: string;
  text: string;
  department: string;
  programs?: string[];
}

interface InstitutesState {
  institutes: InstituteCardItem[];
  loading: boolean;
  error: string | null;
}

const defaultInstitutes: InstituteCardItem[] = DEPARTMENTS_LIST.map((dept) => ({
  id: dept.id,
  slug: dept.slug,
  src: dept.image,
  title: dept.title,
  code: dept.code,
  text: dept.description,
  department: dept.departmentCountLabel,
  programs: dept.programs,
}));

const initialState: InstitutesState = {
  institutes: defaultInstitutes,
  loading: false,
  error: null,
};

export const fetchWebsiteInstitutes = createAsyncThunk(
  'institutes/fetchWebsiteInstitutes',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/institutes');
      if (res.data?.data && res.data.data.length > 0) {
        return res.data.data.map((inst: any) => ({
          id: inst.slug || `inst-${inst.id}`,
          dbId: inst.id,
          slug: inst.slug,
          src: inst.image || '/Images/c1.webp',
          title: inst.title || inst.name,
          code: inst.code,
          text: inst.description || '',
          department: inst.departmentCountLabel || `${inst.programs?.length || 3} DEPARTMENTS`,
          programs: inst.programs || [],
        }));
      }
      return defaultInstitutes;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch institutes');
    }
  }
);

const institutesSlice = createSlice({
  name: 'institutes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWebsiteInstitutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWebsiteInstitutes.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.length > 0) {
          state.institutes = action.payload;
        }
      })
      .addCase(fetchWebsiteInstitutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default institutesSlice.reducer;
