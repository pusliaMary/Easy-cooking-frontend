import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { api } from "@/shared/api/api";

const appReducer = (state = {}) => state;

const rootReducer = combineReducers({
  app: appReducer,
  [api.reducerPath]: api.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});