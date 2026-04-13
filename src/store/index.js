import { configureStore } from "@reduxjs/toolkit";
import moduleFiltersReducer from "./moduleFiltersSlice";

export const store = configureStore({
  reducer: {
    moduleFilters: moduleFiltersReducer,
  },
});

export default store;
