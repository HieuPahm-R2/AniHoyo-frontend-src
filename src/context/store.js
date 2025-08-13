import { configureStore } from '@reduxjs/toolkit';
import accountReducer from '../context/account/accountSlice';

export const store = configureStore({
  reducer: {
    account: accountReducer
  }
})
