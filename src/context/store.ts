import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './slice/accountSlice';
import roleReducer from '@/context/slice/roleSlide';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    role: roleReducer
  }
})
