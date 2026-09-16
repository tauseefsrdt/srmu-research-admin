import { configureStore } from '@reduxjs/toolkit';
import publicationsReducer from './slices/publicationsSlice';
import patentsReducer from './slices/patentsSlice';
import booksReducer from './slices/booksSlice';
import departmentReducer from './slices/departmentSlice';
import statsReducer from './slices/statsSlice';
import institutesReducer from './slices/institutesSlice';
import searchReducer from './slices/searchSlice';

export const store = configureStore({
  reducer: {
    publications: publicationsReducer,
    patents: patentsReducer,
    books: booksReducer,
    department: departmentReducer,
    stats: statsReducer,
    institutes: institutesReducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
