import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import institutesReducer from './slices/institutesSlice';
import masterReducer from './slices/masterSlice';
import researchReducer from './slices/researchSlice';
import facultyReducer from './slices/facultySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    institutes: institutesReducer,
    master: masterReducer,
    research: researchReducer,
    faculty: facultyReducer,
  },
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
