import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { userApi } from "./api/api";
import { setupListeners } from "@reduxjs/toolkit/query";
import currentUserReducer from "./slices/currentUserSlice";
import currentBlogTopic from "./slices/currentBlogTopic";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { ThunkMiddleware } from "redux-thunk";
import { Middleware } from "@reduxjs/toolkit";
import currentBlogReducer from "./slices/currentBlogs";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["currentUser", "currentBlogTopic", "currentBlogReducer"], // Persist these slices
};

const rootReducer = combineReducers({
  currentUser: currentUserReducer,
  currentBlogTopic: currentBlogTopic,
  currentBlog: currentBlogReducer,
  [userApi.reducerPath]: userApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware): Middleware[] =>
    //@ts-ignore
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: ["persist/PERSIST"] },
    }).concat(userApi.middleware as ThunkMiddleware),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
