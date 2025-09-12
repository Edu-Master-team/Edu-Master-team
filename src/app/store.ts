// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import { APISlice } from "./features/APISlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [APISlice.reducerPath]: APISlice.reducer,
  },
  middleware: (getDefault) => getDefault().concat(APISlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
