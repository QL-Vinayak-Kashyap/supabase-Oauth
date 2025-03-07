import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { userApi } from "./api/api";
import { setupListeners } from "@reduxjs/toolkit/query";
import counterReducer from "./slices/counterSlices";
import currentUserReducer from "./slices/currentUserSlice";
import currentBlogTopic from "./slices/currentBlogTopic";
import storage from "redux-persist/lib/storage"; // Local storage for persistence
import { persistReducer, persistStore } from "redux-persist";
import { ThunkMiddleware } from "redux-thunk"; // ✅ Import ThunkMiddleware type
import { Middleware } from "@reduxjs/toolkit"; // ✅ Import Middleware type

// ✅ Configure persistence
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["currentUser", "currentBlogTopic"], // Persist these slices
};

// ✅ Combine reducers
const rootReducer = combineReducers({
  counter: counterReducer,
  currentUser: currentUserReducer,
  currentBlogTopic: currentBlogTopic,
  [userApi.reducerPath]: userApi.reducer,
});

// ✅ Apply persistence
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware): Middleware[] =>
    //@ts-ignore
    getDefaultMiddleware({serializableCheck : {ignoredActions: ["persist/PERSIST"],},}).concat(userApi.middleware as ThunkMiddleware),});

// ✅ Persistor for persisting state across refresh
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);