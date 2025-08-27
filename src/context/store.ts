import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './slice/accountSlice';
import roleReducer from '@/context/slice/roleSlide';
import permissionReducer from './slice/permissionSlice';
import userReducer from './slice/userSlice';
export const store = configureStore({
  reducer: {
    account: accountReducer,
    role: roleReducer,
   permission: permissionReducer,
   user: userReducer,
  }
})
