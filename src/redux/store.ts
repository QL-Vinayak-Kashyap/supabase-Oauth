import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlices";
import { userApi } from "./api/api";
import { setupListeners } from "@reduxjs/toolkit/query";
import currentUserReducer from "./slices/currentUserSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    currentUser:currentUserReducer,
    [userApi.reducerPath]:userApi.reducer 
  },
  middleware:(getDefaultMiddleware) =>getDefaultMiddleware().concat(userApi.middleware)
});


// Infer the `RootState` and `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>;  
export type AppDispatch = typeof store.dispatch;
setupListeners(store.dispatch);
